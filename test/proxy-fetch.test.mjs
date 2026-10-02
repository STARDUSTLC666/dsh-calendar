import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer, request } from 'node:http'
import { connect } from 'node:net'
import { createProxyFetch } from '../lib/proxy-fetch.js'

async function fixture(t, handler) {
  const sockets = new Set(), destinations = []
  const track = socket => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); socket.on('error', () => {}) }
  const target = createServer(handler)
  target.on('connection', track)
  await new Promise(resolve => target.listen(0, '127.0.0.1', resolve))
  const endpoint = '127.0.0.1:' + target.address().port
  const proxy = createServer((req, res) => {
    const url = new URL(req.url)
    destinations.push(url.host)
    if (url.host !== endpoint) { res.writeHead(403).end(); return }
    const upstream = request(url, { method: req.method, headers: req.headers }, response => {
      res.writeHead(response.statusCode, response.headers); response.pipe(res)
    })
    upstream.on('socket', track)
    upstream.on('error', () => res.destroy())
    res.on('close', () => upstream.destroy())
    req.pipe(upstream)
  })
  proxy.on('connection', track)
  proxy.on('connect', (req, downstream, head) => {
    destinations.push(req.url)
    if (req.url !== endpoint) { downstream.end('HTTP/1.1 403 Forbidden\r\n\r\n'); return }
    const upstream = connect(target.address().port, '127.0.0.1', () => {
      downstream.write('HTTP/1.1 200 Connection Established\r\n\r\n')
      if (head.length) upstream.write(head)
      downstream.pipe(upstream); upstream.pipe(downstream)
    })
    track(upstream)
    upstream.on('error', () => downstream.destroy())
    downstream.on('close', () => upstream.destroy())
  })
  await new Promise(resolve => proxy.listen(0, '127.0.0.1', resolve))
  t.after(async () => {
    for (const socket of sockets) socket.destroy()
    await Promise.all([target, proxy].map(server => new Promise(resolve => server.close(resolve))))
  })
  return { fetch: createProxyFetch('http://127.0.0.1:' + proxy.address().port), url: 'http://' + endpoint + '/calendar/', destinations, endpoint }
}

test('CalDAV proxy transport preserves REPORT body and authentication through a real HTTP proxy', async t => {
  let request
  const transport = await fixture(t, async (req, res) => {
    let body = ''; for await (const chunk of req) body += chunk
    request = { method: req.method, authorization: req.headers.authorization, body }
    res.writeHead(207, { 'Content-Type': 'application/xml' }).end('<multistatus>fixture calendar</multistatus>')
  })
  const response = await transport.fetch(transport.url, { method: 'REPORT', body: '<calendar-query>fixture</calendar-query>', headers: { Authorization: 'Basic fixture-only', 'Content-Type': 'application/xml' }, signal: AbortSignal.timeout(3000) })
  assert.equal(response.status, 207)
  assert.match(await response.text(), /fixture calendar/)
  assert.deepEqual(request, { method: 'REPORT', authorization: 'Basic fixture-only', body: '<calendar-query>fixture</calendar-query>' })
  assert.deepEqual(transport.destinations, [transport.endpoint])
})

test('cancelling proxy response reading stops the unfinished CalDAV body', async t => {
  const transport = await fixture(t, (_req, res) => { res.writeHead(200); res.write('partial fixture') })
  const controller = new AbortController()
  const response = await transport.fetch(transport.url, { signal: controller.signal })
  const reading = response.text()
  controller.abort()
  await assert.rejects(reading, error => error.name === 'AbortError')
})
