import ICAL from 'ical.js'
import { expandEventFromICal, type CalendarEvent } from './ical.js'
import { assertIsoTime } from './time.js'

/** Isolate floating times to the selected viewer zone before the existing expander hydrates them. */
export function busyResource(data: string, href: string, start: string, end: string, timeZone: string, deadline = Date.now() + 20000): CalendarEvent[] {
  if (!data.trim() || Buffer.byteLength(data) > 512 * 1024) throw new Error('日历资源缺失或超过 512 KiB，无法完整查询空闲')
  let depth = 0
  for (const line of data.replace(/\r\n/g, '\n').split('\n')) { if (/^BEGIN:/i.test(line)) depth++; if (/^END:/i.test(line)) depth--; if (depth < 0 || depth > 16) throw new Error('日历资源结构不完整，未给出空闲建议') }
  if (depth) throw new Error('日历资源未结束，未给出空闲建议')
  let calendar: ICAL.Component
  try { calendar = new ICAL.Component(ICAL.parse(data)) } catch { throw new Error('日历资源无法解析，未给出空闲建议') }
  const events = calendar.getAllSubcomponents('vevent'), masters = events.filter(e => !e.hasProperty('recurrence-id'))
  if (calendar.name !== 'vcalendar' || masters.length !== 1 || events.length > 2000) throw new Error('日历资源缺少唯一主日程或例外过多，未给出空闲建议')
  const uid = String(masters[0].getFirstPropertyValue('uid') ?? '')
  if (!uid) throw new Error('日历资源缺少 UID，未给出空闲建议')
  const keys = new Set<string>()
  for (const event of events) {
    if (String(event.getFirstPropertyValue('uid') ?? '') !== uid) throw new Error('同一资源混有多个系列，未给出空闲建议')
    const recurrence = event.getFirstProperty('recurrence-id')
    if (recurrence) { const key = JSON.stringify(recurrence.toJSON()); if (keys.has(key) || recurrence.getParameter('range')) throw new Error('重复例外有重复标识或范围改期，无法完整查询空闲'); keys.add(key) }
    if (!event.hasProperty('dtstart')) throw new Error('日程缺少开始时间，未给出空闲建议')
    const rule = event.getFirstPropertyValue('rrule')
    if (rule instanceof ICAL.Recur && rule.until && !rule.until.isDate && rule.until.zone.tzid === 'floating') throw new Error('浮动重复结束时间需先在原日历指定时区，未给出空闲建议')
    for (const property of event.getAllProperties()) {
      if (!['dtstart', 'dtend', 'recurrence-id', 'rdate', 'exdate'].includes(property.name)) continue
      for (const value of property.toJSON().slice(3)) if (typeof value === 'string') assertIsoTime(/^\d{4}-\d{2}-\d{2}$/.test(value) || value.endsWith('Z') ? value : value + 'Z', '日程时间')
      const values = property.getValues()
      if (property.type === 'period') throw new Error('暂不支持 PERIOD 类型的重复日期，未给出空闲建议')
      for (const value of values) if (value instanceof ICAL.Time) { const text = value.toString(); assertIsoTime(value.isDate || text.endsWith('Z') ? text : text + 'Z', '日程时间') }
      if (!property.getParameter('tzid') && values.some(value => value instanceof ICAL.Time && !value.isDate && value.zone.tzid === 'floating')) property.setParameter('tzid', timeZone)
    }
  }
  if (Date.now() > deadline) throw new Error('空闲查询超时，请缩小范围')
  return expandEventFromICal(calendar.toString(), href, undefined, start, end, 2000, { strict: true, overlap: true, deadline })
}
