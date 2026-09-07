import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildCaldavUrl,
  ConfigError,
  GOOGLE_CALDAV_PREFIX,
  GOOGLE_TOKEN_URL,
  resolveConfig,
} from '../lib/index.js'

const oauth = { clientId: 'client', clientSecret: 'secret', refreshToken: 'refresh' }

test('google 预设拼出 CalDAV 集合 URL', () => {
  const resolved = resolveConfig({ provider: 'google', username: 'a@gmail.com', calendarId: 'a@gmail.com', ...oauth }, {})
  assert.equal(resolved.caldavUrl, GOOGLE_CALDAV_PREFIX + encodeURIComponent('a@gmail.com') + '/events')
  assert.equal(resolved.username, 'a@gmail.com')
  assert.equal(resolved.provider, 'google')
})

test('nextcloud 预设拼出 URL（host 去尾斜杠）', () => {
  const resolved = resolveConfig({ provider: 'nextcloud', username: 'u', password: 'p', host: 'https://cloud.example.com/', user: 'alice', calendar: 'personal' }, {})
  assert.equal(resolved.caldavUrl, 'https://cloud.example.com/remote.php/dav/calendars/alice/personal/')
})

test('custom 使用手填 caldavUrl', () => {
  const resolved = resolveConfig({ provider: 'custom', username: 'u', password: 'p', caldavUrl: 'https://dav.example.com/cal/' }, {})
  assert.equal(resolved.caldavUrl, 'https://dav.example.com/cal/')
})

test('password 可从环境变量 DSH_CALENDAR_PASSWORD 读取', () => {
  const resolved = resolveConfig({ provider: 'custom', username: 'u', caldavUrl: 'https://x/' }, { DSH_CALENDAR_PASSWORD: 'app-pass' })
  assert.equal(resolved.password, 'app-pass')
})

test('显式 password 优先于环境变量', () => {
  const resolved = resolveConfig({ provider: 'custom', username: 'u', password: 'explicit', caldavUrl: 'https://x/' }, { DSH_CALENDAR_PASSWORD: 'env-pass' })
  assert.equal(resolved.password, 'explicit')
})

test('缺 username 抛中文指引错误', () => {
  assert.throws(
    () => resolveConfig({ provider: 'custom', password: 'p', caldavUrl: 'https://x/' }, {}),
    (error) => error instanceof ConfigError && /username/.test(error.message) && /cordis\.patch\.yml/.test(error.message),
  )
})

test('缺密码抛中文指引错误', () => {
  assert.throws(
    () => resolveConfig({ provider: 'custom', username: 'u', caldavUrl: 'https://x/' }, {}),
    (error) => error instanceof ConfigError && /密码|DSH_CALENDAR_PASSWORD/.test(error.message),
  )
})

test('google 缺 calendarId 抛中文指引错误', () => {
  assert.throws(
    () => resolveConfig({ provider: 'google', ...oauth }, {}),
    (error) => error instanceof ConfigError && /calendarId/.test(error.message),
  )
})

test('nextcloud 缺字段抛中文指引错误', () => {
  assert.throws(
    () => resolveConfig({ provider: 'nextcloud', username: 'u', password: 'p', host: 'https://x/' }, {}),
    (error) => error instanceof ConfigError && /host/.test(error.message),
  )
})

test('icloud 未给 caldavUrl 抛中文指引', () => {
  assert.throws(
    () => resolveConfig({ provider: 'icloud', username: 'u', password: 'p' }, {}),
    (error) => error instanceof ConfigError && /icloud/.test(error.message),
  )
})

test('非法 provider 抛中文错误', () => {
  assert.throws(
    () => resolveConfig({ provider: 'bogus', username: 'u', password: 'p', caldavUrl: 'https://x/' }, {}),
    (error) => error instanceof ConfigError && /provider/.test(error.message),
  )
})

test('buildCaldavUrl 手填 caldavUrl 优先于预设', () => {
  assert.equal(buildCaldavUrl({ caldavUrl: 'https://manual/', provider: 'google' }, 'google'), 'https://manual/')
})

