import type { CalendarEvent } from './ical.js'
import { assertIsoTime } from './time.js'

const MINUTE = 60000
export interface AvailabilityInput {
  start: string; end: string; timeZone: string; durationMinutes?: number
  workStart?: string; workEnd?: string; weekdays?: number[]
  bufferMinutes?: number; stepMinutes?: number; limit?: number
}
export interface AvailabilityResult {
  start: string; end: string; timeZone: string; durationMinutes: number; workStart: string; workEnd: string
  weekdays: number[]; bufferMinutes: number; stepMinutes: number; checkedAt: string
  busyEventCount: number; count: number; hasMore: boolean; slots: Array<{ start: string; end: string }>
  scope: 'connected-calendar'; complete: true
}
export function availabilityRequest(input: AvailabilityInput) {
  for (const key of ['start', 'end'] as const) {
    if (typeof input[key] !== 'string') throw new Error('请提供带时区的查询起止时间')
    assertIsoTime(input[key], key)
    if (!input[key].includes('T')) throw new Error('空闲查询起止时间须包含时间与时区')
  }
  const startMs = Date.parse(input.start), endMs = Date.parse(input.end)
  if (endMs <= startMs || endMs - startMs > 31 * 86400000) throw new Error('空闲查询范围须大于 0 且不超过 31 天')
  if (typeof input.timeZone !== 'string' || input.timeZone.length > 100) throw new Error('请提供 IANA 时区，如 Asia/Shanghai')
  let formatter: Intl.DateTimeFormat
  try { formatter = new Intl.DateTimeFormat('en-CA', { timeZone: input.timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) }
  catch { throw new Error('无法识别查询时区，请使用 Asia/Shanghai 等 IANA 名称') }
  const integer = (value: unknown, fallback: number, min: number, max: number, label: string) => {
    const n = value === undefined ? fallback : value
    if (typeof n !== 'number' || !Number.isInteger(n) || n < min || n > max) throw new Error(label + '必须在 ' + min + '–' + max + ' 之间')
    return n
  }
  const clock = (value: unknown, fallback: string) => {
    const text = value === undefined ? fallback : value
    if (typeof text !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(text)) throw new Error('工作时间须使用 HH:mm，不能跨日')
    return { text, minute: Number(text.slice(0, 2)) * 60 + Number(text.slice(3)) }
  }
  const workStart = clock(input.workStart, '09:00'), workEnd = clock(input.workEnd, '18:00')
  if (workEnd.minute <= workStart.minute) throw new Error('工作结束时间必须晚于开始时间，暂不支持跨日工作窗口')
  const weekdays = input.weekdays ?? [1, 2, 3, 4, 5]
  if (!Array.isArray(weekdays) || !weekdays.length || weekdays.length > 7 || weekdays.some(n => !Number.isInteger(n) || n < 1 || n > 7)) throw new Error('请至少选择一个工作日（周一为 1，周日为 7）')
  return { startMs, endMs, formatter, timeZone: formatter.resolvedOptions().timeZone,
    durationMinutes: integer(input.durationMinutes, 60, 5, 480, '时长'),
    workStart, workEnd, weekdays: [...new Set(weekdays)].sort(),
    bufferMinutes: integer(input.bufferMinutes, 0, 0, 120, '缓冲分钟'),
    stepMinutes: integer(input.stepMinutes, 15, 1, 60, '候选间隔分钟'), limit: integer(input.limit, 20, 1, 100, '候选数量') }
}

/** Only use with a complete, expanded collection; titles never leave this calculation. */
export function findAvailableTimes(events: CalendarEvent[], input: AvailabilityInput): AvailabilityResult {
  const request = availabilityRequest(input), { formatter, startMs, endMs, durationMinutes, bufferMinutes, weekdays, workStart, workEnd } = request
  if (events.length > 10000) throw new Error('日程实例超过 10000 条，请缩小查询范围；未给出空闲建议')
  const timed: Array<[number, number]> = [], allDay: Array<[string, string]> = []
  const localDay = (time: number) => { const p = Object.fromEntries(formatter.formatToParts(time).map(p => [p.type, p.value])); return p.year + '-' + p.month + '-' + p.day }
  const firstDate = localDay(startMs), lastDate = localDay(endMs - 1)
  let busyEventCount = 0
  for (const event of events) {
    if (event.status?.toUpperCase() === 'CANCELLED' || event.transparency?.toUpperCase() === 'TRANSPARENT') continue
    try { assertIsoTime(event.start, '日程开始'); assertIsoTime(event.end, '日程结束') } catch { throw new Error('日程时间不完整，无法可靠计算空闲；请在原日历修正') }
    if (event.allDay) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(event.start) || !/^\d{4}-\d{2}-\d{2}$/.test(event.end) || event.end < event.start) throw new Error('全天日程日期不完整，未给出空闲建议')
      const end = event.end === event.start ? new Date(Date.parse(event.start) + 86400000).toISOString().slice(0, 10) : event.end
      if (event.start <= lastDate && end > firstDate) { allDay.push([event.start, end]); busyEventCount++ }
    } else {
      if (!event.start.includes('T') || !event.end.includes('T')) throw new Error('定时日程缺少时区，未给出空闲建议')
      const a = Date.parse(event.start), b = Date.parse(event.end)
      if (b < a) throw new Error('日程结束早于开始，未给出空闲建议')
      if (b > a && a - bufferMinutes * MINUTE < endMs && b + bufferMinutes * MINUTE > startMs) { timed.push([a - bufferMinutes * MINUTE, b + bufferMinutes * MINUTE]); busyEventCount++ }
    }
  }
  timed.sort((a, b) => a[0] - b[0]); const merged: Array<[number, number]> = []
  for (const interval of timed) { const last = merged.at(-1); if (last && interval[0] <= last[1]) last[1] = Math.max(last[1], interval[1]); else merged.push([...interval]) }
  const first = Math.ceil(startMs / MINUTE) * MINUTE, minutes = Math.max(0, Math.floor((endMs - first) / MINUTE))
  const local = Array.from({ length: minutes + 1 }, (_, i) => {
    const parts = Object.fromEntries(formatter.formatToParts(first + i * MINUTE).map(p => [p.type, p.value]))
    const date = parts.year + '-' + parts.month + '-' + parts.day
    return { date, minute: Number(parts.hour) * 60 + Number(parts.minute), weekday: (new Date(date + 'T00:00:00Z').getUTCDay() + 6) % 7 + 1 }
  })
  const blockedDates = new Set([...new Set(local.map(p => p.date))].filter(date => allDay.some(([a, b]) => date >= a && date < b)))
  const blocked = new Uint32Array(minutes + 1)
  for (let i = 0; i < minutes; i++) { const p = local[i]; blocked[i + 1] = blocked[i] + Number(!weekdays.includes(p.weekday) || p.minute < workStart.minute || p.minute >= workEnd.minute || blockedDates.has(p.date)) }
  const slots: Array<{ start: string; end: string }> = []; let intervalIndex = 0
  for (let i = 0; i + durationMinutes <= minutes; i++) {
    const p = local[i]
    if (p.minute % request.stepMinutes || p.date !== local[i + durationMinutes].date || blocked[i + durationMinutes] !== blocked[i]) continue
    const a = first + i * MINUTE, b = a + durationMinutes * MINUTE
    while (intervalIndex < merged.length && merged[intervalIndex][1] <= a) intervalIndex++
    if (intervalIndex < merged.length && merged[intervalIndex][0] < b) { i = Math.max(i, Math.ceil((merged[intervalIndex][1] - first) / MINUTE) - 1); continue }
    slots.push({ start: new Date(a).toISOString(), end: new Date(b).toISOString() })
    if (slots.length > request.limit) break
  }
  return { start: new Date(startMs).toISOString(), end: new Date(endMs).toISOString(), timeZone: request.timeZone, durationMinutes,
    workStart: workStart.text, workEnd: workEnd.text, weekdays, bufferMinutes, stepMinutes: request.stepMinutes, checkedAt: new Date().toISOString(),
    busyEventCount, count: Math.min(slots.length, request.limit), hasMore: slots.length > request.limit, slots: slots.slice(0, request.limit), scope: 'connected-calendar', complete: true }
}
