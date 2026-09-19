#!/usr/bin/env node
/**
 * 换一枚 Google refresh token —— Google 的 CalDAV 只认 OAuth，而 refresh token 只能靠
 * 一次浏览器授权拿到。桌面应用（Desktop app）类型的客户端只允许 http://127.0.0.1 回调，
 * 所以这里起一个一次性的本地服务器收 code，再拿 code 去换 token。
 *
 * 用法：
 *   node scripts/google-oauth.mjs --client-id <你的 clientId> --client-secret <你的 clientSecret>
 *   （也可用环境变量 DSH_CALENDAR_CLIENT_ID / DSH_CALENDAR_CLIENT_SECRET）
 *
 * 可选：--scope calendar|calendar.readonly  --port <n>  --no-open  --timeout <秒>  --token-url <url>（仅测试）
 */
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
export const TOKEN_URL = 'https://oauth2.googleapis.com/token'
export const SCOPE_FULL = 'https://www.googleapis.com/auth/calendar'
export const SCOPE_READONLY = 'https://www.googleapis.com/auth/calendar.readonly'

/** 拼授权地址：access_type=offline + prompt=consent 才会每次都发 refresh token。 */
export function buildAuthUrl(options) {
  const params = new URLSearchParams({
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    response_type: 'code',
    scope: options.scope,
    access_type: 'offline',
    prompt: 'consent',
  })
  return AUTH_URL + '?' + params.toString()
}

/** 用 code 换 token。失败时把 Google 的原话带出来（它比任何包装都清楚）。 */
export async function exchangeCode(options) {
  const body = new URLSearchParams({
    code: options.code,
    client_id: options.clientId,
    client_secret: options.clientSecret,
    redirect_uri: options.redirectUri,
    grant_type: 'authorization_code',
  })
  const response = await fetch(options.tokenUrl ?? TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  })
  const payload = await response.json().catch(() => ({}))
  if (response.status !== 200 || typeof payload.refresh_token !== 'string' || payload.refresh_token === '') {
    const detail = typeof payload.error_description === 'string' ? payload.error_description : JSON.stringify(payload)
    throw new Error('换取 refresh token 失败（HTTP ' + response.status + '）：' + detail)
  }
  return payload
}

/** 参数解析：命令行优先，其次环境变量。 */
export function parseArgs(argv, env = process.env) {
  const out = {
    clientId: env.DSH_CALENDAR_CLIENT_ID ?? '',
    clientSecret: env.DSH_CALENDAR_CLIENT_SECRET ?? '',
    scope: SCOPE_FULL,
    port: 0,
    open: true,
    timeoutSeconds: 300,
    tokenUrl: undefined,
  }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = () => { i += 1; return argv[i] }
    if (arg === '--client-id') out.clientId = next() ?? ''
    else if (arg === '--client-secret') out.clientSecret = next() ?? ''
    else if (arg === '--scope') out.scope = (next() ?? 'calendar') === 'calendar.readonly' ? SCOPE_READONLY : SCOPE_FULL
    else if (arg === '--port') out.port = Number(next() ?? 0) || 0
    else if (arg === '--no-open') out.open = false
    else if (arg === '--timeout') out.timeoutSeconds = Number(next() ?? 300) || 300
    else if (arg === '--token-url') out.tokenUrl = next()
    else if (arg === '--help' || arg === '-h') out.help = true
  }
  return out
}

/** 打开浏览器：Windows 用 cmd start，macOS 用 open，其他用 xdg-open。 */
function openBrowser(url) {
  try {
    if (process.platform === 'win32') spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore', detached: true }).unref()
    else if (process.platform === 'darwin') spawn('open', [url], { stdio: 'ignore', detached: true }).unref()
    else spawn('xdg-open', [url], { stdio: 'ignore', detached: true }).unref()
  } catch (error) { /* 打不开就靠用户自己复制链接 */ }
}

const PAGE_OK = '<meta charset="utf-8"><title>dsh-calendar</title><body style="font-family:system-ui;padding:40px">'
  + '<h2>授权成功 ✅</h2><p>可以关掉这个页面，回到终端复制 refresh token。</p>'
const PAGE_FAIL = '<meta charset="utf-8"><title>dsh-calendar</title><body style="font-family:system-ui;padding:40px">'
  + '<h2>授权失败 ❌</h2><p>回到终端看错误信息。</p>'

/** 起本地回调、等 code、换 token。 */
export async function runFlow(options) {
  let resolveCode
  let rejectCode
  const codePromise = new Promise((resolve, reject) => { resolveCode = resolve; rejectCode = reject })
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1')
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    if (code === null && error === null) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
      response.end('waiting for /?code=...')
      return
    }
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    response.end(error === null ? PAGE_OK : PAGE_FAIL)
    if (error !== null) rejectCode(new Error('授权被拒绝：' + error))
    else resolveCode(decodeURIComponent(code))
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(options.port, '127.0.0.1', resolve)
  })
  const address = server.address()
  const port = typeof address === 'object' && address !== null ? address.port : options.port
  const redirectUri = 'http://127.0.0.1:' + port + '/'
  const authUrl = buildAuthUrl({ clientId: options.clientId, redirectUri, scope: options.scope })
  console.log('')
  console.log('1) 用你的 Google 账号打开下面这个链接授权：')
  console.log('   ' + authUrl)
  console.log('')
  console.log('2) 等待回调中（最多 ' + options.timeoutSeconds + ' 秒）…')
  if (options.open === true) openBrowser(authUrl)
  const timer = setTimeout(() => rejectCode(new Error('等待超时：没有收到授权回调')), options.timeoutSeconds * 1000)
  try {
    const code = await codePromise
    const payload = await exchangeCode({ code, clientId: options.clientId, clientSecret: options.clientSecret, redirectUri, tokenUrl: options.tokenUrl })
    return { refreshToken: payload.refresh_token, scope: payload.scope, accessToken: payload.access_token }
  } finally {
    clearTimeout(timer)
    server.close()
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help === true) {
    console.log('用法：node scripts/google-oauth.mjs --client-id <id> --client-secret <secret>')
    console.log('可选：--scope calendar|calendar.readonly  --port <n>  --no-open  --timeout <秒>')
    return
  }
  if (options.clientId === '' || options.clientSecret === '') {
    console.error('缺少 clientId / clientSecret：用 --client-id 与 --client-secret 传入，或设 DSH_CALENDAR_CLIENT_ID / DSH_CALENDAR_CLIENT_SECRET。')
    process.exitCode = 2
    return
  }
  runFlow(options).then((result) => {
    console.log('')
    console.log('✅ 拿到 refresh token：')
    console.log('   ' + result.refreshToken)
    console.log('')
    console.log('把它连同 clientId / clientSecret 填进面板的「连接设置」（provider 选 Google，calendarId 填你的 Gmail 地址）。')
    console.log('提示：OAuth 同意屏还停在「测试」状态时 refresh token 只有 7 天有效，到「OAuth 同意屏幕」点「发布应用」即可长期有效。')
  }).catch((error) => {
    console.error('❌ ' + (error instanceof Error ? error.message : String(error)))
    process.exitCode = 1
  })
}

if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1]) main()
