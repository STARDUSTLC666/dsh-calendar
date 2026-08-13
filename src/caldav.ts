/**
 * CalDAV 访问层：用 tsdav 客户端对单个日历集合做 查询/新建/更新/删除。
 * 直接用集合 URL 操作（createDAVClient 不带 defaultAccountType，跳过服务发现）。
 *
 * @module dsh-calendar/caldav
 */

import { createDAVClient } from 'tsdav'
import type { ResolvedConfig } from './config.js'
import {
  buildICalString,
  expandEventFromICal,
  generateUid,
  parseEventFromICal,
  type CalendarEvent,
  type EventFields,
} from './ical.js'

type DAVClient = Awaited<ReturnType<typeof createDAVClient>>
type DAVCalendarObject = { url: string; etag?: string; data?: unknown }

/** CalDAV 操作错误：带中文指引。 */
export class CalDAVError extends Error {
  readonly status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'CalDAVError'
    this.status = status
  }
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : value + '/'
}

function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

/** 把底层错误翻译成中文指引；识别 401/403 提示应用专用密码。 */
function translateError(error: unknown, action: string): CalDAVError {
  const message = error instanceof Error ? error.message : String(error)
  const status = (error as { status?: number })?.status
  if (status === 401 || status === 403 || /401|403/.test(message)) {
    return new CalDAVError(
      '账号认证失败（401/403）：请检查应用专用密码是否正确生成——' +
      'Google 需在账号安全里创建「应用专用密码」，iCloud 需在 appleid.apple.com 创建 app 专用密码，' +
      '不能用登录密码。请在 profile 的 cordis.patch.yml 覆盖 calendar 行或设置环境变量 DSH_CALENDAR_PASSWORD 后重启。',
      status ?? (/401/.test(message) ? 401 : 403),
    )
  }
  return new CalDAVError(action + ' 失败：' + message, status)
}

/** 对单个日历集合的封装。 */
export class CalendarService {
  private readonly collectionUrl: string
  private clientPromise?: Promise<DAVClient>

  constructor(private readonly config: ResolvedConfig) {
    this.collectionUrl = ensureTrailingSlash(config.caldavUrl)
  }

  private client(): Promise<DAVClient> {
    this.clientPromise ??= createDAVClient({
      serverUrl: this.config.caldavUrl,
      credentials: { username: this.config.username, password: this.config.password },
      authMethod: 'Basic',
    })
    return this.clientPromise
  }

  private calendar(): { url: string } {
    return { url: this.collectionUrl }
  }

  /** 列出某时间段内的事件；expand 为 true 时在窗口内展开 RRULE。 */
  async list(
    startIso: string,
    endIso: string,
    options?: { expand?: boolean; maxOccurrences?: number },
  ): Promise<CalendarEvent[]> {
    const expand = options?.expand !== false
    const maxOccurrences = options?.maxOccurrences ?? 30
    try {
      const client = await this.client()
      const objects = await client.fetchCalendarObjects({
        calendar: this.calendar(),
        timeRange: { start: startIso, end: endIso },
        urlFilter: (url: string) => typeof url === 'string' && url.length > 0,
      })
      return expand
        ? this.toExpandedEvents(objects, startIso, endIso, maxOccurrences)
        : this.toEvents(objects)
    } catch (error) {
      throw translateError(error, '读取日历')
    }
  }

  /** 列出全部事件（客户端过滤用）。 */
  async all(): Promise<CalendarEvent[]> {
    try {
      const client = await this.client()
      const objects = await client.fetchCalendarObjects({
        calendar: this.calendar(),
        urlFilter: (url: string) => typeof url === 'string' && url.length > 0,
      })
      return this.toEvents(objects)
    } catch (error) {
      throw translateError(error, '读取日历')
    }
  }

  private toEvents(objects: DAVCalendarObject[]): CalendarEvent[] {
    const events: CalendarEvent[] = []
    for (const object of objects) {
      const event = parseEventFromICal(String(object.data ?? ''), object.url, object.etag)
      if (event !== null) events.push(event)
    }
    return events
  }

  /** 列出并展开：每个对象经 expandEventFromICal 展开为若干实例行。 */
  private toExpandedEvents(
    objects: DAVCalendarObject[],
    startIso: string,
    endIso: string,
    maxOccurrences: number,
  ): CalendarEvent[] {
    const events: CalendarEvent[] = []
    for (const object of objects) {
      events.push(...expandEventFromICal(
        String(object.data ?? ''),
        object.url,
        object.etag,
        startIso,
        endIso,
        maxOccurrences,
      ))
    }
    return events
  }

