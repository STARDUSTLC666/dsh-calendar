import test from 'node:test'
import assert from 'node:assert/strict'
import { updateICalString, parseEventFromICal, expandEventFromICal } from '../lib/ical.js'
import { CalendarService } from '../lib/caldav.js'
import { resolveConfig } from '../lib/config.js'

const resource = lines => ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//series safety//EN', 'BEGIN:VEVENT', 'UID:series@example.invalid', 'DTSTAMP:20261020T000000Z', 'SUMMARY:Weekly review', ...lines, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
const href = 'https://calendar.example.invalid/series.ics'

test('TZID dates are written as local wall times, never TZID plus a UTC Z', () => {
  const source = resource(['DTSTART;TZID=Asia/Shanghai:20261110T090000', 'DTEND;TZID=Asia/Shanghai:20261110T100000'])
  const updated = updateICalString(source, { start: '2026-11-10T10:00:00+08:00', end: '2026-11-10T11:00:00+08:00' })
  assert.match(updated, /DTSTART;TZID=Asia\/Shanghai:20261110T100000\r?\n/)
  assert.match(updated, /DTEND;TZID=Asia\/Shanghai:20261110T110000\r?\n/)
  assert.equal(parseEventFromICal(updated, href).start, '2026-11-10T02:00:00Z')
  const allDay = updateICalString(updated, { start: '2026-11-10', end: '2026-11-11', allDay: true })
  assert.match(allDay, /DTSTART;VALUE=DATE:20261110/)
  assert.doesNotMatch(allDay, /DTSTART[^\r\n]*TZID/)
})

test('a New York weekly series keeps the new wall time across the DST boundary', () => {
  const source = resource(['DTSTART;TZID=America/New_York:20261025T090000', 'DTEND;TZID=America/New_York:20261025T100000', 'RRULE:FREQ=WEEKLY;COUNT=3'])
  const updated = updateICalString(source, { start: '2026-10-25T10:00:00-04:00', end: '2026-10-25T11:00:00-04:00' })
  assert.match(updated, /DTSTART;TZID=America\/New_York:20261025T100000/)
  const events = expandEventFromICal(updated, href, undefined, '2026-10-24T00:00:00Z', '2026-11-09T00:00:00Z', 20)
  assert.deepEqual(events.map(event => event.start), ['2026-10-25T14:00:00Z', '2026-11-01T15:00:00Z', '2026-11-08T15:00:00Z'])
})

test('series with excluded or overridden instances refuse re-anchoring without resurrecting occurrences', () => {
  const source = resource(['DTSTART:20261005T130000Z', 'DTEND:20261005T133000Z', 'RRULE:FREQ=WEEKLY;COUNT=4', 'EXDATE:20261012T130000Z'])
    .replace('END:VCALENDAR', ['BEGIN:VEVENT', 'UID:series@example.invalid', 'RECURRENCE-ID:20261019T130000Z', 'DTSTART:20261019T150000Z', 'DTEND:20261019T153000Z', 'SUMMARY:Rescheduled', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n'))
  assert.throws(() => updateICalString(source, { start: '2026-10-05T14:00:00Z', end: '2026-10-05T14:30:00Z' }), /系列含已取消/)
  assert.throws(() => updateICalString(source, { rrule: '' }), /系列含已取消/)
  const renamed = updateICalString(source, { summary: 'Rename only' })
  const occurrences = expandEventFromICal(renamed, href, undefined, '2026-10-01T00:00:00Z', '2026-11-01T00:00:00Z', 20)
  assert.deepEqual(occurrences.map(event => event.start), ['2026-10-05T13:00:00Z', '2026-10-19T15:00:00Z', '2026-10-26T13:00:00Z'])
})

test('the service rejects ambiguous series update/delete before any CalDAV write', async () => {
  const data = resource(['DTSTART:20261005T130000Z', 'DTEND:20261005T133000Z', 'RRULE:FREQ=WEEKLY;COUNT=4'])
  const writes = []
  const service = new CalendarService(resolveConfig({ provider: 'custom', username: 'fixture', password: 'synthetic', caldavUrl: 'https://calendar.example.invalid/' }, {}))
  service.clientPromise = Promise.resolve({
    fetchCalendarObjects: async () => [{ url: href, data, etag: 'old' }],
    updateCalendarObject: async request => { writes.push(request.calendarObject.data); return new Response(null, { status: 204 }) },
    deleteCalendarObject: async () => { writes.push('deleted'); return new Response(null, { status: 204 }) },
  })
  await assert.rejects(service.update(href, { summary: 'Ambiguous instance' }), /scope="series"/)
  await assert.rejects(service.delete(href), /scope="series"/)
  assert.deepEqual(writes, [])
  assert.equal((await service.get(href)).start, '2026-10-05T13:00:00Z')
  await service.update(href, { summary: 'Explicit series' }, undefined, 'series')
  await service.delete(href, undefined, 'series')
  assert.equal(writes.length, 2)
})
