import test from 'node:test'
import assert from 'node:assert/strict'
import { DRAFT_ROUTE, SETTINGS_ROUTE, installCalendarSettingsWeb } from '../lib/web.js'

function setup(connection) {
  const routes = new Map()
  const effects = []
  const webServer = {
    register(route) {
      routes.set(route.path, route)
      return () => routes.delete(route.path)
    },
  }
  const ctx = {
    inject(names, callback) {
      if (names.includes('webServer')) {
        callback({
          ...(names.includes('connection') ? { connection } : {}),
          webServer,
          effect(fn) { effects.push(fn()); },
        })
      }
    },
  }
  let backendCalls = 0
  const backend = {
    async handle(_req, res, draft) {
      backendCalls++
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: true, draft: Boolean(draft) }))
    },
  }
  installCalendarSettingsWeb(ctx, backend)
  return { routes, effects, backendCalls: () => backendCalls }
}

function request(readBody = () => {}, method = 'POST') {
  return {
    method,
    headers: { host: 'calendar.example', origin: 'https://calendar.example', 'content-type': 'application/json' },
    socket: { remoteAddress: '203.0.113.18' },
    async *[Symbol.asyncIterator]() { readBody(); yield Buffer.from('{"action":"create"}') },
  }
}

function response() {
  return {
    status: 0,
    body: '',
    writeHead(status) { this.status = status },
    end(value) { this.body = String(value ?? '') },
  }
}

test('legacy settings and draft routes reject unauthenticated requests before body or backend access', async () => {
  let checks = 0, bodyReads = 0
  const mounted = setup({ requestRejection(input) {
    checks++
    assert.deepEqual(input.headers, request(() => {}).headers)
    return 401
  } })
  assert.deepEqual([...mounted.routes.keys()].sort(), [DRAFT_ROUTE, SETTINGS_ROUTE].sort())
  for (const path of [SETTINGS_ROUTE, DRAFT_ROUTE]) {
    const res = response()
    await mounted.routes.get(path).handler(request(() => bodyReads++), res)
    assert.equal(res.status, 401)
  }
  assert.equal(checks, 2)
  assert.equal(bodyReads, 0)
  assert.equal(mounted.backendCalls(), 0)
})

test('legacy routes deny forbidden requests and fail closed when connection auth is absent', async () => {
  for (const connection of [
    { requestRejection: () => 403 },
    { requestRejection() { throw new Error('auth provider failed') } },
    undefined,
    {},
  ]) {
    const mounted = setup(connection)
    for (const path of [SETTINGS_ROUTE, DRAFT_ROUTE]) {
      let bodyReads = 0
      const res = response()
      await mounted.routes.get(path).handler(request(() => bodyReads++), res)
      assert.equal(res.status, 403)
      assert.equal(bodyReads, 0)
      assert.equal(mounted.backendCalls(), 0)
    }
  }
})

test('authorized legacy requests preserve settings GET, settings POST and draft POST behavior', async () => {
  const checked = []
  const mounted = setup({ requestRejection(input) { checked.push(input); return undefined } })
  for (const [path, method, expectedDraft] of [[SETTINGS_ROUTE, 'GET', false], [SETTINGS_ROUTE, 'POST', false], [DRAFT_ROUTE, 'POST', true]]) {
    const res = response()
    await mounted.routes.get(path).handler(request(() => {}, method), res)
    assert.equal(res.status, 200)
    assert.match(res.body, new RegExp(`"draft":${expectedDraft}`))
  }
  assert.equal(checked.length, 3)
  assert.equal(mounted.backendCalls(), 3)
})
