/**
 * CalDAV 访问层：用 tsdav 客户端对单个日历集合做 查询/新建/更新/删除。
 * 直接用集合 URL 操作（createDAVClient 不带 defaultAccountType，跳过服务发现）。
 *
 * @module dsh-calendar/caldav
 */
import { createDAVClient } from 'tsdav';
import { createProxyFetch } from './proxy-fetch.js';
import { createOAuthFetch, OAuthError } from './oauth.js';
import { buildICalString, expandEventFromICal, generateUid, parseEventFromICal, } from './ical.js';
/** CalDAV 操作错误：带中文指引。 */
export class CalDAVError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.name = 'CalDAVError';
        this.status = status;
    }
}
function ensureTrailingSlash(value) {
    return value.endsWith('/') ? value : value + '/';
}
function normalizeUrl(value) {
    const trimmed = value.trim();
    return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}
function authenticationError(config, status) {
    const guidance = config.oauth !== undefined
        ? '请检查 OAuth 授权范围、日历访问权限及 refreshToken；授权失效时请重新授权。Google CalDAV 不接受应用专用密码。'
        : '请检查 username 与 password / DSH_CALENDAR_PASSWORD；iCloud 必须使用应用专用密码，其他服务请确认账号权限。Google CalDAV 需改用 OAuth 2.0。';
    return new CalDAVError('账号认证失败（' + status + '）：' + guidance, status);
}
/** 把底层错误翻译成与当前认证方式匹配的指引。 */
function translateError(error, action, config) {
    if (error instanceof CalDAVError)
        return error;
    if (error instanceof OAuthError)
        return new CalDAVError(error.message, error.status);
    const message = error instanceof Error ? error.message : String(error);
    const status = error?.status;
    if (status === 401 || status === 403 || /401|403/.test(message)) {
        return authenticationError(config, status ?? (/401/.test(message) ? 401 : 403));
    }
    if (config.oauth !== undefined) {
        return new CalDAVError(action + ' 失败：CalDAV 响应或网络请求异常，请检查日历地址与服务权限。', status);
    }
    return new CalDAVError(action + ' 失败：' + message, status);
}
/** 对单个日历集合的封装。 */
export class CalendarService {
    config;
    collectionUrl;
    clientPromise;
    constructor(config) {
        this.config = config;
        this.collectionUrl = ensureTrailingSlash(config.caldavUrl);
    }
    client() {
        if (this.clientPromise === undefined) {
            const transport = this.config.proxyUrl !== '' ? createProxyFetch(this.config.proxyUrl) : globalThis.fetch;
            const oauth = this.config.oauth;
            this.clientPromise = createDAVClient({
                serverUrl: this.config.caldavUrl,
                credentials: oauth === undefined ? { username: this.config.username, password: this.config.password } : {},
                // createDAVClient 的 Oauth 分支只在初始化时取头；改由 fetch 在每次请求时检查过期。
                authMethod: oauth === undefined ? 'Basic' : 'Custom',
                ...(oauth === undefined ? {} : { authFunction: async () => ({}) }),
                fetch: oauth === undefined ? transport : createOAuthFetch(oauth, transport, this.config.caldavUrl),
            });
        }
        // 创建失败时清掉缓存，让下一次工具调用有机会重试，而不是永久复用 rejected promise。
        return this.clientPromise.catch((error) => {
            this.clientPromise = undefined;
            throw error;
        });
    }
    calendar() {
        return { url: this.collectionUrl };
    }
    /** 列出某时间段内的事件；expand 为 true 时在窗口内展开 RRULE。 */
    async list(startIso, endIso, options, signal) {
        const expand = options?.expand !== false;
        const maxOccurrences = options?.maxOccurrences ?? 30;
        signal?.throwIfAborted();
        try {
            const client = await this.client();
            signal?.throwIfAborted();
            const objects = await client.fetchCalendarObjects({
                calendar: this.calendar(),
                timeRange: { start: startIso, end: endIso },
                urlFilter: (url) => typeof url === 'string' && url.length > 0,
                ...(signal !== undefined ? { fetchOptions: { signal } } : {}),
            });
            signal?.throwIfAborted();
            return expand
                ? this.toExpandedEvents(objects, startIso, endIso, maxOccurrences)
                : this.toEvents(objects);
        }
        catch (error) {
            signal?.throwIfAborted();
            throw translateError(error, '读取日历', this.config);
        }
    }
    /** 列出全部事件（客户端过滤用）。 */
    async all(signal) {
        signal?.throwIfAborted();
        try {
            const client = await this.client();
            signal?.throwIfAborted();
            const objects = await client.fetchCalendarObjects({
                calendar: this.calendar(),
                urlFilter: (url) => typeof url === 'string' && url.length > 0,
                ...(signal !== undefined ? { fetchOptions: { signal } } : {}),
            });
            signal?.throwIfAborted();
            return this.toEvents(objects);
        }
        catch (error) {
            signal?.throwIfAborted();
            throw translateError(error, '读取日历', this.config);
        }
    }
    toEvents(objects) {
        const events = [];
        for (const object of objects) {
            const event = parseEventFromICal(String(object.data ?? ''), object.url, object.etag);
            if (event !== null)
                events.push(event);
        }
        return events;
    }
    /** 列出并展开：每个对象经 expandEventFromICal 展开为若干实例行。 */
    toExpandedEvents(objects, startIso, endIso, maxOccurrences) {
        const events = [];
        for (const object of objects) {
            events.push(...expandEventFromICal(String(object.data ?? ''), object.url, object.etag, startIso, endIso, maxOccurrences));
        }
        return events;
    }
    /** 按 uid（href）找到服务器对象（含 etag 与原始 data）。 */
    async findObject(uid, signal) {
        signal?.throwIfAborted();
        const client = await this.client();
        signal?.throwIfAborted();
        const target = normalizeUrl(uid);
        const objects = await client.fetchCalendarObjects({
            calendar: this.calendar(),
            urlFilter: (url) => normalizeUrl(url) === target,
            ...(signal !== undefined ? { fetchOptions: { signal } } : {}),
        });
        signal?.throwIfAborted();
        return objects.find((object) => normalizeUrl(object.url) === target);
    }
    /** 新建事件，返回带 href/uid 的事件。 */
    async create(fields, signal) {
        signal?.throwIfAborted();
        const icalUid = fields.icalUid ?? generateUid();
        const iCalString = buildICalString({ ...fields, icalUid });
        const filename = icalUid + '.ics';
        try {
            const client = await this.client();
            signal?.throwIfAborted();
            const response = await client.createCalendarObject({
                calendar: this.calendar(),
                iCalString,
                filename,
                ...(signal !== undefined ? { fetchOptions: { signal } } : {}),
            });
            signal?.throwIfAborted();
            assertOk(response, '新建事件', this.config);
        }
        catch (error) {
            signal?.throwIfAborted();
            if (error instanceof CalDAVError)
                throw error;
            throw translateError(error, '新建事件', this.config);
        }
        const href = new URL(filename, this.collectionUrl).href;
        const event = parseEventFromICal(iCalString, href);
        if (event === null)
            throw new CalDAVError('新建事件失败：生成的 iCal 无法解析');
        return event;
    }
    /** 按 uid 更新事件；未提供的字段保留原值。 */
    async update(uid, changes, signal) {
        signal?.throwIfAborted();
        let object;
        try {
            object = await this.findObject(uid, signal);
        }
        catch (error) {
            signal?.throwIfAborted();
            throw translateError(error, '查找事件', this.config);
        }
        if (object === undefined) {
            throw new CalDAVError('找不到 uid 对应的事件：请用 calendar_list 或 calendar_search 重新获取最新 uid，' +
                '该事件可能已被删除或 uid 已过期。');
        }
        const existing = parseEventFromICal(String(object.data ?? ''), object.url, object.etag);
        const start = changes.start ?? existing?.start;
        const end = changes.end ?? existing?.end;
        if (start === undefined || end === undefined) {
            throw new CalDAVError('无法确定事件的开始/结束时间：请同时提供 start 与 end。');
        }
        const startMs = new Date(start).getTime();
        const endMs = new Date(end).getTime();
        if (!Number.isNaN(startMs) && !Number.isNaN(endMs) && endMs < startMs) {
            throw new CalDAVError('更新时间范围无效：end 不能早于 start（' + end + ' < ' + start + '）。');
        }
        const merged = {
            summary: changes.summary ?? existing?.summary ?? '',
            start,
            end,
            ...(changes.description !== undefined ? { description: changes.description } : existing?.description !== undefined ? { description: existing.description } : {}),
            ...(changes.location !== undefined ? { location: changes.location } : existing?.location !== undefined ? { location: existing.location } : {}),
            allDay: changes.allDay ?? existing?.allDay,
            ...(changes.rrule !== undefined ? { rrule: changes.rrule } : existing?.rrule !== undefined ? { rrule: existing.rrule } : {}),
            ...(existing?.icalUid !== undefined ? { icalUid: existing.icalUid } : {}),
        };
        const iCalString = buildICalString(merged);
        try {
            const client = await this.client();
            signal?.throwIfAborted();
            const response = await client.updateCalendarObject({
                calendarObject: { url: object.url, etag: object.etag, data: iCalString },
                ...(signal !== undefined ? { fetchOptions: { signal } } : {}),
            });
            signal?.throwIfAborted();
            assertOk(response, '更新事件', this.config);
        }
        catch (error) {
            signal?.throwIfAborted();
            if (error instanceof CalDAVError)
                throw error;
            throw translateError(error, '更新事件', this.config);
        }
        const event = parseEventFromICal(iCalString, object.url, object.etag);
        if (event === null)
            throw new CalDAVError('更新事件失败：生成的 iCal 无法解析');
        return event;
    }
    /** 按 uid 删除事件。 */
    async delete(uid, signal) {
        signal?.throwIfAborted();
        let object;
        try {
            object = await this.findObject(uid, signal);
        }
        catch (error) {
            signal?.throwIfAborted();
            throw translateError(error, '查找事件', this.config);
        }
        if (object === undefined) {
            throw new CalDAVError('找不到 uid 对应的事件：请用 calendar_list 或 calendar_search 重新获取最新 uid，' +
                '该事件可能已被删除或 uid 已过期。');
        }
        try {
            const client = await this.client();
            signal?.throwIfAborted();
            const response = await client.deleteCalendarObject({
                calendarObject: { url: object.url, etag: object.etag },
                ...(signal !== undefined ? { fetchOptions: { signal } } : {}),
            });
            signal?.throwIfAborted();
            assertOk(response, '删除事件', this.config);
        }
        catch (error) {
            signal?.throwIfAborted();
            if (error instanceof CalDAVError)
                throw error;
            throw translateError(error, '删除事件', this.config);
        }
        return { uid: object.url, href: object.url };
    }
}
/** 校验 HTTP 响应，把 401/403 与其它非 2xx 转成中文错误。 */
function assertOk(response, action, config) {
    if (response.status === 401 || response.status === 403) {
        throw authenticationError(config, response.status);
    }
    if (!response.ok) {
        throw new CalDAVError(action + ' 失败：服务器返回 ' + response.status +
            (config.oauth === undefined ? ' ' + response.statusText : ''), response.status);
    }
}
