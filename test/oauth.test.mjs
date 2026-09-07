import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createOAuthFetch, OAuthError } from '../lib/oauth.js'
import { CalendarService, CalDAVError, resolveConfig, buildCalendarTools } from '../lib/index.js'

const tokenUrl = 'https://oauth2.googleapis.com/token'
const calendarUrl = 'https://apidata.googleusercontent.com/caldav/v2/test/events/'
const credentials = { tokenUrl, clientId: 'test-client', clientSecret: 'test-secret', refreshToken: 'test-refresh' }
const config = () => resolveConfig({ provider: 'google', caldavUrl: calendarUrl, ...credentials }, {})
const token = (access = 'access-1', extra = {}) => Response.json({ access_token: access, token_type: 'Bearer', expires_in: 3600, ...extra })
const events = () => new Response(`<?xml version="1.0"?>
<D:multistatus xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav"><D:response>
<D:href>${calendarUrl}event.ics</D:href><D:propstat><D:prop><D:getetag>"1"</D:getetag>
<C:calendar-data><![CDATA[BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:test-event\r\nSUMMARY:OAuth fixture\r\nDTSTART:20260901T010000Z\r\nDTEND:20260901T020000Z\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n]]></C:calendar-data>
</D:prop><D:status>HTTP/1.1 200 OK</D:status></D:propstat></D:response></D:multistatus>`,
{ status: 207, headers: { 'content-type': 'application/xml' } })

test('request-time OAuth headers cache tokens, refresh before expiry, and preserve the supplied transport and signal', async (t) => {
  let now = 1_800_000_000_000
  t.mock.method(Date, 'now', () => now)
  let issued = 0
  const sent = []
  const signal = new AbortController().signal
  const request = createOAuthFetch(credentials, async (input, init) => {
    assert.equal(init.signal, signal)
    assert.equal(init.redirect, 'error')
    if (String(input) === tokenUrl) {
      assert.equal(init.method, 'POST')
      const body = new URLSearchParams(init.body)
      assert.equal(body.get('client_secret'), 'test-secret')
      assert.equal(body.get('grant_type'), 'refresh_token')
      assert.equal(body.get('refresh_token'), issued === 0 ? 'test-refresh' : 'rotated-refresh')
      return token('access-' + ++issued, { refresh_token: 'rotated-refresh' })
    }
    assert.equal(new Headers(init.headers).get('x-fixture'), 'kept')
    sent.push(new Headers(init.headers).get('authorization'))
    return new Response(null, { status: 204 })
  }, calendarUrl)
  const init = { signal, headers: { 'x-fixture': 'kept', authorization: 'stale-header' } }
  await request(calendarUrl, init)
  await request(calendarUrl, init)
  now += 3_580_000
  await request(calendarUrl, init)
  assert.equal(issued, 2)
  assert.deepEqual(sent, ['Bearer access-1', 'Bearer access-1', 'Bearer access-2'])
  assert.equal(credentials.refreshToken, 'test-refresh', 'caller configuration is not mutated')
})

test('real DAV client can read, create, update and delete over OAuth without Basic credentials', async (t) => {
  let tokenCalls = 0
  const methods = []
  t.mock.method(globalThis, 'fetch', async (input, init) => {
    if (String(input) === tokenUrl) { tokenCalls++; return token() }
    assert.equal(new Headers(init.headers).get('authorization'), 'Bearer access-1')
    methods.push(init.method)
    return init.method === 'REPORT' ? events() : new Response(null, { status: init.method === 'PUT' ? 201 : 204 })
  })
  const service = new CalendarService(config())
  const listed = await service.list('2026-09-01T00:00:00Z', '2026-09-02T00:00:00Z')
  assert.equal(listed[0].summary, 'OAuth fixture')
  await service.create({ summary: 'new', start: '2026-09-01', end: '2026-09-02', allDay: true })
  await service.update(calendarUrl + 'event.ics', { summary: 'updated' })
  await service.delete(calendarUrl + 'event.ics')
  assert.equal(tokenCalls, 1)
  for (const method of ['REPORT', 'PUT', 'DELETE']) assert.ok(methods.includes(method))
})

