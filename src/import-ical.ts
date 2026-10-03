import { createHash } from 'node:crypto'
import ICAL from 'ical.js'
import { tzlib_get_ical_block, tzlib_get_timezones } from 'timezones-ical-library'
import { parseEventFromICal } from './ical.js'

export const ICS_LIMIT = 256 * 1024
const zones = new Set(tzlib_get_timezones() as string[])
export const importTimezones = (): string[] => [...new Set(['UTC', ...zones])].sort()
const clone = (component: ICAL.Component): ICAL.Component => new ICAL.Component(JSON.parse(JSON.stringify(component.toJSON())))
const text = (component: ICAL.Component, name: string): string => String(component.getFirstPropertyValue(name) ?? '')
export interface ImportRow {
  id: string; uid: string; summary: string; start?: string; end?: string; allDay?: boolean
  timezones: string[]; recurring: boolean; exceptions: number; warnings: string[]; errors: string[]
  status: 'ready' | 'blocked' | 'duplicate'; conflicts: number
}
export interface ImportItem { row: ImportRow; data: string }
export interface ParsedImport { items: ImportItem[]; ignored: number; suggestedTimezone: string }
function assertDate(value: string): void {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})Z?)?$/)
  if (!match) throw new Error('日期格式不合法')
  const [, y, m, d, h = '0', min = '0', s = '0'] = match
  const date = new Date(0); date.setUTCFullYear(Number(y), Number(m) - 1, Number(d)); date.setUTCHours(Number(h), Number(min), Number(s), 0)
  if (date.getUTCFullYear() !== Number(y) || date.getUTCMonth() + 1 !== Number(m) || date.getUTCDate() !== Number(d)
    || Number(h) > 23 || Number(min) > 59 || Number(s) > 59) throw new Error('日程包含不存在的日期或时间')
}
function visitTimes(event: ICAL.Component, fn: (property: ICAL.Property) => void): void {
  for (const prop of event.getAllProperties()) if (['date', 'date-time', 'period'].includes(prop.type)) fn(prop)
}
function addZone(calendar: ICAL.Component, tzid: string): void {
  if (tzid === 'UTC') return
  const defined = calendar.getAllSubcomponents('vtimezone').filter(c => text(c, 'tzid') === tzid)
  if (defined.length > 1) throw new Error('文件重复定义时区：' + tzid)
  if (defined.length === 1) {
    const rules = defined[0]!.getAllSubcomponents().filter(c => ['standard', 'daylight'].includes(c.name))
    if (!rules.length || rules.some(c => !c.hasProperty('dtstart') || !c.hasProperty('tzoffsetfrom') || !c.hasProperty('tzoffsetto'))) throw new Error('时区定义不完整：' + tzid)
    for (const rule of rules) {
      const start = rule.getFirstProperty('dtstart')!
      const value = String(start.toJSON()[3])
      assertDate(value)
      if (start.type !== 'date-time' || value.endsWith('Z') || start.getParameter('tzid')) throw new Error('时区规则的 DTSTART 必须是本地时间：' + tzid)
      for (const name of ['tzoffsetfrom', 'tzoffsetto']) {
        const offset = String(rule.getFirstProperty(name)!.toJSON()[3])
        const match = offset.match(/^[+-](\d{2}):(\d{2})(?::(\d{2}))?$/)
        if (!match || Number(match[1]) > 23 || Number(match[2]) > 59 || Number(match[3] ?? '0') > 59) throw new Error('时区偏移不合法：' + tzid)
      }
    }
    return
  }
  if (!zones.has(tzid)) throw new Error('无法识别时区 ' + tzid + '；请在原日历导出包含 VTIMEZONE 的文件')
  const block = (tzlib_get_ical_block(tzid) as string[])[0]
  if (!block) throw new Error('缺少时区定义：' + tzid)
  calendar.addSubcomponent(new ICAL.Component(ICAL.parse(block)))
}

