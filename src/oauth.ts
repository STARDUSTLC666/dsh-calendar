/** 请求时刷新 OAuth 头；不把 Bearer token 固定到长期缓存的 DAV 客户端。 */
import { getOauthHeaders, type DAVCredentials } from 'tsdav'
import type { CalendarOAuthCredentials } from './config.js'

export class OAuthError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
    this.name = 'OAuthError'
  }
}

type OAuthFailure = { error?: string; error_subtype?: string }

/** OAuth error fields are diagnostics, not display text: accept identifiers only, never descriptions. */
function oauthErrorDetails(response: Response): Promise<OAuthFailure> {
  return response.clone().json().then((body: unknown) => {
    if (body === null || typeof body !== 'object' || Array.isArray(body)) return {}
    const record = body as Record<string, unknown>
    const identifier = (value: unknown): string | undefined =>
      typeof value === 'string' && value.length <= 80 && /^[A-Za-z0-9_.-]+$/.test(value) ? value : undefined
    return { error: identifier(record.error), error_subtype: identifier(record.error_subtype) }
  }).catch(() => ({}))
}

function refreshFailureMessage(status: number, failure: OAuthFailure): string {
  const code = failure.error?.toLowerCase()
  const subtype = failure.error_subtype?.toLowerCase()
  let guidance: string
  if (status === 429 || status >= 500 || code === 'temporarily_unavailable' || code === 'server_error') {
    guidance = '日历授权服务暂时不可用。请稍后重试；若使用代理，也请确认代理连接正常。'
  } else if (code === 'invalid_grant' && subtype === 'invalid_rapt') {
    guidance = 'Google 账号要求重新验证。请打开连接设置，重新完成日历授权后保存。'
  } else if (code === 'invalid_grant') {
    guidance = '日历授权可能已失效或与当前应用不匹配。请打开连接设置，重新完成日历授权后保存。'
  } else if (code === 'invalid_client' || code === 'deleted_client' || code === 'unauthorized_client') {
    guidance = '日历连接设置不正确，当前 OAuth 应用无法完成授权。请打开连接设置，核对 OAuth 应用配置后重试。'
  } else if (code === 'invalid_scope') {
    guidance = '日历授权未包含插件所需的权限范围。请在连接设置中使用日历读写权限重新授权。'
  } else if (code === 'invalid_request' || code === 'unsupported_grant_type') {
    guidance = '日历连接设置不正确，授权服务未接受当前请求。请打开连接设置，核对授权服务地址和 OAuth 应用配置。'
  } else {
    guidance = '日历授权服务拒绝了当前请求。请打开连接设置核对配置后重试。'
  }
  // 顺序固定为 OAuth 标识在前、HTTP 状态在后：测试与用户排障都按这个顺序读。
  const diagnostic = [failure.error === undefined ? undefined : 'OAuth error: ' + failure.error,
    failure.error_subtype === undefined ? undefined : 'subtype: ' + failure.error_subtype,
    'HTTP ' + status].filter(Boolean).join('，')
  return guidance + ' 诊断信息：' + diagnostic + '。'
}

/** A caller can leave the refresh queue without cancelling another caller's exchange. */
function waitWithSignal<T>(task: Promise<T>, signal?: AbortSignal | null): Promise<T> {
  if (!signal) return task
  return new Promise<T>((resolve, reject) => {
    const onAbort = (): void => reject(signal.reason)
    signal.addEventListener('abort', onAbort, { once: true })
    task.then(
      value => { signal.removeEventListener('abort', onAbort); resolve(value) },
      error => { signal.removeEventListener('abort', onAbort); reject(error) },
    )
    if (signal.aborted) onAbort()
  })
}

