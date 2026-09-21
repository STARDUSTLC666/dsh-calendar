import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CalendarService, resolveConfig } from '../lib/index.js'

const collection = 'https://calendar.example/test/'
const href = collection + 'event.ics'
const config = resolveConfig({ provider: 'custom', username: 'test', password: 'test', caldavUrl: collection }, {})
const ical = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:event\r\nSUMMARY:Before\r\nDTSTART:20260921T010000Z\r\nDTEND:20260921T020000Z\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n'

function response(missing = false) {
  const body = missing
    ? '<D:status>HTTP/1.1 404 Not Found</D:status>'
    : '<D:propstat><D:prop><D:getetag>"fresh"</D:getetag><C:calendar-data><![CDATA[' + ical + ']]></C:calendar-data></D:prop><D:status>HTTP/1.1 200 OK</D:status></D:propstat>'
  return new Response('<D:multistatus xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav"><D:response><D:href>' + href + '</D:href>' + body + '</D:response></D:multistatus>', { status: 207, headers: { 'content-type': 'application/xml' } })
}

for (const method of ['update', 'delete']) {
  test(method + ' retrieves one href with one REPORT and keeps the current ETag', async (t) => {
    const requests = []
    const signal = new AbortController().signal
    t.mock.method(globalThis, 'fetch', async (input, init) => {
      requests.push({ url: String(input), ...init })
      assert.equal(init.signal, signal)
      return init.method === 'REPORT' ? response() : new Response(null, { status: 204 })
    })
    const service = new CalendarService(config)
    if (method === 'update') await service.update(href, { summary: 'After' }, signal)
    else await service.delete(href, signal)
    const reports = requests.filter(r => r.method === 'REPORT')
    assert.equal(reports.length, 1, 'a known href must not trigger a collection-wide query first')
    assert.match(String(reports[0].body), /calendar-multiget/)
    assert.match(String(reports[0].body), /\/test\/event\.ics/)
    const write = requests.at(-1)
    assert.equal(write.url, href)
    assert.equal(write.method, method === 'update' ? 'PUT' : 'DELETE')
    assert.equal(new Headers(write.headers).get('if-match'), '"fresh"')
  })

  test(method + ' does not write after a 404 inside the multistatus response', async (t) => {
    t.mock.method(globalThis, 'fetch', async (_input, init) => {
      assert.equal(init.method, 'REPORT', 'a missing event must never be written or deleted')
      return response(true)
    })
    const service = new CalendarService(config)
    await assert.rejects(method === 'update'
      ? service.update(href, { summary: 'After', start: '2026-09-21', end: '2026-09-22' })
      : service.delete(href), /找不到 uid|404/)
  })
}

test('an href without calendar-data cannot be used as a deletion target', async (t) => {
  t.mock.method(globalThis, 'fetch', async (_input, init) => {
    assert.equal(init.method, 'REPORT', 'incomplete multistatus entries must not trigger DELETE')
    return new Response('<D:multistatus xmlns:D="DAV:"><D:response><D:href>' + href
      + '</D:href><D:propstat><D:prop><D:getetag>"fresh"</D:getetag></D:prop><D:status>HTTP/1.1 200 OK</D:status></D:propstat></D:response></D:multistatus>', { status: 207 })
  })
  await assert.rejects(new CalendarService(config).delete(href), /找不到 uid/)
})

test('invalid or out-of-collection hrefs fail before contacting CalDAV', async (t) => {
  t.mock.method(globalThis, 'fetch', () => assert.fail('invalid href must not send a request'))
  const service = new CalendarService(config)
  for (const uid of ['not-a-url', collection, 'https://other.example/test/event.ics',
    collection.replace('/test/', '/other/') + 'event.ics', collection + '../other/event.ics',
    collection + '%2F..%2Fother.ics', href + '#fragment', href.replace('https://', 'https://user:pass@')]) {
    await assert.rejects(service.delete(uid), /uid.*当前日历/)
  }
})

test('cancelled lookup performs no request', async (t) => {
  t.mock.method(globalThis, 'fetch', () => assert.fail('aborted lookup must not use fetch'))
  const reason = new Error('cancelled')
  await assert.rejects(new CalendarService(config).delete(href, AbortSignal.abort(reason)), error => error === reason)
})