/** Parse one file, retain each UID as one CalDAV resource, and never hydrate dates before installing its zones. */
export function parseImportICS(input: unknown, floatingTimezone?: string): ParsedImport {
  if (typeof input !== 'string' || !input.trim()) throw new Error('请先选择或粘贴 ICS 文件内容')
  if (Buffer.byteLength(input, 'utf8') > ICS_LIMIT) throw new Error('ICS 文件超过 256 KiB，请分批导出')
  let depth = 0, maxDepth = 0
  for (const line of input.replace(/\r\n/g, '\n').split('\n')) {
    if (/^BEGIN:/i.test(line)) maxDepth = Math.max(maxDepth, ++depth)
    if (/^END:/i.test(line)) depth--
    if (depth < 0 || maxDepth > 16) throw new Error('ICS 结构不合法或嵌套过深')
  }
  if (depth !== 0) throw new Error('ICS 文件不完整')
  let source: ICAL.Component
  try { source = new ICAL.Component(ICAL.parse(input.replace(/^\uFEFF/, '').trim())) } catch { throw new Error('无法读取 ICS，请从日历应用重新导出') }
  if (source.name !== 'vcalendar' || text(source, 'version') !== '2.0') throw new Error('请使用 VERSION:2.0 的完整 VCALENDAR 文件')
  if (text(source, 'method').toUpperCase() === 'CANCEL') throw new Error('这是取消通知，不能作为新增日程导入')
  const events = source.getAllSubcomponents('vevent')
  if (!events.length) throw new Error('文件中没有可导入的 VEVENT 日程')
  if (events.length > 1000) throw new Error('日程及重复例外超过 1000 条，请分批导出')
  if (floatingTimezone && floatingTimezone !== 'UTC' && !zones.has(floatingTimezone)) throw new Error('请选择支持的 IANA 时区，如 Asia/Shanghai')
  const groups = new Map<string, ICAL.Component[]>()
  events.forEach((event, i) => {
    const uid = text(event, 'uid')
    const key = uid || '__missing_uid_' + i
    groups.set(key, [...(groups.get(key) ?? []), event])
  })
  if (groups.size > 100) throw new Error('单次最多导入 100 个日程系列，请分批导出')
  const items: ImportItem[] = []
  for (const [key, components] of groups) {
    const calendar = clone(source); calendar.removeAllSubcomponents('vevent'); calendar.removeAllSubcomponents('vtimezone'); calendar.removeAllSubcomponents('vtodo'); calendar.removeAllSubcomponents('vjournal'); calendar.removeAllSubcomponents('vfreebusy'); calendar.removeProperty('method')
    for (const component of calendar.getAllSubcomponents()) calendar.removeSubcomponent(component)
    for (const zone of source.getAllSubcomponents('vtimezone')) calendar.addSubcomponent(clone(zone))
    for (const component of components) calendar.addSubcomponent(clone(component))
    const copies = calendar.getAllSubcomponents('vevent')
    const masters = copies.filter(c => !c.hasProperty('recurrence-id'))
    const master = masters[0] ?? copies[0]!
    const usedZones = new Set<string>()
    const row: ImportRow = { id: createHash('sha256').update(key).digest('hex'), uid: text(master, 'uid'), summary: text(master, 'summary').slice(0, 500) || '(无标题)', timezones: [], recurring: master.hasProperty('rrule') || master.hasProperty('rdate'), exceptions: copies.length - masters.length, warnings: [], errors: [], status: 'ready', conflicts: 0 }
    try {
      if (!row.uid.trim() || row.uid.length > 512) throw new Error('UID 缺失或超过 512 字符')
      if (masters.length !== 1) throw new Error(masters.length ? '同一 UID 有多条主日程，请先在原文件去重' : '缺少重复日程的主记录')
      // RFC files can put an override first; keep the master first for consumers that read the first VEVENT.
      calendar.removeAllSubcomponents('vevent'); calendar.addSubcomponent(master)
      for (const copy of copies) if (copy !== master) calendar.addSubcomponent(copy)
      const recurrenceIds = new Set<string>()
      for (const copy of copies) {
        if (copy.hasProperty('recurrence-id')) {
          const recurrence = JSON.stringify(copy.getFirstProperty('recurrence-id')!.toJSON())
          if (recurrenceIds.has(recurrence)) throw new Error('重复例外的 RECURRENCE-ID 重复')
          recurrenceIds.add(recurrence)
        }
        if (!copy.hasProperty('dtstart')) throw new Error('缺少 DTSTART 开始时间')
        if (copy.hasProperty('dtend') && copy.hasProperty('duration')) throw new Error('DTEND 与 DURATION 不能同时出现')
        if (text(copy, 'status').toUpperCase() === 'CANCELLED' && copy === master) throw new Error('主日程已取消，不能作为新增日程导入')
        visitTimes(copy, prop => {
          if (prop.type === 'period') throw new Error('暂不支持 PERIOD 类型的 RDATE，请改用日期列表后导入')
          const raw = prop.toJSON()
          for (const value of raw.slice(3)) assertDate(String(value))
          if (prop.type === 'date') {
            if (prop.getParameter('tzid')) throw new Error('全天日期不能含 TZID')
            return
          }
          const values: string[] = raw.slice(3).map(String)
          let tzid = String(prop.getParameter('tzid') ?? '')
          const floating = values.some(v => !v.endsWith('Z')) && !tzid
          // DTSTAMP / CREATED / LAST-MODIFIED must be UTC, never reinterpret them as the event's local time.
          if (['dtstamp', 'created', 'last-modified'].includes(prop.name) && floating) throw new Error(prop.name.toUpperCase() + ' 必须是 UTC 时间')
          if (floating) {
            if (!floatingTimezone) throw new Error('文件含未标注时区的时间，请选择解释时区后重新预览')
            tzid = floatingTimezone
            row.warnings.push('原文件未标注时区，按 ' + tzid + ' 解释')
          }
          if (tzid && values.some(v => v.endsWith('Z'))) throw new Error('UTC 时间不能同时标注 TZID')
          if (tzid === 'UTC') {
            prop.removeParameter('tzid'); for (let i = 3; i < raw.length; i++) raw[i] = String(raw[i]).replace(/Z$/, '') + 'Z'
          } else if (tzid) { prop.setParameter('tzid', tzid); addZone(calendar, tzid); usedZones.add(tzid) }
        })
        if (!copy.hasProperty('dtstamp')) { copy.addPropertyWithValue('dtstamp', ICAL.Time.fromJSDate(new Date(), true)); row.warnings.push('原文件缺少 DTSTAMP，导入时补齐') }
        if (copy.hasProperty('attendee') || copy.hasProperty('organizer')) {
          copy.removeAllProperties('attendee'); copy.removeAllProperties('organizer'); row.warnings.push('作为私人日程复制，不导入参与者或发送邀请')
        }
        for (const alarm of copy.getAllSubcomponents('valarm')) if (text(alarm, 'action').toUpperCase() !== 'DISPLAY') { copy.removeSubcomponent(alarm); row.warnings.push('仅保留屏幕提醒，已移除其他提醒动作') }
      }
      for (const zone of calendar.getAllSubcomponents('vtimezone')) if (!usedZones.has(text(zone, 'tzid'))) calendar.removeSubcomponent(zone)
      for (const copy of copies) {
        const event = new ICAL.Event(copy)
        if (event.startDate.isDate !== event.endDate.isDate) throw new Error('开始与结束必须同时为全天日期或具体时间')
        if (event.endDate.compare(event.startDate) < 0) throw new Error('日程或重复例外的结束时间早于开始时间')
      }
      row.timezones = usedZones.size ? [...usedZones] : ['UTC / 全天日期']
      const event = parseEventFromICal(calendar.toString(), '')
      if (!event) throw new Error('日程无法解析')
      row.start = event.start; row.end = event.end; row.allDay = event.allDay
      if ((row.end ?? '') < (row.start ?? '')) throw new Error('结束时间早于开始时间')
      const start = master.getFirstPropertyValue('dtstart') as ICAL.Time
      const rule = master.getFirstPropertyValue('rrule') as ICAL.Recur | null
      if (rule?.until && !start.isDate && rule.until.zone.tzid !== 'UTC') {
        if (!floatingTimezone) throw new Error('重复规则 UNTIL 需要 UTC 时间，请重新导出')
        rule.until.zone = start.zone; rule.until = rule.until.convertToZone(ICAL.Timezone.utcTimezone); master.updatePropertyWithValue('rrule', rule)
      }
      row.warnings = [...new Set(row.warnings)]
    } catch (error) { row.errors.push(error instanceof Error ? error.message : '日程格式不合法'); row.status = 'blocked' }
    items.push({ row, data: calendar.toString() })
  }
  return { items, ignored: source.getAllSubcomponents().filter(c => !['vevent', 'vtimezone'].includes(c.name)).length, suggestedTimezone: text(source, 'x-wr-timezone') }
}
