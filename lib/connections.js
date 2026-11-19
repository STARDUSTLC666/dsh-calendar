import { resolveConfig } from './config.js';
import { CalendarService } from './caldav.js';
import { findAvailableTimes } from './availability.js';
function normalizedCollection(value) {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash)
        throw new Error('日历集合必须是无内嵌凭据、查询或片段的 HTTP(S) URL / Invalid calendar collection URL');
    url.pathname = url.pathname.replace(/\/+$/, '') + '/';
    return url;
}
/** A configured connection owns every collection; inputs cannot choose arbitrary URLs. */
export function connectionCollections(config) {
    if (config.calendars === undefined)
        return [];
    if (!Array.isArray(config.calendars) || config.calendars.length < 1 || config.calendars.length > 20)
        throw new Error('请配置 1–20 个日历集合 / Configure 1–20 calendar collections');
    const ids = new Set(), urls = new Set();
    return config.calendars.map(row => {
        if (!row || typeof row.id !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/.test(row.id) || ids.has(row.id))
            throw new Error('日历集合 id 无效或重复 / Invalid or duplicate calendar id');
        if (typeof row.url !== 'string' || (row.name !== undefined && typeof row.name !== 'string'))
            throw new Error('日历集合名称或 URL 格式无效 / Invalid calendar name or URL');
        const url = normalizedCollection(row.url).href;
        if (urls.has(url))
            throw new Error('日历集合 URL 重复 / Duplicate calendar collection URL');
        if (row.readOnly !== undefined && typeof row.readOnly !== 'boolean')
            throw new Error('readOnly 必须是布尔值');
        ids.add(row.id);
        urls.add(url);
        return { id: row.id, ...(row.name ? { name: row.name } : {}), url, ...(row.readOnly !== undefined ? { readOnly: row.readOnly } : {}) };
    });
}
/** Explicit write destination is required when more than one collection is configured. */
export function writableCollection(config) {
    if (config.readOnly)
        throw new Error('日历连接为只读 / Calendar connection is read-only');
    const rows = connectionCollections(config);
    if (!rows.length)
        return undefined;
    const row = config.writeCalendar ? rows.find(row => row.id === config.writeCalendar) : rows.length === 1 ? rows[0] : undefined;
    if (!row)
        throw new Error('多个日历必须明确配置 writeCalendar / Choose a writeCalendar explicitly');
    if (row.readOnly)
        throw new Error('目标日历为只读 / Target calendar is read-only');
    return row;
}
export function createConnectionService(config, env = process.env, make = resolved => new CalendarService(resolved)) {
    const rows = connectionCollections(config);
    const single = (row) => make(resolveConfig({ ...config, ...(row ? { caldavUrl: row.url } : {}) }, env));
    const parts = rows.map(row => ({ row, service: single(row), url: normalizedCollection(row.url) }));
    const ordinary = parts.length ? undefined : single();
    const annotate = (event, row) => Object.assign({}, event, { calendarId: row.id, calendarName: row.name ?? row.id, readOnly: !!config.readOnly || !!row.readOnly });
    const own = (uid) => {
        let url;
        try {
            url = new URL(uid);
        }
        catch {
            throw new Error('事件不属于当前连接 / Event is not in this connection');
        }
        if (url.username || url.password || url.search || url.hash)
            throw new Error('事件地址无效 / Invalid event address');
        const found = parts.filter(part => part.url.origin === url.origin && url.pathname.startsWith(part.url.pathname) && url.pathname.length > part.url.pathname.length)
            .sort((a, b) => b.url.pathname.length - a.url.pathname.length)[0];
        if (!found)
            throw new Error('事件不属于当前连接 / Event is not in this connection');
        return found;
    };
    const writable = () => {
        const row = writableCollection(config);
        return row ? parts.find(part => part.row.id === row.id).service : ordinary;
    };
    const mutable = (uid) => {
        if (config.readOnly)
            throw new Error('日历连接为只读 / Calendar connection is read-only');
        if (ordinary)
            return ordinary;
        const part = own(uid);
        if (part.row.readOnly)
            throw new Error('目标日历为只读 / Target calendar is read-only');
        return part.service;
    };
    return {
        async list(start, end, options, signal) {
            if (ordinary)
                return ordinary.list(start, end, options, signal);
            const all = await Promise.all(parts.map(async (part) => (await part.service.list(start, end, options, signal)).map(event => annotate(event, part.row))));
            return all.flat().sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
        },
        async all(signal, timeRange) {
            if (ordinary)
                return ordinary.all(signal, timeRange);
            return (await Promise.all(parts.map(async (part) => (await part.service.all(signal, timeRange)).map(event => annotate(event, part.row))))).flat();
        },
        async create(fields, signal) { return writable().create(fields, signal); },
        async get(uid, signal) { return (ordinary ?? own(uid).service).get(uid, signal); },
        async update(uid, fields, signal, scope) { return mutable(uid).update(uid, fields, signal, scope); },
        async delete(uid, signal, scope) { return mutable(uid).delete(uid, signal, scope); },
        async availability(input, signal) {
            if (ordinary)
                return ordinary.availability(input, signal);
            const cancel = AbortSignal.any([...(signal ? [signal] : []), AbortSignal.timeout(20000)]);
            const complete = await Promise.all(parts.map(part => {
                if (!part.service.availabilityEvents)
                    throw new Error('日历连接不支持完整空闲查询 / Complete calendar read unavailable');
                return part.service.availabilityEvents(input, cancel);
            }));
            cancel.throwIfAborted();
            return findAvailableTimes(complete.flat(), input);
        },
        async importSnapshot(signal) { return writable().importSnapshot(signal); },
        async importRaw(uid, data, signal) { return writable().importRaw(uid, data, signal); },
    };
}
