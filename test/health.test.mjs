import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildCalendarTools } from '../lib/index.js'

test('calendar_health 配置完整时 ok=true', async () => {
  const health = buildCalendarTools({ provider: 'custom', caldavUrl: 'https://caldav.example.com/x', username: 'u@example.com', password: 'p' }).find((t) => t.name === 'calendar_health')
  const value = await health.execute({})
  assert.equal(value.ok, true)
  assert.equal(value.checks.length, 4)
  const blocks = health.output.render({}, value)
  assert.match(blocks[0].text, /自检：正常/)
})

test('calendar_health 缺账号密码时 ok=false 且给出指引', async () => {
  const health = buildCalendarTools({ caldavUrl: 'https://caldav.example.com/x' }).find((t) => t.name === 'calendar_health')
  const value = await health.execute({})
  assert.equal(value.ok, false)
  const bad = value.checks.filter((c) => c.ok === false)
  assert.ok(bad.length >= 2)
  assert.match(String(bad.map((c) => c.detail).join(' ')), /username|password/)
})

test('calendar_health google 预设可推导日历地址', async () => {
  const health = buildCalendarTools({ provider: 'google', calendarId: 'u@gmail.com', username: 'u@gmail.com', password: 'p' }).find((t) => t.name === 'calendar_health')
  const value = await health.execute({})
  assert.equal(value.ok, true)
  assert.match(String(value.checks[1].detail), /https:\/\/apidata\.googleusercontent\.com\/caldav\/v2\/u%40gmail\.com\/events/)
})

test('calendar_health 缺 Google calendarId 时给出可操作指引', async () => {
  const health = buildCalendarTools({ provider: 'google', username: 'u@gmail.com', password: 'p' }).find((t) => t.name === 'calendar_health')
  const value = await health.execute({})
  assert.equal(value.ok, false)
  assert.match(value.checks.find((check) => check.name === '日历地址').detail, /calendarId/)
})