test('Google OAuth does not require username/password and defaults to the official token endpoint', () => {
  const resolved = resolveConfig({ provider: 'google', calendarId: 'a@gmail.com', ...oauth }, { DSH_CALENDAR_PASSWORD: 'ignored' })
  assert.equal(resolved.username, '')
  assert.equal(resolved.password, '')
  assert.deepEqual(resolved.oauth, { ...oauth, tokenUrl: GOOGLE_TOKEN_URL })
})

test('OAuth fields support environment fallbacks and explicit config takes precedence', () => {
  const env = { DSH_CALENDAR_CLIENT_ID: 'env-id', DSH_CALENDAR_CLIENT_SECRET: 'env-secret',
    DSH_CALENDAR_REFRESH_TOKEN: 'env-refresh', DSH_CALENDAR_TOKEN_URL: 'https://tokens.example/token' }
  const config = { provider: 'google', calendarId: 'a@gmail.com' }
  assert.deepEqual(resolveConfig(config, env).oauth, {
    clientId: 'env-id', clientSecret: 'env-secret', refreshToken: 'env-refresh', tokenUrl: env.DSH_CALENDAR_TOKEN_URL,
  })
  assert.deepEqual(resolveConfig({ ...config, ...oauth, tokenUrl: GOOGLE_TOKEN_URL }, env).oauth, { ...oauth, tokenUrl: GOOGLE_TOKEN_URL })
})

test('Google app passwords and an explicit Basic selection fail with OAuth guidance', () => {
  for (const authMethod of [undefined, 'basic']) {
    assert.throws(() => resolveConfig({ provider: 'google', authMethod, calendarId: 'a@gmail.com', username: 'a@gmail.com', password: 'never-print-me' }, {}),
      error => error instanceof ConfigError && /OAuth/.test(error.message) && !error.message.includes('never-print-me'))
  }
})

test('partial OAuth config names missing fields without exposing supplied secrets', () => {
  assert.throws(() => resolveConfig({ provider: 'google', calendarId: 'a@gmail.com', clientSecret: 'never-print-me' }, {}),
    error => /clientId.*refreshToken/.test(error.message) && !error.message.includes('never-print-me'))
})

test('Basic providers ignore unrelated OAuth environment variables', () => {
  for (const provider of ['icloud', 'nextcloud', 'custom']) {
    const result = resolveConfig({ provider, caldavUrl: 'https://dav.example/cal/', username: 'user', password: 'app-pass' },
      { DSH_CALENDAR_CLIENT_ID: 'id', DSH_CALENDAR_CLIENT_SECRET: 'secret', DSH_CALENDAR_REFRESH_TOKEN: 'refresh' })
    assert.equal(result.oauth, undefined)
    assert.equal(result.password, 'app-pass')
  }
})

test('custom OAuth is opt-in and needs its own token endpoint', () => {
  const config = { provider: 'custom', authMethod: 'oauth', caldavUrl: 'https://dav.example/cal/', ...oauth }
  assert.throws(() => resolveConfig(config, {}), /tokenUrl/)
  assert.equal(resolveConfig({ ...config, tokenUrl: 'https://auth.example/token' }, {}).oauth.tokenUrl, 'https://auth.example/token')
})

test('invalid auth methods and insecure OAuth endpoints are rejected without echoing URLs', () => {
  assert.throws(() => resolveConfig({ provider: 'google', authMethod: 'typo', ...oauth }, {}), /authMethod/)
  const config = { provider: 'google', calendarId: 'a@gmail.com', ...oauth }
  for (const field of ['tokenUrl', 'caldavUrl']) {
    for (const url of ['http://example.com/never-print-me', 'https://user:never-print-me@example.com/', 'https://example.com/?access_token=never-print-me', 'https://example.com/#never-print-me', 'never-print-me']) {
      assert.throws(() => resolveConfig({ ...config, [field]: url }, {}), error => /HTTPS/.test(error.message) && !error.message.includes('never-print-me'))
    }
  }
})