/** One connection owns credentials and refresh serialization for all its collections. */
export function createOAuthConnection(config: CalendarOAuthCredentials, transport: typeof fetch): (calendarUrl: string) => typeof fetch {
  let credentials: DAVCredentials = { ...config }
  let refreshQueue: Promise<unknown> = Promise.resolve()
  const tokenFetch: typeof fetch = async (input, init) => {
    const response = await transport(input, { ...init, redirect: 'error' })
    if (!response.ok) {
      // 只读取标准 OAuth 错误标识；绝不回显自由文本描述，避免泄露凭据或服务端数据。
      throw new OAuthError(refreshFailureMessage(response.status, await oauthErrorDetails(response)), response.status)
    }
    let body: Record<string, unknown>
    try {
      body = await response.clone().json() as Record<string, unknown>
    } catch {
      throw new OAuthError('OAuth 令牌端点返回了无效 JSON；未发送日历请求。')
    }
    if (body === null || typeof body !== 'object' || typeof body.access_token !== 'string' || !/^[A-Za-z0-9._~+\/-]+=*$/.test(body.access_token)
      || (body.token_type !== undefined && String(body.token_type).toLowerCase() !== 'bearer')
      || (body.expires_in !== undefined && (typeof body.expires_in !== 'number' || !Number.isFinite(body.expires_in) || body.expires_in <= 0))
      || (body.refresh_token !== undefined && (typeof body.refresh_token !== 'string' || body.refresh_token.trim() === ''))) {
      throw new OAuthError('OAuth 令牌响应缺少有效的 Bearer access_token 或有效期；未发送日历请求。')
    }
    return response
  }

  return (calendarUrl) => {
    // Every collection keeps its own origin restriction even though authorization
    // is shared within the explicitly configured connection.
    const calendarOrigin = new URL(calendarUrl).origin
    return async (input, init) => {
      const signal = init?.signal ?? (input instanceof Request ? input.signal : undefined)
      signal?.throwIfAborted()
      // 日历对象 href 属于服务端数据；不可用它把 Bearer token 带到其它源或 HTTP。
      const requestUrl = new URL(input instanceof Request ? input.url : String(input))
      if (requestUrl.origin !== calendarOrigin || requestUrl.username !== '' || requestUrl.password !== '') {
        throw new OAuthError('OAuth 日历请求拒绝跨源或带内嵌凭据的对象地址；请检查 caldavUrl 与服务器返回的 href。')
      }
      // Refresh tokens may be single-use. Read the latest credentials inside the
      // queue so concurrent requests never exchange the same expired token twice.
      const authorization = refreshQueue.then(async () => {
        signal?.throwIfAborted()
        const previous = credentials
        const snapshot = { ...previous }
        // 提前 30 秒刷新，避免传输过程中到期。
        if ((snapshot.expiration ?? 0) <= Date.now() + 30_000) snapshot.expiration = 0
        const result = await getOauthHeaders(snapshot, { signal }, tokenFetch)
        signal?.throwIfAborted()
        if (!result.headers.authorization) throw new OAuthError('OAuth 未取得访问令牌；请重新授权。')
        // Cached reads must not undo a concurrent 401 invalidation.
        if (snapshot.accessToken !== previous.accessToken || snapshot.expiration !== previous.expiration || snapshot.refreshToken !== previous.refreshToken) {
          credentials = snapshot
        }
        return { headers: result.headers, accessToken: snapshot.accessToken }
      })
      // A failed/cancelled exchange cannot poison later attempts.
      refreshQueue = authorization.then(() => {}, () => {})
      let authorized: Awaited<typeof authorization>
      try {
        authorized = await waitWithSignal(authorization, signal)
      } catch (error) {
        signal?.throwIfAborted()
        if (error instanceof OAuthError) throw error
        throw new OAuthError('OAuth 令牌请求失败：请检查网络、proxyUrl 与 tokenUrl，然后重试。')
      }
      const requestHeaders = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined))
      for (const [name, value] of Object.entries(authorized.headers)) requestHeaders.set(name, value)
      let response: Response
      try {
        response = await transport(input, { ...init, headers: requestHeaders, redirect: 'error' })
      } catch {
        signal?.throwIfAborted()
        throw new OAuthError('OAuth 日历请求失败：请检查网络、proxyUrl 与日历地址；请求不允许重定向。')
      }
      // 不自动重放写请求；下一次调用会刷新，不复用已被服务端拒绝的 token。
      if (response.status === 401 && credentials.accessToken === authorized.accessToken) credentials = { ...credentials, expiration: 0 }
      return response
    }
  }
}

/** Standalone collections own an independent OAuth connection by default. */
export function createOAuthFetch(config: CalendarOAuthCredentials, transport: typeof fetch, calendarUrl: string): typeof fetch {
  return createOAuthConnection(config, transport)(calendarUrl)
}
