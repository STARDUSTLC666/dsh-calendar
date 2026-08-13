/**
 * 五个面向模型的日历工具：list / create / update / delete / search。
 * 直接调用 ctx.tools.register 注册【编译好的 JSON Schema】参数与 canonical 输出。
 *
 * @module dsh-calendar/tools
 */
import { CalendarService } from './caldav.js';
import { resolveConfig } from './config.js';
import { compileParameters } from './parameters.js';
const EVENT_SCHEMA = { type: 'object', additionalProperties: true };
const TIMEOUT_MS = 60000;
function asRecord(args) {
    return typeof args === 'object' && args !== null ? args : {};
}
function optionalString(args, key) {
    const value = args[key];
    return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}
function requiredString(args, key, label) {
    const value = optionalString(args, key);
    if (value === undefined) {
        throw new Error(label + '（参数 ' + key + '）为必填，请提供非空字符串。');
    }
    return value;
}
function optionalBoolean(args, key) {
    const value = args[key];
    return typeof value === 'boolean' ? value : undefined;
}
function optionalInteger(args, key) {
    const value = args[key];
    return typeof value === 'number' && Number.isInteger(value) ? value : undefined;
}
function booleanWithDefault(args, key, fallback) {
    const value = args[key];
    return typeof value === 'boolean' ? value : fallback;
}
/** 读取整数并 clamp 到 [min, max]；非法值返回 fallback。 */
function clampedInteger(args, key, fallback, min, max) {
    const value = args[key];
    if (typeof value !== 'number' || !Number.isInteger(value))
        return fallback;
    return Math.min(max, Math.max(min, value));
}
function assertIsoTime(value, label) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value))
        return;
    if (Number.isNaN(new Date(value).getTime())) {
        throw new Error(label + ' 不是合法的 ISO 8601 时间，例如 2025-01-01T09:00:00+08:00 或 2025-01-01T09:00:00Z。');
    }
}
function isoNoMillis(value) {
    return value.replace(/\.\d{3}Z$/, 'Z');
}
function formatEvent(event) {
    const range = event.allDay ? event.start + '（全天）' : event.start + ' ~ ' + event.end;
    const extra = [event.location ? '地点：' + event.location : '', event.rrule ? '重复：' + event.rrule : '']
        .filter(Boolean).join('；');
    return '- ' + event.summary + '（' + range + '）' + (extra ? '，' + extra : '') + '，uid=' + event.uid;
}
function buildSearchFilter(query) {
    const needle = query.toLowerCase();
    return (event) => {
        const haystack = [event.summary, event.description ?? '', event.location ?? '', event.icalUid ?? '']
            .join(' ').toLowerCase();
        return haystack.includes(needle);
    };
}
/** 构建五个工具定义；每个 execute 惰性解析配置，缺失时抛出中文指引。 */
export function buildCalendarTools(config) {
    const service = () => new CalendarService(resolveConfig(config));
    const list = {
        name: 'calendar_list',
        description: '列出某时间段内的日历事件（默认未来 7 天）。start/end 为 ISO 8601 时间（含时区偏移，如 2025-01-01T09:00:00+08:00），全天事件返回 YYYY-MM-DD。默认展开重复事件（RRULE）：每个实例作为独立行返回，start/end 为该次发生时间，并带 isOccurrence=true 与 seriesStart（系列原开始时间）；非重复事件保持单行且 isOccurrence=false。expand=false 时重复事件按原始单条返回并带 rrule 字段。maxOccurrences 为每个重复事件的展开次数上限。返回每个事件的稳定标识 uid，供 calendar_update / calendar_delete 使用。',
        parameters: compileParameters({
            start: { type: 'string', description: '起始时间（ISO 8601，含时区偏移）。缺省为当前时间（UTC）。' },
            end: { type: 'string', description: '结束时间（ISO 8601，含时区偏移）。缺省为 start 后 7 天。' },
            expand: { type: 'boolean', description: '是否展开重复事件（RRULE）。默认 true；设为 false 时重复事件按原始单条返回并带 rrule 字段。' },
            maxOccurrences: { type: 'integer', description: '每个重复事件最多展开的实例数上限（默认 30，自动 clamp 到 1-200），防止无终止规则死循环。' },
        }),
        output: {
            schema: {
                type: 'object',
                additionalProperties: true,
                properties: {
                    count: { type: 'integer' },
                    start: { type: 'string' },
                    end: { type: 'string' },
                    events: { type: 'array', items: EVENT_SCHEMA },
                },
                required: ['count', 'events'],
            },
            render: (_args, value) => {
                const result = value;
                const lines = ['时间段 ' + result.start + ' ~ ' + result.end + ' 内共 ' + result.count + ' 个事件：'];
                for (const event of result.events)
                    lines.push(formatEvent(event));
                return [{ type: 'text', text: lines.join('\n') }];
            },
        },
        async execute(args) {
            const input = asRecord(args);
            const now = new Date();
            const defaultEnd = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
            const start = optionalString(input, 'start') ?? isoNoMillis(now.toISOString());
            const end = optionalString(input, 'end') ?? isoNoMillis(defaultEnd.toISOString());
            assertIsoTime(start, 'start');
            assertIsoTime(end, 'end');
            const expand = booleanWithDefault(input, 'expand', true);
            const maxOccurrences = clampedInteger(input, 'maxOccurrences', 30, 1, 200);
            const events = await service().list(start, end, { expand, maxOccurrences });
            return { count: events.length, start, end, events };
        },
        timeoutMs: TIMEOUT_MS,
    };
    const create = {
        name: 'calendar_create',
        description: '新建一个日历事件。summary 与 start、end（ISO 8601，含时区偏移）为必填；description、location、allDay 可选。全天事件 start/end 用 YYYY-MM-DD 或设置 allDay=true。成功返回新事件的稳定标识 uid。',
        parameters: compileParameters({
            summary: { type: 'string', required: true, description: '事件标题（必填）。' },
            start: { type: 'string', required: true, description: '开始时间（ISO 8601，含时区偏移，必填）。' },
            end: { type: 'string', required: true, description: '结束时间（ISO 8601，含时区偏移，必填）。' },
            description: { type: 'string', description: '事件描述（可选）。' },
            location: { type: 'string', description: '地点（可选）。' },
            allDay: { type: 'boolean', description: '是否全天事件（可选，默认 false）。' },
        }),
        output: {
            schema: {
                type: 'object',
                additionalProperties: true,
                properties: { created: EVENT_SCHEMA },
                required: ['created'],
            },
            render: (_args, value) => {
                const event = value.created;
                return [{ type: 'text', text: '已新建事件：' + formatEvent(event) }];
            },
        },
        async execute(args) {
            const input = asRecord(args);
            const summary = requiredString(input, 'summary', '事件标题');
            const start = requiredString(input, 'start', '开始时间');
            const end = requiredString(input, 'end', '结束时间');
            assertIsoTime(start, 'start');
            assertIsoTime(end, 'end');
            const fields = {
                summary,
                start,
                end,
                ...(optionalString(input, 'description') !== undefined ? { description: optionalString(input, 'description') } : {}),
                ...(optionalString(input, 'location') !== undefined ? { location: optionalString(input, 'location') } : {}),
                ...(optionalBoolean(input, 'allDay') !== undefined ? { allDay: optionalBoolean(input, 'allDay') } : {}),
            };
            const created = await service().create(fields);
            return { created };
        },
        timeoutMs: TIMEOUT_MS,
    };
    const update = {
        name: 'calendar_update',
        description: '按 uid 修改日历事件。uid 必填（来自 calendar_list / calendar_search 返回的 uid）。summary、start、end、description、location、allDay 均可选，未提供的字段保留原值。',
        parameters: compileParameters({
            uid: { type: 'string', required: true, description: '事件稳定标识（来自 calendar_list / calendar_search 的 uid，必填）。' },
            summary: { type: 'string', description: '新标题（可选）。' },
            start: { type: 'string', description: '新开始时间（ISO 8601，可选）。' },
            end: { type: 'string', description: '新结束时间（ISO 8601，可选）。' },
            description: { type: 'string', description: '新描述（可选）。' },
            location: { type: 'string', description: '新地点（可选）。' },
            allDay: { type: 'boolean', description: '是否全天事件（可选）。' },
        }),
        output: {
            schema: {
                type: 'object',
                additionalProperties: true,
                properties: { updated: EVENT_SCHEMA },
                required: ['updated'],
            },
            render: (_args, value) => {
                const event = value.updated;
                return [{ type: 'text', text: '已更新事件：' + formatEvent(event) }];
            },
        },
        async execute(args) {
            const input = asRecord(args);
            const uid = requiredString(input, 'uid', '事件 uid');
            const changes = {};
            const summary = optionalString(input, 'summary');
            if (summary !== undefined)
                changes.summary = summary;
            const start = optionalString(input, 'start');
            if (start !== undefined) {
                assertIsoTime(start, 'start');
                changes.start = start;
            }
            const end = optionalString(input, 'end');
            if (end !== undefined) {
                assertIsoTime(end, 'end');
                changes.end = end;
            }
            const description = optionalString(input, 'description');
            if (description !== undefined)
                changes.description = description;
            const location = optionalString(input, 'location');
            if (location !== undefined)
                changes.location = location;
            const allDay = optionalBoolean(input, 'allDay');
            if (allDay !== undefined)
                changes.allDay = allDay;
            const updated = await service().update(uid, changes);
            return { updated };
        },
        timeoutMs: TIMEOUT_MS,
    };
    const remove = {
        name: 'calendar_delete',
        description: '按 uid 删除日历事件。uid 必填（来自 calendar_list / calendar_search 返回的 uid）。删除不可撤销。',
        parameters: compileParameters({
            uid: { type: 'string', required: true, description: '事件稳定标识（来自 calendar_list / calendar_search 的 uid，必填）。' },
        }),
        output: {
            schema: {
                type: 'object',
                additionalProperties: true,
                properties: {
                    deleted: { type: 'boolean' },
                    uid: { type: 'string' },
                    href: { type: 'string' },
                },
                required: ['deleted', 'uid'],
            },
            render: (_args, value) => {
                const result = value;
                return [{ type: 'text', text: '已删除事件：uid=' + result.uid }];
            },
        },
        async execute(args) {
            const input = asRecord(args);
            const uid = requiredString(input, 'uid', '事件 uid');
            const result = await service().delete(uid);
            return { deleted: true, uid: result.uid, href: result.href };
        },
        timeoutMs: TIMEOUT_MS,
    };
    const search = {
        name: 'calendar_search',
        description: '按关键词搜索日历事件（客户端过滤：匹配标题、描述、地点与 iCal UID，不区分大小写）。query 必填，limit 可选（默认 50）。返回每个事件的稳定标识 uid。',
        parameters: compileParameters({
            query: { type: 'string', required: true, description: '搜索关键词（必填）。' },
            limit: { type: 'integer', description: '最多返回条数（可选，默认 50）。' },
        }),
        output: {
            schema: {
                type: 'object',
                additionalProperties: true,
                properties: {
                    query: { type: 'string' },
                    count: { type: 'integer' },
                    events: { type: 'array', items: EVENT_SCHEMA },
                },
                required: ['query', 'count', 'events'],
            },
            render: (_args, value) => {
                const result = value;
                const lines = ['搜索「' + result.query + '」命中 ' + result.count + ' 个事件：'];
                for (const event of result.events)
                    lines.push(formatEvent(event));
                return [{ type: 'text', text: lines.join('\n') }];
            },
        },
        async execute(args) {
            const input = asRecord(args);
            const query = requiredString(input, 'query', '搜索关键词');
            const limit = optionalInteger(input, 'limit') ?? 50;
            const all = await service().all();
            const matched = all.filter(buildSearchFilter(query)).slice(0, limit);
            return { query, count: matched.length, events: matched };
        },
        timeoutMs: TIMEOUT_MS,
    };
    return [list, create, update, remove, search];
}
