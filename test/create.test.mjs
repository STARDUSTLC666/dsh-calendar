import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CalendarService, resolveConfig } from '../lib/index.js'

const config = resolveConfig({ provider: 'custom', username: 'test', password: 'test', caldavUrl: 'https://calendar.example/test/' }, {})
const COLLECTION = 'https://calendar.example/test/'

/** 假 CalDAV 服务器：PUT 由服务器分配 href，并支持按 href 回读与更新。 */
function makeFakeServer(options = {}) {
  const objects = new Map()
  const calls = { create: [], fetch: [], update: [] }
  const assignHref = options.assignHref ?? ((filename) => new URL(filename, COLLECTION).href)
  return {
    calls,
    async createCalendarObject(args) {
      calls.create.push(args)
      const href = assignHref(args.filename)
      objects.set(href, { url: href, etag: 'etag-created', data: args.iCalString })
      return new Response(null, { status: 201, headers: options.location === false ? {} : { location: href } })
    },
    async fetchCalendarObjects(options) {
      calls.fetch.push(options)
      const all = [...objects.values()]
      return options.urlFilter ? all.filter((object) => options.urlFilter(object.url)) : all
    },
    async updateCalendarObject(args) {
      calls.update.push(args)
      const existing = objects.get(args.calendarObject.url)
      if (existing === undefined) return new Response(null, { status: 404 })
      objects.set(args.calendarObject.url, { ...existing, data: args.calendarObject.data, etag: 'etag-updated' })
      return new Response(null, { status: 204 })
    },
  }
}

test('calendar_create 采用服务器 Location 的 href，且紧接着 update 能找到该 uid', async () => {
  const server = makeFakeServer({ assignHref: () => COLLECTION + 'SERVER-ASSIGNED.ics' })
  const service = new CalendarService(config)
  service.clientPromise = Promise.resolve(server)

  const created = await service.create({ summary: '服务器分配 uid', start: '2026-09-01T09:00:00Z', end: '2026-09-01T10:00:00Z' })
  assert.equal(created.uid, COLLECTION + 'SERVER-ASSIGNED.ics')
  assert.equal(created.href, COLLECTION + 'SERVER-ASSIGNED.ics')

  const updated = await service.update(created.uid, { summary: '改名成功' })
  assert.equal(updated.summary, '改名成功')
  assert.equal(server.calls.update.length, 1)
  assert.equal(server.calls.update[0].calendarObject.url, COLLECTION + 'SERVER-ASSIGNED.ics')
})

test('服务器未回 Location 时回读一次确认实际 href', async () => {
  const server = makeFakeServer({ location: false })
  const service = new CalendarService(config)
  service.clientPromise = Promise.resolve(server)

  const created = await service.create({ summary: '回读确认', start: '2026-09-01T09:00:00Z', end: '2026-09-01T10:00:00Z' })
  assert.equal(created.uid, COLLECTION + server.calls.create[0].filename)
  assert.equal(created.href, COLLECTION + server.calls.create[0].filename)
  assert.equal(server.calls.fetch.length, 1, '缺少 Location 时应回读一次确认')
})

test('calendar_create 的 PUT body 含 RFC 5545 必需的 VERSION/PRODID/DTSTAMP', async () => {
  const server = makeFakeServer()
  const service = new CalendarService(config)
  service.clientPromise = Promise.resolve(server)

  await service.create({ summary: '补必需属性', start: '2026-09-01T09:00:00Z', end: '2026-09-01T10:00:00Z' })

  const body = server.calls.create[0].iCalString
  assert.match(body, /BEGIN:VCALENDAR/)
  assert.match(body, /VERSION:2\.0/)
  assert.match(body, /PRODID:-\/\/dsh-calendar\/\/EN/)
  assert.match(body, /DTSTAMP:\d{8}T\d{6}Z/)
})
