import assert from 'node:assert/strict'
import test from 'node:test'
import { installAuthenticatedCalendar } from '../lib/transport.js'

function mount(principal) {
  const routes = new Map()
  const callers = []
  const ctx = {
    inject(names, callback) {
      assert.deepEqual(names, ['connection'])
      callback({
        connection: {
          browserPeer: principal === undefined ? undefined : { principal },
          admit() { throw new Error('Fetch routes receive already authenticated requests') },
          fetch: {
            register(route) {
              routes.set(route.path, route)
              return () => routes.delete(route.path)
            },
          },
        },
        effect(factory) { factory() },
      })
    },
  }
  installAuthenticatedCalendar(ctx, caller => {
    callers.push(caller)
    return {
      settings: { async fetchAuthenticated(request, draft) { return Response.json({ method: request.method, draft }) } },
      imports: { async fetch() { return Response.json({ imported: true }) } },
    }
  }, false)
  return { routes, callers }
}

test('Calendar uses the owner-only Fetch carrier without redoing admission', async () => {
  const owner = { kind: 'owner' }
  const { routes, callers } = mount(owner)
  const settings = routes.get('/api/dsh-calendar/settings')
  assert.deepEqual(settings.methods, ['GET', 'POST'])
  assert.equal(settings.requestBody, 'buffered')
  const reply = await settings.fetch(new Request('http://localhost/api/dsh-calendar/settings'))
  assert.equal(reply.status, 200)
  assert.deepEqual(await reply.json(), { method: 'GET', draft: false })
  assert.equal(routes.get('/api/dsh-calendar/import').requestBody, 'streaming')
  assert.equal(routes.get('/api/dsh-calendar/draft').requestBody, 'streaming')
  assert.deepEqual(callers, [owner])
})

test('Calendar refuses missing owner identity before it resolves a backend', async () => {
  for (const principal of [undefined, { kind: 'person', id: 'fixture' }]) {
    const { routes, callers } = mount(principal)
    const route = routes.get('/api/dsh-calendar/settings')
    const result = await route.fetch(new Request('http://localhost/api/dsh-calendar/settings'))
    assert.equal(result.status, 403)
    assert.equal(callers.length, 0)
  }
})
