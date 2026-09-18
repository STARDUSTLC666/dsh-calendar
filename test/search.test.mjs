import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildCalendarTools } from '../lib/index.js'

const CALENDAR_URL = 'https://calendar.example/test/'

/** 单个 CalDAV 对象的 multistatus 片段。 */
function eventXml(href, summary, dtstart, dtend) {
  return '<D:response><D:href>' + href + '</D:href><D:propstat><D:prop><D:getetag>"1"</D:getetag>' +
    '<C:calendar-data><![CDATA[BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:' + summary +
    '\r\nSUMMARY:' + summary + '\r\nDTSTART:' + dtstart + '\r\nDTEND:' + dtend +
    '\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n]]></C:calendar-data></D:prop>' +
    '<D:status>HTTP/1.1 200 OK</D:status></D:propstat></D:response>'
}

function multiStatus(fragments) {
  return new Response('<?xml version="1.0"?>\n<D:multistatus xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">' +
    fragments.join('') + '</D:multistatus>', { status: 207, headers: { 'content-type': 'application/xml' } })
}

/** 假服务器：带 time-range 的 calendar-query 只回窗口内对象；calendar-multiget 只回请求体点名的 href。 */
function fakeServer(reports, inWindowHref) {
  const inWindow = eventXml(inWindowHref, '窗口内会议', '20260901T090000Z', '20260901T100000Z')
  const outsideHref = CALENDAR_URL + 'outside.ics'
  const outside = eventXml(outsideHref, '窗口外会议', '20200101T090000Z', '20200101T100000Z')
  return async (input, init) => {
    assert.equal(init.method, 'REPORT')
    const body = String(init.body)
    reports.push(body)
    if (body.includes('time-range')) return multiStatus([inWindow])
    const requested = [...body.matchAll(/<[^>]*href>([^<]+)<\/[^>]*href>/g)].map((match) => match[1])
    // 无界 calendar-query：真实服务器会整本返回，随后 multiget 点名所有 href。
    if (requested.length === 0) return multiStatus([inWindow, outside])
    return multiStatus(requested.map((href) => {
      const fullHref = href.startsWith('http') ? href : new URL(href, CALENDAR_URL).href
      if (fullHref === inWindowHref) return inWindow
      if (fullHref === outsideHref) return outside
      return ''
    }))
  }
}

function searchTool() {
  return buildCalendarTools({ provider: 'custom', username: 'u', password: 'p', caldavUrl: CALENDAR_URL })
    .find((tool) => tool.name === 'calendar_search')
}

test('calendar_search 带 start/end 时走 timeRange 查询，窗口外对象不进结果', async (t) => {
  const reports = []
  t.mock.method(globalThis, 'fetch', fakeServer(reports, CALENDAR_URL + 'inside.ics'))

  const result = await searchTool().execute({ query: '会议', start: '2026-09-01T00:00:00Z', end: '2026-09-02T00:00:00Z' })

  assert.equal(result.count, 1)
  assert.deepEqual(result.events.map((event) => event.uid), [CALENDAR_URL + 'inside.ics'])
  assert.match(reports[0], /time-range start="20260901T000000Z" end="20260902T000000Z"/)
  assert.ok(reports.every((body) => !body.includes('outside.ics')), '任何请求体都不应包含窗口外对象的 href')
  assert.ok(!JSON.stringify(result.events).includes('outside.ics'), '结果不应包含窗口外对象')
})

test('calendar_search 缺省 start/end 时用有界默认窗口，不再整本下载', async (t) => {
  const reports = []
  t.mock.method(globalThis, 'fetch', fakeServer(reports, CALENDAR_URL + 'inside.ics'))

  const result = await searchTool().execute({ query: '会议' })

  assert.ok(reports[0].includes('time-range'), '缺省查询也必须带 timeRange')
  assert.ok(reports.every((body) => !body.includes('outside.ics')), '缺省窗口同样不应请求窗口外对象')
  assert.ok(!JSON.stringify(result.events).includes('outside.ics'))
})
