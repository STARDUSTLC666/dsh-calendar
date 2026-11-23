import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

// Exercise the shipped browser request functions with the browser's base-URL rule.
for (const base of ['https://dsh.example/', 'https://dsh.example/tools/dsh/']) {
  test('settings requests stay inside the application mount: ' + base, async () => {
    let client
    const requests = []
    const source = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')
      .replace('return module.exports;', 'module.exports.probe = { api, ROUTE, IMPORT_ROUTE, DSH_CALENDAR_DRAFT_ROUTE }; return module.exports;')
    runInNewContext(source, {
      window: { __ModuleLoader__: { load({ factory }) { client = factory(() => ({})) } } },
      fetch: async (path, init) => {
        requests.push({ url: new URL(path, base).href, init })
        return { ok: true, json: async () => ({ ok: true, value: { saved: true } }) }
      },
    })
    await client.probe.api('save', { value: {}, expectedRevision: 2 })
    assert.equal(client.probe.ROUTE.startsWith('/'), false)
    assert.equal(client.probe.IMPORT_ROUTE.startsWith('/'), false)
    assert.equal(client.probe.DSH_CALENDAR_DRAFT_ROUTE.startsWith('/'), false)
    await client.probe.api('models', {}, undefined, client.probe.DSH_CALENDAR_DRAFT_ROUTE)
    await client.probe.api('zones', {}, undefined, client.probe.IMPORT_ROUTE)

    assert.equal(requests.length, 3)
    assert.equal(requests[0].url, base + 'api/dsh-calendar/settings')
    assert.equal(requests[1].url, base + 'api/dsh-calendar/draft')
    assert.equal(requests[2].url, base + 'api/dsh-calendar/import')
    for (const request of requests) {
      assert.equal(request.init.credentials, 'same-origin')
    }
    assert.equal(JSON.parse(requests[0].init.body).expectedRevision, 2)
  })
}
