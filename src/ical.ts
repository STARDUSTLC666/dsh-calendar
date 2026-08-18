/**
 * iCal 解析与生成：用 ical.js 处理 VEVENT 的字段提取、round-trip 序列化与重复展开。
 * 输入输出统一 ISO 8601（含时区偏移）：全天事件用 YYYY-MM-DD，定时事件转 UTC（Z）。
 *
 * @module dsh-calendar/ical
 */

import { randomUUID } from 'node:crypto'
import ICAL from 'ical.js'

/** 一个暴露给模型的日历事件（或重复系列的一个展开实例）。 */
export interface CalendarEvent {
  /** 稳定标识（CalDAV href），calendar_update / calendar_delete 用它。 */
  uid: string
  /** 与 uid 相同的完整对象 URL，便于调试。 */
  href: string
  /** iCal 里的 UID 原始值（可能为空）。 */
  icalUid?: string
  /** 服务器 ETag（内部用于并发安全更新）。 */
  etag?: string
  summary: string
  description?: string
  location?: string
  /** 开始时间，ISO 8601（定时事件为 UTC，全天为 YYYY-MM-DD）。 */
  start: string
  /** 结束时间，同上；无 DTEND/DURATION 时等于 start。 */
  end: string
  allDay: boolean
  /** 重复规则原样返回（未展开时）；展开后的实例不带此字段。 */
  rrule?: string
  /** 是否为重复系列展开出的实例；非重复事件为 false。 */
  isOccurrence?: boolean
  /** 系列原开始时间（仅 isOccurrence 为 true 的实例存在）。 */
  seriesStart?: string
  status?: string
  url?: string
  created?: string
  lastModified?: string
}

/** 新建 / 更新事件时需要的字段。 */
export interface EventFields {
  summary: string
  start: string
  end: string
  description?: string
  location?: string
  allDay?: boolean
  /** 重复规则（RFC 5545 RRULE 语法），如 FREQ=WEEKLY;COUNT=4。 */
  rrule?: string
  /** iCal UID；创建时缺省则自动生成，更新时用于保留原 UID。 */
  icalUid?: string
}

function pad(value: number): string {
  return value < 10 ? '0' + value : String(value)
}

function isDateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

/** 把任意 hydrated 值安全转成字符串。 */
function asString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'toICALString' in (value as Record<string, unknown>)) {
    const rendered = (value as { toICALString(): string }).toICALString()
    return typeof rendered === 'string' ? rendered : undefined
  }
  return String(value)
}

/** ICAL.Time -> ISO 8601：全天 YYYY-MM-DD，定时转 UTC（Z，去毫秒）。 */
function icalTimeToIso(time: ICAL.Time): string {
  if (time.isDate) {
    return pad(time.year) + '-' + pad(time.month) + '-' + pad(time.day)
  }
  return time.toJSDate().toISOString().replace(/\.\d{3}Z$/, 'Z')
}

/** 把 ISO 字符串转成 epoch 毫秒，用于时间窗口比较。 */
function isoToEpochMs(value: string): number {
  return new Date(value).getTime()
}

function timePropertyValue(vevent: ICAL.Component, name: string): ICAL.Time | undefined {
  const value = vevent.getFirstPropertyValue(name)
  return value instanceof ICAL.Time ? value : undefined
}

/** 计算事件时长：优先 DTEND，其次 DURATION；两者皆无返回 null（时长视为 0）。 */
function veventDuration(vevent: ICAL.Component, dtstart: ICAL.Time): ICAL.Duration | null {
  const dtend = timePropertyValue(vevent, 'dtend')
  if (dtend !== undefined) return dtend.subtractDate(dtstart)
  const duration = vevent.getFirstPropertyValue('duration')
  return duration instanceof ICAL.Duration ? duration : null
}

/**
 * 解析一段 iCal 文本中的首个 VEVENT 为 CalendarEvent；解析失败返回 null。
 * @param data - iCal 文本（通常来自服务器的 calendar-data）。
 * @param href - CalDAV 对象 href，作为稳定 uid。
 * @param etag - 服务器 ETag。
 */
export function parseEventFromICal(data: string, href: string, etag?: string): CalendarEvent | null {
  let vcal: ICAL.Component
  try {
    vcal = new ICAL.Component(ICAL.parse(data))
  } catch {
    return null
  }
  const vevent = vcal.getFirstSubcomponent('vevent')
  if (vevent === null) return null
  return veventToEvent(vevent, href, etag)
}