test('tools reuse OAuth state but discard it when configured credentials change', async (t) => {
  const refreshTokens = []
  t.mock.method(globalThis, 'fetch', async (input, init) => {
    if (String(input) === tokenUrl) {
      refreshTokens.push(new URLSearchParams(init.body).get('refresh_token'))
      return token('access-' + refreshTokens.length)
    }
    return events()
  })
  const env = { DSH_CALENDAR_CLIENT_ID: 'id', DSH_CALENDAR_CLIENT_SECRET: 'secret', DSH_CALENDAR_REFRESH_TOKEN: 'first' }
  const tools = buildCalendarTools({ provider: 'google', caldavUrl: calendarUrl }, env)
  const search = tools.find(tool => tool.name === 'calendar_search')
  await search.execute({ query: 'OAuth' })
  await search.execute({ query: 'OAuth' })
  env.DSH_CALENDAR_REFRESH_TOKEN = 'second'
  await search.execute({ query: 'OAuth' })
  assert.deepEqual(refreshTokens, ['first', 'second'])
})

test('failed refresh is actionable, does not leak response secrets or send DAV requests, and can be retried', async (t) => {
  let calls = 0
  t.mock.method(globalThis, 'fetch', async (input) => {
    calls++
    if (String(input) === tokenUrl) return calls === 1
      ? Response.json({ error: 'invalid_grant', error_description: 'test-secret test-refresh' }, { status: 400 }) : token()
    return events()
  })
  const service = new CalendarService(config())
  await assert.rejects(service.all(), error => error instanceof CalDAVError && /OAuth.*400/.test(error.message)
    && !/test-secret|test-refresh/.test(error.message))
  assert.equal(calls, 1)
  assert.equal((await service.all()).length, 1)
})

test('malformed successful token responses fail closed', async () => {
  for (const body of [null, {}, { access_token: '' }, { access_token: 'secret\r\nleak' },
    { access_token: 'valid', expires_in: 0 }, { access_token: 'valid', expires_in: '3600' },
    { access_token: 'valid', token_type: 'Basic' }, { access_token: 'valid', refresh_token: 42 }]) {
    let calls = 0
    const request = createOAuthFetch(credentials, async () => { calls++; return Response.json(body) }, calendarUrl)
    await assert.rejects(request(calendarUrl), error => error instanceof OAuthError && !/secret|leak/.test(error.message))
    assert.equal(calls, 1)
  }
  const invalidJson = createOAuthFetch(credentials, async () => new Response('secret not JSON'), calendarUrl)
  await assert.rejects(invalidJson(calendarUrl), error => /JSON/.test(error.message) && !/secret/.test(error.message))
})

test('token transport failures are sanitized, and redirects are forbidden for both endpoints', async () => {
  const request = createOAuthFetch(credentials, async (_input, init) => {
    assert.equal(init.redirect, 'error')
    throw new Error('transport echoed test-secret test-refresh')
  }, calendarUrl)
  await assert.rejects(request(calendarUrl), error => /OAuth.*proxyUrl/.test(error.message) && !/test-secret|test-refresh/.test(error.message))
})

test('untrusted DAV object hrefs cannot send tokens to another origin or HTTP', async () => {
  const request = createOAuthFetch(credentials, async () => assert.fail('unsafe href must fail before requesting a token'), calendarUrl)
  for (const url of ['https://attacker.example/object.ics', calendarUrl.replace('https:', 'http:'), calendarUrl.replace('https://', 'https://user:password@')]) {
    await assert.rejects(request(url), /拒绝跨源/)
  }
})