  /** 按 uid（href）找到服务器对象（含 etag 与原始 data）。 */
  private async findObject(uid: string): Promise<DAVCalendarObject | undefined> {
    const client = await this.client()
    const target = normalizeUrl(uid)
    const objects = await client.fetchCalendarObjects({
      calendar: this.calendar(),
      urlFilter: (url: string) => normalizeUrl(url) === target,
    })
    return objects.find((object) => normalizeUrl(object.url) === target)
  }

  /** 新建事件，返回带 href/uid 的事件。 */
  async create(fields: EventFields): Promise<CalendarEvent> {
    const iCalString = buildICalString(fields)
    const filename = (fields.icalUid ?? generateUid()) + '.ics'
    try {
      const client = await this.client()
      const response = await client.createCalendarObject({
        calendar: this.calendar(),
        iCalString,
        filename,
      })
      assertOk(response, '新建事件')
    } catch (error) {
      if (error instanceof CalDAVError) throw error
      throw translateError(error, '新建事件')
    }
    const href = new URL(filename, this.collectionUrl).href
    const event = parseEventFromICal(iCalString, href)
    if (event === null) throw new CalDAVError('新建事件失败：生成的 iCal 无法解析')
    return event
  }

  /** 按 uid 更新事件；未提供的字段保留原值。 */
  async update(uid: string, changes: Partial<EventFields>): Promise<CalendarEvent> {
    let object: DAVCalendarObject | undefined
    try {
      object = await this.findObject(uid)
    } catch (error) {
      throw translateError(error, '查找事件')
    }
    if (object === undefined) {
      throw new CalDAVError(
        '找不到 uid 对应的事件：请用 calendar_list 或 calendar_search 重新获取最新 uid，' +
        '该事件可能已被删除或 uid 已过期。',
      )
    }
    const existing = parseEventFromICal(String(object.data ?? ''), object.url, object.etag)
    const start = changes.start ?? existing?.start
    const end = changes.end ?? existing?.end
    if (start === undefined || end === undefined) {
      throw new CalDAVError('无法确定事件的开始/结束时间：请同时提供 start 与 end。')
    }
    const merged: EventFields = {
      summary: changes.summary ?? existing?.summary ?? '',
      start,
      end,
      ...(changes.description !== undefined ? { description: changes.description } : existing?.description !== undefined ? { description: existing.description } : {}),
      ...(changes.location !== undefined ? { location: changes.location } : existing?.location !== undefined ? { location: existing.location } : {}),
      allDay: changes.allDay ?? existing?.allDay,
      ...(existing?.icalUid !== undefined ? { icalUid: existing.icalUid } : {}),
    }
    const iCalString = buildICalString(merged)
    try {
      const client = await this.client()
      const response = await client.updateCalendarObject({
        calendarObject: { url: object.url, etag: object.etag, data: iCalString },
      })
      assertOk(response, '更新事件')
    } catch (error) {
      if (error instanceof CalDAVError) throw error
      throw translateError(error, '更新事件')
    }
    const event = parseEventFromICal(iCalString, object.url, object.etag)
    if (event === null) throw new CalDAVError('更新事件失败：生成的 iCal 无法解析')
    return event
  }

  /** 按 uid 删除事件。 */
  async delete(uid: string): Promise<{ uid: string; href: string }> {
    let object: DAVCalendarObject | undefined
    try {
      object = await this.findObject(uid)
    } catch (error) {
      throw translateError(error, '查找事件')
    }
    if (object === undefined) {
      throw new CalDAVError(
        '找不到 uid 对应的事件：请用 calendar_list 或 calendar_search 重新获取最新 uid，' +
        '该事件可能已被删除或 uid 已过期。',
      )
    }
    try {
      const client = await this.client()
      const response = await client.deleteCalendarObject({
        calendarObject: { url: object.url, etag: object.etag },
      })
      assertOk(response, '删除事件')
    } catch (error) {
      if (error instanceof CalDAVError) throw error
      throw translateError(error, '删除事件')
    }
    return { uid: object.url, href: object.url }
  }
}

/** 校验 HTTP 响应，把 401/403 与其它非 2xx 转成中文错误。 */
function assertOk(response: Response, action: string): void {
  if (response.status === 401 || response.status === 403) {
    throw new CalDAVError(
      '账号认证失败（' + response.status + '）：请检查应用专用密码是否正确生成——' +
      'Google 需在账号安全里创建「应用专用密码」，iCloud 需在 appleid.apple.com 创建 app 专用密码，' +
      '不能用登录密码。请在 profile 的 cordis.patch.yml 覆盖 calendar 行或设置环境变量 DSH_CALENDAR_PASSWORD 后重启。',
      response.status,
    )
  }
  if (!response.ok) {
    throw new CalDAVError(action + ' 失败：服务器返回 ' + response.status + ' ' + response.statusText, response.status)
  }
}