/** 把单个 VEVENT 组件映射为 CalendarEvent（不展开重复）。 */
function veventToEvent(vevent: ICAL.Component, href: string, etag?: string): CalendarEvent | null {
  const icalUid = asString(vevent.getFirstPropertyValue('uid'))
  const summary = asString(vevent.getFirstPropertyValue('summary')) ?? ''
  const description = asString(vevent.getFirstPropertyValue('description'))
  const location = asString(vevent.getFirstPropertyValue('location'))
  const status = asString(vevent.getFirstPropertyValue('status'))
  const url = asString(vevent.getFirstPropertyValue('url'))
  const created = timePropertyValue(vevent, 'created')
  const lastModified = timePropertyValue(vevent, 'last-modified')

  const dtstartProp = vevent.getFirstProperty('dtstart')
  const dtstart = dtstartProp === null ? undefined : (dtstartProp.getFirstValue() instanceof ICAL.Time ? dtstartProp.getFirstValue() as ICAL.Time : undefined)
  if (dtstart === undefined) return null
  const dtendProp = vevent.getFirstProperty('dtend')
  const dtend = dtendProp === null ? undefined : (dtendProp.getFirstValue() instanceof ICAL.Time ? dtendProp.getFirstValue() as ICAL.Time : undefined)
  const duration = vevent.getFirstPropertyValue('duration')

  const start = icalTimeToIso(dtstart)
  const allDay = dtstart.isDate === true
  let end = dtend === undefined ? undefined : icalTimeToIso(dtend)
  if (end === undefined && duration instanceof ICAL.Duration) {
    const endTime = dtstart.clone()
    endTime.addDuration(duration)
    end = icalTimeToIso(endTime)
  }
  if (end === undefined) end = start

  const rruleValue = vevent.getFirstPropertyValue('rrule')
  const rrule = rruleValue instanceof ICAL.Recur ? rruleValue.toString() : undefined

  const event: CalendarEvent = {
    uid: href,
    href,
    summary,
    start,
    end,
    allDay,
    ...(icalUid !== undefined ? { icalUid } : {}),
    ...(etag !== undefined ? { etag } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(location !== undefined ? { location } : {}),
    ...(rrule !== undefined ? { rrule } : {}),
    ...(status !== undefined ? { status } : {}),
    ...(url !== undefined ? { url } : {}),
    ...(created !== undefined ? { created: icalTimeToIso(created) } : {}),
    ...(lastModified !== undefined ? { lastModified: icalTimeToIso(lastModified) } : {}),
  }
  return event
}

/** 由一次 occurrence 起始时间构造实例行。 */
function buildOccurrence(base: CalendarEvent, occurrenceStart: ICAL.Time, duration: ICAL.Duration | null): CalendarEvent {
  const start = icalTimeToIso(occurrenceStart)
  let end = start
  if (duration !== null) {
    const endTime = occurrenceStart.clone()
    endTime.addDuration(duration)
    end = icalTimeToIso(endTime)
  }
  return {
    uid: base.uid,
    href: base.href,
    summary: base.summary,
    start,
    end,
    allDay: base.allDay,
    isOccurrence: true,
    seriesStart: base.start,
    ...(base.icalUid !== undefined ? { icalUid: base.icalUid } : {}),
    ...(base.etag !== undefined ? { etag: base.etag } : {}),
    ...(base.description !== undefined ? { description: base.description } : {}),
    ...(base.location !== undefined ? { location: base.location } : {}),
    ...(base.status !== undefined ? { status: base.status } : {}),
    ...(base.url !== undefined ? { url: base.url } : {}),
    ...(base.created !== undefined ? { created: base.created } : {}),
    ...(base.lastModified !== undefined ? { lastModified: base.lastModified } : {}),
  }
}

/**
 * 解析并（可选）展开一个 VEVENT：非重复事件原样返回（isOccurrence: false）；
 * 重复事件用 ICAL.RecurExpansion 在 [rangeStart, rangeEnd] 内展开，最多返回
 * maxOccurrences 个实例（isOccurrence: true + seriesStart）。
 * @param data - iCal 文本。
 * @param href - CalDAV 对象 href，作为稳定 uid。
 * @param etag - 服务器 ETag。
 * @param rangeStart - 查询窗口起始（ISO 8601）。
 * @param rangeEnd - 查询窗口结束（ISO 8601）。
 * @param maxOccurrences - 每个事件最多展开的实例数（防死循环）。
 */
export function expandEventFromICal(
  data: string,
  href: string,
  etag: string | undefined,
  rangeStart: string,
  rangeEnd: string,
  maxOccurrences: number,
): CalendarEvent[] {
  const base = parseEventFromICal(data, href, etag)
  if (base === null) return []

  let vcal: ICAL.Component
  try {
    vcal = new ICAL.Component(ICAL.parse(data))
  } catch {
    return [{ ...base, isOccurrence: false }]
  }
  const vevent = vcal.getFirstSubcomponent('vevent')
  if (vevent === null) return [{ ...base, isOccurrence: false }]

  if (!vevent.hasProperty('rrule') && !vevent.hasProperty('rdate')) {
    return [{ ...base, isOccurrence: false }]
  }

  const dtstart = timePropertyValue(vevent, 'dtstart')
  if (dtstart === undefined) return [{ ...base, isOccurrence: false }]

  const duration = veventDuration(vevent, dtstart)
  const expansion = new ICAL.RecurExpansion({ component: vevent, dtstart })
  const rangeStartMs = isoToEpochMs(rangeStart)
  const rangeEndMs = isoToEpochMs(rangeEnd)
  const occurrences: CalendarEvent[] = []

  try {
    const totalIterationCap = Math.max(100000, maxOccurrences * 1000)
    let iterations = 0
    while (occurrences.length < maxOccurrences) {
      iterations += 1
      if (iterations > totalIterationCap) break
      const next = expansion.next() as ICAL.Time | null | undefined
      if (next === null || next === undefined) break
      const occMs = next.toUnixTime() * 1000
      if (occMs > rangeEndMs) break
      if (occMs < rangeStartMs) continue
      occurrences.push(buildOccurrence(base, next, duration))
    }
  } catch {
    // 规则无法满足或迭代异常时，返回已成功展开的部分实例。
  }

  return occurrences
}

/** 生成随机 iCal UID（带 host 后缀，形如 UUID）。 */
export function generateUid(): string {
  return randomUUID()
}

/** 把字段生成一段完整 iCal 文本（单个 VEVENT）。 */
export function buildICalString(fields: EventFields): string {
  const vcal = new ICAL.Component('vcalendar')
  const vevent = new ICAL.Component('vevent')
  vevent.addPropertyWithValue('uid', fields.icalUid ?? generateUid())
  vevent.addPropertyWithValue('summary', fields.summary)

  const start = parseTime(fields.start, fields.allDay === true || isDateOnly(fields.start))
  const end = parseTime(fields.end, fields.allDay === true || isDateOnly(fields.end))
  vevent.addPropertyWithValue('dtstart', start)
  vevent.addPropertyWithValue('dtend', end)

  if (fields.description !== undefined && fields.description !== '') {
    vevent.addPropertyWithValue('description', fields.description)
  }
  if (fields.location !== undefined && fields.location !== '') {
    vevent.addPropertyWithValue('location', fields.location)
  }
  if (fields.rrule !== undefined && fields.rrule !== '') {
    const rule = fields.rrule.trim()
    if (!/^FREQ=/i.test(rule)) {
      throw new Error('rrule 格式无效：' + fields.rrule + '（应为 RFC 5545 RRULE，如 FREQ=WEEKLY;COUNT=4）')
    }
    try {
      vevent.addPropertyWithValue('rrule', ICAL.Recur.fromString(rule))
    } catch (error) {
      throw new Error('rrule 格式无效：' + fields.rrule)
    }
  }
  vcal.addSubcomponent(vevent)
  return vcal.toString()
}

/** 把 ISO 字符串解析成 ICAL.Time（全天 YYYY-MM-DD 或转 UTC 的定时时间）。 */
function parseTime(value: string, allDay: boolean): ICAL.Time {
  if (allDay || isDateOnly(value)) {
    return ICAL.Time.fromDateString(value)
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error('时间格式不合法：' + value + '（应为 ISO 8601，含时区偏移，如 2025-01-01T09:00:00+08:00）')
  }
  // 用 UTC 瞬间构造，序列化为带 Z 的稳定形式，避免时区歧义。
  return ICAL.Time.fromJSDate(date, true)
}