test('DAV transport errors do not leak Bearer tokens in diagnostics', async () => {
  const request = createOAuthFetch(credentials, async (input) => {
    if (String(input) === tokenUrl) return token('private-access-token')
    throw new Error('transport echoed private-access-token')
  }, calendarUrl)
  await assert.rejects(request(calendarUrl), error => /OAuth 日历请求失败/.test(error.message) && !error.message.includes('private-access-token'))
})

test('cancelling one in-flight refresh does not cancel another call or poison the client', async (t) => {
  const cancelled = new AbortController()
  const other = new AbortController()
  const reason = new Error('cancel only this request')
  let started
  const pending = new Promise(resolve => { started = resolve })
  let tokenCalls = 0
  t.mock.method(globalThis, 'fetch', async (input, init) => {
    if (String(input) === tokenUrl) {
      tokenCalls++
      if (init.signal === cancelled.signal) {
        started()
        return new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true }))
      }
      assert.equal(init.signal, other.signal)
      return token('other-token')
    }
    assert.equal(init.signal, other.signal)
    return events()
  })
  const service = new CalendarService(config())
  const first = service.all(cancelled.signal)
  const rejected = assert.rejects(first, error => error === reason)
  await pending
  const second = service.all(other.signal)
  cancelled.abort(reason)
  await rejected
  assert.equal((await second).length, 1)
  assert.equal((await service.all(other.signal)).length, 1)
  assert.equal(tokenCalls, 2)
})

test('pre-aborted OAuth calls perform no token request', async (t) => {
  t.mock.method(globalThis, 'fetch', () => assert.fail('aborted calls must not use fetch'))
  const reason = new Error('already stopped')
  await assert.rejects(new CalendarService(config()).all(AbortSignal.abort(reason)), error => error === reason)
})

test('401 invalidates the token for the next call, without automatically replaying a write', async (t) => {
  let issued = 0
  let writes = 0
  t.mock.method(globalThis, 'fetch', async (input) => {
    if (String(input) === tokenUrl) return token('access-' + ++issued)
    writes++
    return new Response(null, { status: writes === 1 ? 401 : 201 })
  })
  const service = new CalendarService(config())
  const fields = { summary: 'new', start: '2026-09-01', end: '2026-09-02', allDay: true }
  await assert.rejects(service.create(fields), error => error instanceof CalDAVError && /OAuth/.test(error.message))
  assert.equal(writes, 1)
  await service.create(fields)
  assert.equal(issued, 2)
  assert.equal(writes, 2)
})

test('OAuth read authorization errors are not reported as an empty calendar', async (t) => {
  t.mock.method(globalThis, 'fetch', async (input) => String(input) === tokenUrl ? token()
    : new Response('private-token-should-not-appear', { status: 401 }))
  await assert.rejects(new CalendarService(config()).all(), error => error instanceof CalDAVError
    && /OAuth/.test(error.message) && !/private-token/.test(error.message))
})

test('non-authentication DAV errors never echo a server-provided token', async (t) => {
  t.mock.method(globalThis, 'fetch', async (input) => String(input) === tokenUrl ? token()
    : new Response('private-token-should-not-appear', { status: 500, statusText: 'private-token-should-not-appear' }))
  const service = new CalendarService(config())
  await assert.rejects(service.all(), error => error instanceof CalDAVError && !/private-token/.test(error.message))
  await assert.rejects(service.create({ summary: 'test', start: '2026-09-01', end: '2026-09-02', allDay: true }),
    error => error instanceof CalDAVError && !/private-token/.test(error.message))
})

test('Basic DAV clients keep their existing authorization header', async (t) => {
  t.mock.method(globalThis, 'fetch', async (_input, init) => {
    assert.equal(new Headers(init.headers).get('authorization'), 'Basic ' + Buffer.from('user:app-pass').toString('base64'))
    return events()
  })
  const service = new CalendarService(resolveConfig({ provider: 'icloud', caldavUrl: 'https://dav.example/cal/', username: 'user', password: 'app-pass' }, {}))
  assert.equal((await service.all()).length, 1)
})
