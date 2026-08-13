import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildCaldavUrl,
  ConfigError,
  GOOGLE_CALDAV_PREFIX,
  resolveConfig,
} from '../lib/index.js'

test('google 预设拼出 CalDAV 集合 URL', () => {
  const resolved = resolveConfig({ provider: 'google', username: 'a@gmail.com', password: 'p', calendarId: 'a@gmail.com' }, {})
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
    () => resolveConfig({ provider: 'google', username: 'u', password: 'p' }, {}),
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
