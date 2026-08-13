import { test } from 'node:test'
import assert from 'node:assert/strict'
import { expandEventFromICal } from '../lib/index.js'

const HREF = 'https://cal.example.com/events/weekly.ics'

function vevent(uid, lines) {
  return ['BEGIN:VCALENDAR', 'BEGIN:VEVENT', 'UID:' + uid, ...lines, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
}

test('每周例会展开 4 次：每个实例独立成行并带稳定标识', () => {
  const raw = vevent('weekly@example.com', [
    'SUMMARY:周会',
    'DTSTART:20250203T090000Z',
    'DTEND:20250203T100000Z',
    'RRULE:FREQ=WEEKLY;BYDAY=MO',
  ])
  const events = expandEventFromICal(raw, HREF, 'etag-1', '2025-02-01T00:00:00Z', '2025-02-25T00:00:00Z', 10)
  assert.equal(events.length, 4)
  assert.deepEqual(events.map((e) => e.start), [
    '2025-02-03T09:00:00Z',
    '2025-02-10T09:00:00Z',
    '2025-02-17T09:00:00Z',
    '2025-02-24T09:00:00Z',
  ])
  for (const event of events) {
    assert.equal(event.uid, HREF)
    assert.equal(event.href, HREF)
    assert.equal(event.icalUid, 'weekly@example.com')
    assert.equal(event.etag, 'etag-1')
    assert.equal(event.end, event.start.slice(0, 10) + 'T10:00:00Z')
    assert.equal(event.isOccurrence, true)
    assert.equal(event.seriesStart, '2025-02-03T09:00:00Z')
    assert.equal(event.rrule, undefined)
  }
})

test('查询窗口截断：只返回窗口内的实例', () => {
  const raw = vevent('weekly@example.com', [
    'SUMMARY:周会',
    'DTSTART:20250203T090000Z',
    'DTEND:20250203T100000Z',
    'RRULE:FREQ=WEEKLY;BYDAY=MO',
  ])
  const events = expandEventFromICal(raw, HREF, undefined, '2025-02-17T00:00:00Z', '2025-02-25T00:00:00Z', 30)
  assert.deepEqual(events.map((e) => e.start), [
    '2025-02-17T09:00:00Z',
    '2025-02-24T09:00:00Z',
  ])
})

test('无终止日期的规则被 maxOccurrences 封顶', () => {
  const raw = vevent('daily@example.com', [
    'SUMMARY:每日提醒',
    'DTSTART:20250101T000000Z',
    'DTEND:20250101T010000Z',
    'RRULE:FREQ=DAILY',
  ])
  const events = expandEventFromICal(raw, HREF, undefined, '2025-01-01T00:00:00Z', '2026-01-01T00:00:00Z', 5)
  assert.equal(events.length, 5)
  assert.deepEqual(events.map((e) => e.start), [
    '2025-01-01T00:00:00Z',
    '2025-01-02T00:00:00Z',
    '2025-01-03T00:00:00Z',
    '2025-01-04T00:00:00Z',
    '2025-01-05T00:00:00Z',
  ])
})

test('全天重复保持 YYYY-MM-DD 且逐日推进', () => {
  const raw = vevent('holiday@example.com', [
    'SUMMARY:假期',
    'DTSTART;VALUE=DATE:20250203',
    'DTEND;VALUE=DATE:20250204',
    'RRULE:FREQ=DAILY;COUNT=3',
  ])
  const events = expandEventFromICal(raw, HREF, undefined, '2025-02-03', '2025-02-06', 30)
  assert.equal(events.length, 3)
  assert.deepEqual(events.map((e) => e.start), ['2025-02-03', '2025-02-04', '2025-02-05'])
  assert.deepEqual(events.map((e) => e.end), ['2025-02-04', '2025-02-05', '2025-02-06'])
  for (const event of events) {
    assert.equal(event.allDay, true)
    assert.equal(event.isOccurrence, true)
    assert.equal(event.seriesStart, '2025-02-03')
  }
})

test('EXDATE 排除：被排除的实例不返回', () => {
  const raw = vevent('ex@example.com', [
    'SUMMARY:周会带排除',
    'DTSTART:20250203T090000Z',
    'DTEND:20250203T100000Z',
    'RRULE:FREQ=WEEKLY;COUNT=5',
    'EXDATE:20250210T090000Z',
  ])
  const events = expandEventFromICal(raw, HREF, undefined, '2025-02-01T00:00:00Z', '2025-03-20T00:00:00Z', 30)
  const starts = events.map((e) => e.start)
  assert.ok(!starts.includes('2025-02-10T09:00:00Z'), 'EXDATE 对应实例应被排除')
  assert.ok(starts.includes('2025-02-03T09:00:00Z'))
  assert.ok(starts.includes('2025-02-17T09:00:00Z'))
})

test('非重复事件保持单行且 isOccurrence=false', () => {
  const raw = vevent('once@example.com', [
    'SUMMARY:一次性',
    'DTSTART:20250301T030000Z',
    'DTEND:20250301T040000Z',
  ])
  const events = expandEventFromICal(raw, HREF, undefined, '2025-02-01T00:00:00Z', '2025-04-01T00:00:00Z', 30)
  assert.equal(events.length, 1)
  assert.equal(events[0].start, '2025-03-01T03:00:00Z')
  assert.equal(events[0].end, '2025-03-01T04:00:00Z')
  assert.equal(events[0].isOccurrence, false)
  assert.equal(events[0].seriesStart, undefined)
})
