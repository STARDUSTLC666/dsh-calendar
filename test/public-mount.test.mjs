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
      .replace('return module.exports;', 'module.exports.probe = { api }; return module.exports;')
    runInNewContext(source, {
      window: { __ModuleLoader__: { load({ factory }) { client = factory(() => ({})) } } },
      fetch: async (path, init) => {
        requests.push({ url: new URL(path, base).href, init })
        return { ok: true, json: async () => ({ ok: true, value: { saved: true } }) }
      },
    })
    await client.probe.api('save', { value: {}, expectedRevision: 2 })

    for (const request of requests) {
      assert.equal(request.url, base + '_dsh/dsh-calendar/settings')
      assert.equal(request.init.credentials, 'same-origin')
    }
    assert.equal(JSON.parse(requests[0].init.body).expectedRevision, 2)
  })
}
