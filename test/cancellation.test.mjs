import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CalendarService, resolveConfig } from '../lib/index.js'

const config = resolveConfig({ provider: 'custom', username: 'test', password: 'test', caldavUrl: 'https://calendar.example/test/' }, {})

test('pre-aborted CalDAV calls never initialize a client', async () => {
  const service = new CalendarService(config)
  service.client = () => { assert.fail('client must not start') }
  const reason = new Error('stopped before request')
  const signal = AbortSignal.abort(reason)
  await assert.rejects(service.list('2026-09-01T00:00:00Z', '2026-09-02T00:00:00Z', {}, signal), (error) => error === reason)
  await assert.rejects(service.create({ summary: 'test', start: '2026-09-01', end: '2026-09-02', allDay: true }, signal), (error) => error === reason)
})

test('CalDAV reads forward the Harness signal and retain its cancellation reason', async () => {
  const controller = new AbortController()
  const reason = new Error('calendar request cancelled')
  const service = new CalendarService(config)
  service.clientPromise = Promise.resolve({
    async fetchCalendarObjects(options) {
      assert.equal(options.fetchOptions.signal, controller.signal)
      controller.abort(reason)
      throw new Error('underlying fetch closed')
    },
  })
  await assert.rejects(service.all(controller.signal), (error) => error === reason)
})
