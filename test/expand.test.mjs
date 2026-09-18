import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CalendarService, expandEventFromICal, resolveConfig } from '../lib/index.js'

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

test('RECURRENCE-ID 覆盖实例：用改期+改标题后的实例替换原实例，总数仍为 4', () => {
  const raw = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//dsh-calendar//EN',
    'BEGIN:VEVENT',
    'UID:weekly@example.com',
    'DTSTAMP:20250101T000000Z',
    'SUMMARY:周会',
    'DTSTART:20250203T090000Z',
    'DTEND:20250203T100000Z',
    'RRULE:FREQ=WEEKLY;COUNT=4',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'UID:weekly@example.com',
    'DTSTAMP:20250102T000000Z',
    'RECURRENCE-ID:20250210T090000Z',
    'SUMMARY:周会（改期）',
    'DTSTART:20250211T140000Z',
    'DTEND:20250211T150000Z',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const events = expandEventFromICal(raw, HREF, 'etag-1', '2025-02-01T00:00:00Z', '2025-03-01T00:00:00Z', 10)
  assert.equal(events.length, 4)
  const moved = events.find((event) => event.summary === '周会（改期）')
  assert.ok(moved, '覆盖实例应作为一条实例出现，而不是被丢弃')
  assert.equal(moved.start, '2025-02-11T14:00:00Z')
  assert.equal(moved.end, '2025-02-11T15:00:00Z')
  assert.ok(!events.some((event) => event.start === '2025-02-10T09:00:00Z'), '原时间不应再出现旧标题实例')
  assert.deepEqual(events.filter((event) => event.isOccurrence !== true), [], '所有实例都应带 isOccurrence=true')
})

test('EXDATE + RECURRENCE-ID 同时存在：改期实例不能整条消失', () => {
  const raw = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//dsh-calendar//EN',
    'BEGIN:VEVENT',
    'UID:weekly@example.com',
    'DTSTAMP:20250101T000000Z',
    'SUMMARY:周会',
    'DTSTART:20250203T090000Z',
    'DTEND:20250203T100000Z',
    'RRULE:FREQ=WEEKLY;COUNT=4',
    'EXDATE:20250210T090000Z',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'UID:weekly@example.com',
    'DTSTAMP:20250102T000000Z',
    'RECURRENCE-ID:20250210T090000Z',
    'SUMMARY:周会（改期）',
    'DTSTART:20250211T140000Z',
    'DTEND:20250211T150000Z',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const events = expandEventFromICal(raw, HREF, 'etag-1', '2025-02-01T00:00:00Z', '2025-03-01T00:00:00Z', 10)
  assert.equal(events.length, 4, '原本 4 次周会：EXDATE 排除 1 次、覆盖实例补回 1 次，总数应仍为 4')
  const moved = events.find((event) => event.summary === '周会（改期）')
  assert.ok(moved, '被 EXDATE 与 RECURRENCE-ID 同时标记的实例仍应出现')
  assert.equal(moved.start, '2025-02-11T14:00:00Z')
  assert.equal(moved.end, '2025-02-11T15:00:00Z')
})

test('DTSTART 远早于窗口的 FREQ=HOURLY：超出迭代预算必须显式报错，而不是静默返回 0 条', () => {
  const raw = vevent('hourly@example.com', [
    'SUMMARY:每小时巡检',
    'DTSTART:20100101T000000Z',
    'DTEND:20100101T010000Z',
    'RRULE:FREQ=HOURLY',
  ])
  assert.throws(
    () => expandEventFromICal(raw, HREF, undefined, '2026-09-01T00:00:00Z', '2026-09-02T00:00:00Z', 30),
    (error) => /迭代上限/.test(error.message) && /2010-01-01T00:00:00Z/.test(error.message) && /COUNT\/UNTIL/.test(error.message),
  )
})

test('展开超限在 OAuth 配置下也保留明确提示，不被通用网络错误文案吞掉', async () => {
  const config = resolveConfig({ provider: 'google', calendarId: 'u@gmail.com', clientId: 'id', clientSecret: 'secret', refreshToken: 'refresh' }, {})
  const raw = vevent('hourly@example.com', [
    'SUMMARY:每小时巡检',
    'DTSTART:20100101T000000Z',
    'DTEND:20100101T010000Z',
    'RRULE:FREQ=HOURLY',
  ])
  const service = new CalendarService(config)
  service.clientPromise = Promise.resolve({
    async fetchCalendarObjects() {
      return [{ url: 'https://apidata.googleusercontent.com/caldav/v2/u%40gmail.com/events/hourly.ics', data: raw }]
    },
  })
  await assert.rejects(
    service.list('2026-09-01T00:00:00Z', '2026-09-02T00:00:00Z'),
    (error) => /迭代上限/.test(error.message),
  )
})
