import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CalendarService, resolveConfig } from '../lib/index.js'

const config = resolveConfig({ provider: 'custom', username: 'test', password: 'test', caldavUrl: 'https://calendar.example/test/' }, {})
const HREF = 'https://calendar.example/test/team.ics'

// 原事件模拟真实客户端导出：带参与者、组织者、排除日期、状态、分类、VALARM 与未知属性；
// 同时故意不写 DTSTAMP / VERSION / PRODID，验证更新时会补齐 RFC 5545 必需属性。
const ORIGINAL = [
  'BEGIN:VCALENDAR',
  'BEGIN:VEVENT',
  'UID:team-meeting@example.com',
  'SUMMARY:旧标题',
  'DTSTART:20250203T090000Z',
  'DTEND:20250203T100000Z',
  'RRULE:FREQ=WEEKLY;COUNT=4',
  'EXDATE:20250217T090000Z',
  'ATTENDEE;CN=Alice;PARTSTAT=ACCEPTED:mailto:alice@example.com',
  'ORGANIZER;CN=Bob:mailto:bob@example.com',
  'STATUS:CONFIRMED',
  'CATEGORIES:工作,周会',
  'X-CUSTOM-FIELD:keep-me',
  'BEGIN:VALARM',
  'ACTION:DISPLAY',
  'TRIGGER:-PT15M',
  'DESCRIPTION:会议提醒',
  'END:VALARM',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n')

function fakeClientWithCapture(original, capture) {
  return {
    async fetchCalendarObjects() {
      return [{ url: HREF, etag: 'etag-1', data: original }]
    },
    async updateCalendarObject(args) {
      capture.body = String(args.calendarObject.data)
      return new Response(null, { status: 204 })
    },
  }
}

test('calendar_update 改标题时保留 ATTENDEE/ORGANIZER/EXDATE/STATUS/CATEGORIES/VALARM 与未知属性', async () => {
  const capture = {}
  const service = new CalendarService(config)
  service.clientPromise = Promise.resolve(fakeClientWithCapture(ORIGINAL, capture))

  const updated = await service.update(HREF, { summary: '新标题' })

  assert.equal(updated.summary, '新标题')
  assert.match(capture.body, /SUMMARY:新标题/)
  assert.match(capture.body, /ATTENDEE;CN=Alice;PARTSTAT=ACCEPTED:mailto:alice@example\.com/)
  assert.match(capture.body, /ORGANIZER;CN=Bob:mailto:bob@example\.com/)
  assert.match(capture.body, /EXDATE:20250217T090000Z/)
  assert.match(capture.body, /STATUS:CONFIRMED/)
  assert.match(capture.body, /CATEGORIES:工作,周会/)
  assert.match(capture.body, /X-CUSTOM-FIELD:keep-me/)
  assert.match(capture.body, /BEGIN:VALARM/)
  assert.match(capture.body, /TRIGGER:-PT15M/)
})

test('calendar_update 补齐 RFC 5545 必需的 UID/DTSTAMP/VERSION/PRODID 且保留原 UID 与时间', async () => {
  const capture = {}
  const service = new CalendarService(config)
  service.clientPromise = Promise.resolve(fakeClientWithCapture(ORIGINAL, capture))

  const updated = await service.update(HREF, { summary: '新标题' })

  assert.equal(updated.icalUid, 'team-meeting@example.com')
  assert.match(capture.body, /UID:team-meeting@example\.com/)
  assert.match(capture.body, /DTSTAMP:\d{8}T\d{6}Z/)
  assert.match(capture.body, /VERSION:2\.0/)
  assert.match(capture.body, /PRODID:/)
  assert.match(capture.body, /DTSTART:20250203T090000Z/)
  assert.match(capture.body, /DTEND:20250203T100000Z/)
  assert.match(capture.body, /RRULE:FREQ=WEEKLY;COUNT=4/)
})
