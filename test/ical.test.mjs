import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildICalString, generateUid, parseEventFromICal } from '../lib/index.js'

test('定时事件 round-trip：字段、UTC 化与 uid/etag', () => {
  const ical = buildICalString({
    summary: '团队评审',
    start: '2025-03-01T09:00:00+08:00',
    end: '2025-03-01T10:30:00+08:00',
    description: '周会',
    location: '会议室A',
  })
  assert.match(ical, /BEGIN:VEVENT/)
  const event = parseEventFromICal(ical, 'https://cal.example.com/events/abc.ics', 'etag-1')
  assert.ok(event, '应解析出事件')
  assert.equal(event.summary, '团队评审')
  assert.equal(event.description, '周会')
  assert.equal(event.location, '会议室A')
  assert.equal(event.start, '2025-03-01T01:00:00Z')
  assert.equal(event.end, '2025-03-01T02:30:00Z')
  assert.equal(event.allDay, false)
  assert.equal(event.uid, 'https://cal.example.com/events/abc.ics')
  assert.equal(event.href, 'https://cal.example.com/events/abc.ics')
  assert.equal(event.etag, 'etag-1')
  assert.ok(event.icalUid, '应自动生成 iCal UID')
})

test('全天事件 round-trip：YYYY-MM-DD 与 VALUE=DATE', () => {
  const ical = buildICalString({ summary: '生日', start: '2025-04-01', end: '2025-04-01', allDay: true })
  assert.match(ical, /DTSTART;VALUE=DATE:20250401/)
  const event = parseEventFromICal(ical, 'x.ics')
  assert.equal(event.allDay, true)
  assert.equal(event.start, '2025-04-01')
  assert.equal(event.end, '2025-04-01')
})

test('解析固定 .ics 文本：RRULE 与 STATUS 原样保留', () => {
  const raw = [
    'BEGIN:VCALENDAR',
    'BEGIN:VEVENT',
    'UID:fixed-uid-1@example.com',
    'SUMMARY:固定事件',
    'DTSTART:20250210T030000Z',
    'DTEND:20250210T040000Z',
    'RRULE:FREQ=WEEKLY;BYDAY=MO',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const event = parseEventFromICal(raw, 'https://x/e.ics', 'e1')
  assert.ok(event)
  assert.equal(event.summary, '固定事件')
  assert.equal(event.icalUid, 'fixed-uid-1@example.com')
  assert.equal(event.start, '2025-02-10T03:00:00Z')
  assert.equal(event.end, '2025-02-10T04:00:00Z')
  assert.match(event.rrule, /FREQ=WEEKLY/)
  assert.equal(event.status, 'CONFIRMED')
})

test('解析失败 / 无 VEVENT 返回 null', () => {
  assert.equal(parseEventFromICal('not an ical', 'href'), null)
  assert.equal(parseEventFromICal('BEGIN:VCALENDAR\nEND:VCALENDAR', 'href'), null)
})

test('显式 icalUid 在 round-trip 中保留（用于更新）', () => {
  const ical = buildICalString({
    summary: 'x',
    start: '2025-01-01T00:00:00Z',
    end: '2025-01-01T01:00:00Z',
    icalUid: 'keep-me@example.com',
  })
  const event = parseEventFromICal(ical, 'h')
  assert.equal(event.icalUid, 'keep-me@example.com')
})

test('generateUid 每次唯一', () => {
  assert.notEqual(generateUid(), generateUid())
})
