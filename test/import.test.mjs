import test from 'node:test'
import assert from 'node:assert/strict'
import ICAL from 'ical.js'
import { parseImportICS, CalendarImportBackend, CalendarService, resolveConfig, installCalendarImport, CALENDAR_IMPORT_ROUTE, expandEventFromICal } from '../lib/index.js'
const wrap = (...events) => ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Import acceptance//EN', ...events, 'END:VCALENDAR'].join('\r\n')
const event = (uid, extra = '') => ['BEGIN:VEVENT', 'UID:' + uid, 'DTSTAMP:20261003T010000Z', 'SUMMARY:测试日程', 'DTSTART:20261004T010000Z', 'DTEND:20261004T020000Z', extra, 'END:VEVENT'].filter(Boolean).join('\r\n')
const config = () => ({ provider: 'custom', caldavUrl: 'https://cal.example/one/', username: 'tester', password: 'never-return-this-secret' })
function fixture(options = {}) {
  const uids = new Set(options.uids), writes = [], events = []
  const service = { async importSnapshot() { return { uids: new Set(uids), events } }, async importRaw(uid, data) { if (options.fail?.(uid)) throw new Error('synthetic failure'); writes.push({ uid, data }); uids.add(uid) } }
  const backend = new CalendarImportBackend({ config, env: {}, serviceFactory: () => service, ...options })
  return { backend, uids, writes, service, events }
}
test('one UID preserves RRULE, EXDATE, overrides and DST instead of flattening a series', () => {
  const data = wrap(event('series', 'RRULE:FREQ=WEEKLY;COUNT=3\r\nEXDATE;TZID=America/New_York:20260308T090000')
    .replace('DTSTART:20261004T010000Z', 'DTSTART;TZID=America/New_York:20260301T090000').replace('DTEND:20261004T020000Z', 'DTEND;TZID=America/New_York:20260301T100000'),
  event('series', 'RECURRENCE-ID;TZID=America/New_York:20260315T090000').replace('DTSTART:20261004T010000Z', 'DTSTART;TZID=America/New_York:20260315T110000').replace('DTEND:20261004T020000Z', 'DTEND;TZID=America/New_York:20260315T120000'))
  const parsed = parseImportICS(data)
  assert.equal(parsed.items.length, 1); assert.equal(parsed.items[0].row.status, 'ready'); assert.equal(parsed.items[0].row.exceptions, 1)
  const occurrences = expandEventFromICal(parsed.items[0].data, 'https://cal.example/series.ics', undefined, '2026-03-01T00:00:00Z', '2026-03-22T00:00:00Z', 20)
  assert.deepEqual(occurrences.map(e => e.start), ['2026-03-01T14:00:00Z', '2026-03-15T15:00:00Z'])
  const reversed = parseImportICS(wrap(...new ICAL.Component(ICAL.parse(data)).getAllSubcomponents('vevent').reverse().map(e => e.toString()))).items[0]
  assert.equal(reversed.row.start, '2026-03-01T14:00:00Z')
  assert.match(new ICAL.Component(ICAL.parse(reversed.data)).getFirstSubcomponent('vevent').toString(), /RRULE:/)
})
test('floating times require explicit choice; supplied TZID is retained', () => {
  const data = wrap(event('floating').replace('20261004T010000Z', '20261004T090000').replace('20261004T020000Z', '20261004T100000'))
  assert.equal(parseImportICS(data).items[0].row.status, 'blocked')
  const parsed = parseImportICS(data, 'Asia/Shanghai').items[0]
  assert.equal(parsed.row.start, '2026-10-04T01:00:00Z'); assert.match(parsed.data, /DTSTART;TZID=Asia\/Shanghai:20261004T090000/)
  const utc = parseImportICS(data, 'UTC').items[0]; assert.equal(utc.row.start, '2026-10-04T09:00:00Z'); assert.doesNotMatch(utc.data, /TZID:UTC/)
})
test('custom file timezones stay local to the file and cannot contaminate the next preview', () => {
  const tz = offset => ['BEGIN:VTIMEZONE', 'TZID:Custom/Private', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:' + offset, 'TZOFFSETTO:' + offset, 'END:STANDARD', 'END:VTIMEZONE'].join('\r\n')
  const body = event('local').replace('DTSTART:20261004T010000Z', 'DTSTART;TZID=Custom/Private:20261004T090000').replace('DTEND:20261004T020000Z', 'DTEND;TZID=Custom/Private:20261004T100000')
  assert.equal(parseImportICS(wrap(tz('+0800'), body)).items[0].row.start, '2026-10-04T01:00:00Z')
  assert.equal(parseImportICS(wrap(tz('+0200'), body)).items[0].row.start, '2026-10-04T07:00:00Z')
  assert.equal(parseImportICS(wrap(body)).items[0].row.status, 'blocked')
})
test('private copies do not schedule invitations or email alarms; display reminders survive', () => {
  const data = wrap(event('private', 'ATTENDEE:mailto:someone@example.test\r\nORGANIZER:mailto:owner@example.test\r\nBEGIN:VALARM\r\nACTION:EMAIL\r\nTRIGGER:-PT10M\r\nEND:VALARM\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nTRIGGER:-PT10M\r\nDESCRIPTION:提醒\r\nEND:VALARM')).replace('VERSION:2.0', 'VERSION:2.0\r\nMETHOD:REQUEST')
  const item = parseImportICS(data).items[0]
  assert.equal(item.row.status, 'ready'); assert.doesNotMatch(item.data, /ATTENDEE|ORGANIZER|ACTION:EMAIL|METHOD:/); assert.match(item.data, /ACTION:DISPLAY/)
})
test('bad dates, unknown TZID, orphan overrides and repeated masters are blocked visibly', () => {
  const brokenZone = 'BEGIN:VTIMEZONE\r\nTZID:Broken/Zone\r\nBEGIN:STANDARD\r\nDTSTART:19700101T000000\r\nTZOFFSETFROM:+9900\r\nTZOFFSETTO:+0800\r\nEND:STANDARD\r\nEND:VTIMEZONE'
  for (const data of [wrap(event('bad').replace('20261004T010000Z', '20260230T010000Z')), wrap(event('bad').replace('DTSTART:20261004T010000Z', 'DTSTART;TZID=Unknown/Zone:20261004T010000')), wrap(event('bad', 'RECURRENCE-ID:20261004T010000Z')), wrap(event('bad'), event('bad')), wrap(brokenZone, event('bad').replace('DTSTART:20261004T010000Z', 'DTSTART;TZID=Broken/Zone:20261004T090000')), wrap(event('series'), event('series', 'RECURRENCE-ID:20261004T010000Z').replace('DTEND:20261004T020000Z', 'DTEND:20261004T000000Z'))]) {
    const item = parseImportICS(data).items[0]; assert.equal(item.row.status, 'blocked'); assert.ok(item.row.errors.length)
  }
  assert.throws(() => parseImportICS('BEGIN:VCALENDAR\r\nVERSION:2.0'), /不完整/)
  assert.throws(() => parseImportICS('a'.repeat(256 * 1024 + 1)), /256/)
  assert.throws(() => parseImportICS(wrap(...Array.from({ length: 101 }, (_, i) => event(String(i))))), /100/)
})
test('preview performs no writes and finds duplicates outside the visible calendar window', async () => {
  const f = fixture({ uids: ['old'] })
  f.events.push({ icalUid: 'overlap', start: '2026-10-04T01:00:00Z', end: '2026-10-04T02:00:00Z' })
  const p = await f.backend.action({ action: 'preview', ics: wrap(event('old'), event('new')) })
  assert.equal(f.writes.length, 0); assert.equal(p.rows[0].status, 'duplicate'); assert.equal(p.rows[1].status, 'ready')
  assert.equal(p.rows[0].conflicts, 0); assert.equal(p.rows[1].conflicts, 1)
  assert.doesNotMatch(JSON.stringify(p), /never-return-this-secret|BEGIN:VEVENT/)
  await assert.rejects(f.backend.action({ action: 'commit', id: p.id, selected: [p.rows[1].id] }), /确认/)
  await assert.rejects(f.backend.action({ action: 'commit', id: p.id, selected: [p.rows[0].id], confirmed: true }), /不可导入/)
})
test('partial failure retries only failed events, and another writer adding a UID is skipped', async () => {
  let fail = true
  const f = fixture({ fail: uid => uid === 'two' && fail })
  const p = await f.backend.action({ action: 'preview', ics: wrap(event('one'), event('two'), event('other-writer')) })
  const commit = () => f.backend.action({ action: 'commit', id: p.id, selected: p.rows.map(r => r.id), confirmed: true })
  f.uids.add('other-writer')
  assert.deepEqual((await commit()).results.map(r => r.status), ['imported', 'failed', 'duplicate'])
  fail = false; assert.deepEqual((await commit()).results.map(r => r.status), ['imported', 'imported', 'duplicate'])
  assert.deepEqual(f.writes.map(w => w.uid), ['one', 'two'])
})
test('expired previews and changed credentials cannot write to a different account', async () => {
  let now = 0, active = config()
  const f = fixture({ config: () => active, now: () => now })
  const p = await f.backend.action({ action: 'preview', ics: wrap(event('one')) })
  const commit = () => f.backend.action({ action: 'commit', id: p.id, selected: [p.rows[0].id], confirmed: true })
  active = { ...active, password: 'changed' }; await assert.rejects(commit(), /连接已改变/); assert.equal(f.writes.length, 0)
  active = config(); now = 15 * 60 * 1000 + 1; await assert.rejects(commit(), /过期/)
})
test('cancellation before commit and concurrent imports do not issue extra writes', async () => {
  const f = fixture(); const p = await f.backend.action({ action: 'preview', ics: wrap(event('one')) })
  const body = { action: 'commit', id: p.id, selected: [p.rows[0].id], confirmed: true }
  await assert.rejects(f.backend.action(body, AbortSignal.abort()), /abort/i); assert.equal(f.writes.length, 0)
  let release; f.service.importRaw = async () => { await new Promise(r => release = r) }
  const running = f.backend.action(body); await new Promise(r => setImmediate(r))
  await assert.rejects(f.backend.action(body), /正在导入/); release(); await running
})
test('import uses only authenticated carrier registration; cross-origin and null-origin requests fail', async () => {
  const f = fixture(), routes = []
  installCalendarImport({ inject(names, cb) { assert.deepEqual(names, ['connection']); cb({ connection: { fetch: { register: r => routes.push(r) } } }) } }, f.backend)
  assert.equal(routes[0].path, CALENDAR_IMPORT_ROUTE); assert.equal(routes[0].requestBody, 'buffered')
  const request = headers => new Request('http://dsh.internal' + CALENDAR_IMPORT_ROUTE, { method: 'POST', headers: { 'content-type': 'application/json', 'x-dsh-calendar-import': '1', host: '127.0.0.1:8181', ...headers }, body: JSON.stringify({ action: 'zones' }) })
  assert.equal((await f.backend.fetch(request({ origin: 'http://127.0.0.1:8181' }))).status, 200)
  for (const headers of [{ origin: 'null' }, { origin: 'https://evil.example' }, { 'sec-fetch-site': 'cross-site' }, { 'x-dsh-calendar-import': '' }]) assert.equal((await f.backend.fetch(request(headers))).status, 403)
})
test('UID text cannot escape the collection or change the import filename on retry', async () => {
  const calls = [], service = new CalendarService(resolveConfig(config(), {}))
  service.clientPromise = Promise.resolve({ async createCalendarObject(args) { calls.push(args); return new Response(null, { status: 201 }) } })
  for (let i = 0; i < 2; i++) await service.importRaw('../escape?#/UID', wrap(event('../escape?#/UID')))
  assert.match(calls[0].filename, /^import-[0-9a-f]{64}\.ics$/); assert.equal(calls[0].filename, calls[1].filename)
  await assert.rejects(service.importRaw('different', wrap(event('actual'))), /同一 UID/)
})
