/** 请求时刷新 OAuth 头；不把 Bearer token 固定到长期缓存的 DAV 客户端。 */
import { getOauthHeaders } from 'tsdav';
export class OAuthError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'OAuthError';
    }
}
/** tsdav 管理 token/expiry；此层补上失败校验、取消、代理与不泄露凭据的错误。 */
export function createOAuthFetch(config, transport, calendarUrl) {
    const calendarOrigin = new URL(calendarUrl).origin;
    let credentials = { ...config };
    const tokenFetch = async (input, init) => {
        const response = await transport(input, { ...init, redirect: 'error' });
        if (!response.ok) {
            // 不读取/回显响应正文：服务端可能原样回显 client secret 或 refresh token。
            throw new OAuthError('OAuth 令牌刷新失败（HTTP ' + response.status +
                '）：请检查 clientId、clientSecret、refreshToken；授权撤销或过期时请重新授权。', response.status);
        }
        let body;
        try {
            body = await response.clone().json();
        }
        catch {
            throw new OAuthError('OAuth 令牌端点返回了无效 JSON；未发送日历请求。');
        }
        if (body === null || typeof body !== 'object' || typeof body.access_token !== 'string' || !/^[A-Za-z0-9._~+\/-]+=*$/.test(body.access_token)
            || (body.token_type !== undefined && String(body.token_type).toLowerCase() !== 'bearer')
            || (body.expires_in !== undefined && (typeof body.expires_in !== 'number' || !Number.isFinite(body.expires_in) || body.expires_in <= 0))
            || (body.refresh_token !== undefined && (typeof body.refresh_token !== 'string' || body.refresh_token.trim() === ''))) {
            throw new OAuthError('OAuth 令牌响应缺少有效的 Bearer access_token 或有效期；未发送日历请求。');
        }
        return response;
    };
    return async (input, init) => {
        const signal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
        signal?.throwIfAborted();
        // 日历对象 href 属于服务端数据；不可用它把 Bearer token 带到其它源或 HTTP。
        const requestUrl = new URL(input instanceof Request ? input.url : String(input));
        if (requestUrl.origin !== calendarOrigin || requestUrl.username !== '' || requestUrl.password !== '') {
            throw new OAuthError('OAuth 日历请求拒绝跨源或带内嵌凭据的对象地址；请检查 caldavUrl 与服务器返回的 href。');
        }
        // 每次请求用自己的快照与 signal；并发调用不会共享某一次调用的取消信号。
        const previous = credentials;
        const snapshot = { ...previous };
        // 提前 30 秒刷新，避免传输过程中到期。
        if ((snapshot.expiration ?? 0) <= Date.now() + 30_000)
            snapshot.expiration = 0;
        let headers;
        try {
            const result = await getOauthHeaders(snapshot, { signal }, tokenFetch);
            signal?.throwIfAborted();
            if (!result.headers.authorization)
                throw new OAuthError('OAuth 未取得访问令牌；请重新授权。');
            headers = result.headers;
        }
        catch (error) {
            signal?.throwIfAborted();
            if (error instanceof OAuthError)
                throw error;
            throw new OAuthError('OAuth 令牌请求失败：请检查网络、proxyUrl 与 tokenUrl，然后重试。');
        }
        // 只有实际刷新的调用才更新缓存，避免使用旧快照的并发读取覆盖新令牌。
        if (snapshot.accessToken !== previous.accessToken || snapshot.expiration !== previous.expiration || snapshot.refreshToken !== previous.refreshToken) {
            credentials = snapshot;
        }
        const requestHeaders = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
        for (const [name, value] of Object.entries(headers))
            requestHeaders.set(name, value);
        let response;
        try {
            response = await transport(input, { ...init, headers: requestHeaders, redirect: 'error' });
        }
        catch {
            signal?.throwIfAborted();
            throw new OAuthError('OAuth 日历请求失败：请检查网络、proxyUrl 与日历地址；请求不允许重定向。');
        }
        // 不自动重放写请求；下一次调用会刷新，不复用已被服务端拒绝的 token。
        if (response.status === 401 && credentials.accessToken === snapshot.accessToken)
            credentials = { ...credentials, expiration: 0 };
        return response;
    };
}
