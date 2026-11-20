import test from 'node:test'
import assert from 'node:assert/strict'
import { createConnectionService } from '../lib/connections.js'

const tokenUrl = 'https://oauth.example/token'
const calendars = [{ id: 'a', url: 'https://calendar.example/a/' }, { id: 'b', url: 'https://calendar.example/b/' }]
const config = (refreshToken = 'initial-refresh') => ({ provider: 'custom', authMethod: 'oauth', tokenUrl, clientId: 'shared-app', clientSecret: 'fixture-secret', refreshToken, calendars })
const token = (access, refreshToken) => Response.json({ access_token: access, token_type: 'Bearer', expires_in: 3600, ...(refreshToken ? { refresh_token: refreshToken } : {}) })
function events(url, summary = 'fixture') {
  return new Response(`<?xml version="1.0"?><D:multistatus xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav"><D:response><D:href>${url}event.ics</D:href><D:propstat><D:prop><D:getetag>"1"</D:getetag><C:calendar-data><![CDATA[BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:fixture\r\nSUMMARY:${summary}\r\nDTSTART:20261120T010000Z\r\nDTEND:20261120T020000Z\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n]]></C:calendar-data></D:prop><D:status>HTTP/1.1 200 OK</D:status></D:propstat></D:response></D:multistatus>`, { status: 207, headers: { 'content-type': 'application/xml' } })
}
const list = (service, signal) => service.list('2026-11-20T00:00:00Z', '2026-11-21T00:00:00Z', { expand: false }, signal)

test('real multi-collection all/list share one rotating OAuth exchange and its next refresh', async t => {
  let now = 1_800_000_000_000
  t.mock.method(Date, 'now', () => now)
  let release, started
  const gate = new Promise(resolve => { release = resolve }), ready = new Promise(resolve => { started = resolve })
  let current = 'initial-refresh'
  const refreshes = [], sent = []
  t.mock.method(globalThis, 'fetch', async (input, init) => {
    if (String(input) === tokenUrl) {
      const refresh = new URLSearchParams(init.body).get('refresh_token')
      refreshes.push(refresh)
      if (refresh !== current) return Response.json({ error: 'invalid_grant' }, { status: 400 })
      current = 'rotated-' + refreshes.length
      if (refreshes.length === 1) { started(); await gate }
      return token('access-' + refreshes.length, current)
    }
    sent.push(new Headers(init.headers).get('authorization'))
    return events(String(input))
  })
  const service = createConnectionService(config(), {})
  const pending = Promise.allSettled([service.all(), list(service)])
  await ready
  await new Promise(resolve => setImmediate(resolve))
  release()
  const results = await pending
  assert.deepEqual(results.map(result => result.status), ['fulfilled', 'fulfilled'])
  for (const result of results) assert.equal(result.value.length, 2)
  assert.deepEqual(refreshes, ['initial-refresh'])
  const beforeExpiry = sent.length
  assert.ok(beforeExpiry >= 4, 'the real DAV clients read both collections for all/list')
  assert.ok(sent.every(header => header === 'Bearer access-1'))
  now += 3_580_000
  assert.equal((await service.all()).length, 2)
  assert.deepEqual(refreshes, ['initial-refresh', 'rotated-1'])
  assert.ok(sent.length > beforeExpiry)
  assert.ok(sent.slice(beforeExpiry).every(header => header === 'Bearer access-2'))
})

test('cancelling a queued multi-collection reader does not cancel the refresh owner', { timeout: 2000 }, async t => {
  let release, started
  const gate = new Promise(resolve => { release = resolve }), ready = new Promise(resolve => { started = resolve })
  const cancelled = new AbortController(), reason = new Error('cancel this reader')
  let refreshes = 0, requests = 0
  t.mock.method(globalThis, 'fetch', async (input, init) => {
    if (String(input) === tokenUrl) { refreshes++; started(); await gate; return token('owner-access') }
    assert.notEqual(init.signal, cancelled.signal, 'cancelled reader must not reach DAV')
    requests++
    return events(String(input))
  })
  const service = createConnectionService(config(), {})
  const owner = service.all()
  await ready
  const queued = list(service, cancelled.signal), rejected = assert.rejects(queued, error => error === reason)
  cancelled.abort(reason)
  try { await rejected } finally { release() }
  assert.equal((await owner).length, 2)
  assert.equal(refreshes, 1)
  assert.ok(requests >= 2)
})

test('different credentials on the same provider remain isolated across connections', async t => {
  const refreshes = []
  t.mock.method(globalThis, 'fetch', async (input, init) => {
    if (String(input) === tokenUrl) {
      const refresh = new URLSearchParams(init.body).get('refresh_token')
      refreshes.push(refresh)
      return token(refresh === 'tenant-a-refresh' ? 'tenant-a-access' : 'tenant-b-access')
    }
    const access = new Headers(init.headers).get('authorization')
    return events(String(input), access)
  })
  const a = createConnectionService(config('tenant-a-refresh'), {}), b = createConnectionService(config('tenant-b-refresh'), {})
  const [first, second] = await Promise.all([a.all(), list(b)])
  assert.ok(first.every(event => event.summary === 'Bearer tenant-a-access'))
  assert.ok(second.every(event => event.summary === 'Bearer tenant-b-access'))
  assert.deepEqual(refreshes.sort(), ['tenant-a-refresh', 'tenant-b-refresh'])
})

test('cancelling the refresh owner leaves another multi-collection caller able to retry', { timeout: 2000 }, async t => {
  const cancelled = new AbortController(), other = new AbortController(), reason = new Error('cancel owner')
  let started, refreshes = 0
  const ready = new Promise(resolve => { started = resolve })
  t.mock.method(globalThis, 'fetch', async (input, init) => {
    if (String(input) === tokenUrl) {
      refreshes++
      if (init.signal === cancelled.signal) {
        started()
        return await new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true }))
      }
      assert.equal(init.signal, other.signal)
      return token('other-access')
    }
    assert.equal(init.signal, other.signal)
    return events(String(input))
  })
  const service = createConnectionService(config(), {})
  const owner = service.all(cancelled.signal), rejected = assert.rejects(owner, error => error === reason)
  await ready
  const independent = list(service, other.signal)
  cancelled.abort(reason)
  await rejected
  assert.equal((await independent).length, 2)
  assert.equal(refreshes, 2)
})

test('separate connection owners do not share a global OAuth cache even with equal configuration', async t => {
  let refreshes = 0
  t.mock.method(globalThis, 'fetch', async (input, init) => {
    if (String(input) === tokenUrl) return token('connection-' + ++refreshes)
    return events(String(input), new Headers(init.headers).get('authorization'))
  })
  const a = createConnectionService(config(), {}), b = createConnectionService(config(), {})
  const [first, second] = await Promise.all([a.all(), b.all()])
  assert.equal(refreshes, 2)
  assert.equal(new Set(first.map(event => event.summary)).size, 1)
  assert.equal(new Set(second.map(event => event.summary)).size, 1)
  assert.notEqual(first[0].summary, second[0].summary)
})
