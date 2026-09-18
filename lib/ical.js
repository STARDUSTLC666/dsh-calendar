/**
 * iCal 解析与生成：用 ical.js 处理 VEVENT 的字段提取、round-trip 序列化与重复展开。
 * 输入输出统一 ISO 8601（含时区偏移）：全天事件用 YYYY-MM-DD，定时事件转 UTC（Z）。
 *
 * @module dsh-calendar/ical
 */
import { randomUUID } from 'node:crypto';
import ICAL from 'ical.js';
function pad(value) {
    return value < 10 ? '0' + value : String(value);
}
function isDateOnly(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
/** 把任意 hydrated 值安全转成字符串。 */
function asString(value) {
    if (value === null || value === undefined)
        return undefined;
    if (typeof value === 'string')
        return value;
    if (typeof value === 'object' && 'toICALString' in value) {
        const rendered = value.toICALString();
        return typeof rendered === 'string' ? rendered : undefined;
    }
    return String(value);
}
/** ICAL.Time -> ISO 8601：全天 YYYY-MM-DD，定时转 UTC（Z，去毫秒）。 */
function icalTimeToIso(time) {
    if (time.isDate) {
        return pad(time.year) + '-' + pad(time.month) + '-' + pad(time.day);
    }
    return time.toJSDate().toISOString().replace(/\.\d{3}Z$/, 'Z');
}
/** 把 ISO 字符串转成 epoch 毫秒，用于时间窗口比较。 */
function isoToEpochMs(value) {
    return new Date(value).getTime();
}
function timePropertyValue(vevent, name) {
    const value = vevent.getFirstPropertyValue(name);
    return value instanceof ICAL.Time ? value : undefined;
}
/** 计算事件时长：优先 DTEND，其次 DURATION；两者皆无返回 null（时长视为 0）。 */
function veventDuration(vevent, dtstart) {
    const dtend = timePropertyValue(vevent, 'dtend');
    if (dtend !== undefined)
        return dtend.subtractDate(dtstart);
    const duration = vevent.getFirstPropertyValue('duration');
    return duration instanceof ICAL.Duration ? duration : null;
}
/**
 * 解析一段 iCal 文本中的首个 VEVENT 为 CalendarEvent；解析失败返回 null。
 * @param data - iCal 文本（通常来自服务器的 calendar-data）。
 * @param href - CalDAV 对象 href，作为稳定 uid。
 * @param etag - 服务器 ETag。
 */
export function parseEventFromICal(data, href, etag) {
    let vcal;
    try {
        vcal = new ICAL.Component(ICAL.parse(data));
    }
    catch {
        return null;
    }
    const vevent = masterVevent(vcal);
    if (vevent === null)
        return null;
    return veventToEvent(vevent, href, etag);
}
/** 把单个 VEVENT 组件映射为 CalendarEvent（不展开重复）。 */
function veventToEvent(vevent, href, etag) {
    const icalUid = asString(vevent.getFirstPropertyValue('uid'));
    const summary = asString(vevent.getFirstPropertyValue('summary')) ?? '';
    const description = asString(vevent.getFirstPropertyValue('description'));
    const location = asString(vevent.getFirstPropertyValue('location'));
    const status = asString(vevent.getFirstPropertyValue('status'));
    const url = asString(vevent.getFirstPropertyValue('url'));
    const created = timePropertyValue(vevent, 'created');
    const lastModified = timePropertyValue(vevent, 'last-modified');
    const dtstartProp = vevent.getFirstProperty('dtstart');
    const dtstart = dtstartProp === null ? undefined : (dtstartProp.getFirstValue() instanceof ICAL.Time ? dtstartProp.getFirstValue() : undefined);
    if (dtstart === undefined)
        return null;
    const dtendProp = vevent.getFirstProperty('dtend');
    const dtend = dtendProp === null ? undefined : (dtendProp.getFirstValue() instanceof ICAL.Time ? dtendProp.getFirstValue() : undefined);
    const duration = vevent.getFirstPropertyValue('duration');
    const start = icalTimeToIso(dtstart);
    const allDay = dtstart.isDate === true;
    let end = dtend === undefined ? undefined : icalTimeToIso(dtend);
    if (end === undefined && duration instanceof ICAL.Duration) {
        const endTime = dtstart.clone();
        endTime.addDuration(duration);
        end = icalTimeToIso(endTime);
    }
    if (end === undefined)
        end = start;
    const rruleValue = vevent.getFirstPropertyValue('rrule');
    const rrule = rruleValue instanceof ICAL.Recur ? rruleValue.toString() : undefined;
    const event = {
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
    };
    return event;
}
/** 挑选系列主 VEVENT：优先不带 RECURRENCE-ID 的那个，避免把单次实例覆盖当成系列本身。 */
function masterVevent(vcal) {
    const vevents = vcal.getAllSubcomponents('vevent');
    return vevents.find((vevent) => !vevent.hasProperty('recurrence-id')) ?? vevents[0] ?? null;
}
/** 把实例时间规整成可比较的键：全天按日期，定时按 epoch 秒。 */
function recurrenceKey(time) {
    return time.isDate === true ? 'D:' + icalTimeToIso(time) : 'T:' + time.toUnixTime();
}
/** 由一次 occurrence 起始时间构造实例行。 */
function buildOccurrence(base, occurrenceStart, duration) {
    const start = icalTimeToIso(occurrenceStart);
    let end = start;
    if (duration !== null) {
        const endTime = occurrenceStart.clone();
        endTime.addDuration(duration);
        end = icalTimeToIso(endTime);
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
    };
}
/**
 * 用带 RECURRENCE-ID 的覆盖 VEVENT 构造实例行：字段以覆盖 VEVENT 为准，
 * 稳定标识（uid/href/etag）与 seriesStart 继承系列主 VEVENT。
 * 覆盖 VEVENT 缺少可用 DTSTART 时用 RECURRENCE-ID 兜底，避免实例被静默丢弃。
 */
function buildOverrideEvent(base, vevent) {
    const parsed = veventToEvent(vevent, base.href, base.etag);
    if (parsed !== null) {
        return {
            ...parsed,
            uid: base.uid,
            href: base.href,
            isOccurrence: true,
            seriesStart: base.start,
            ...(parsed.icalUid === undefined && base.icalUid !== undefined ? { icalUid: base.icalUid } : {}),
        };
    }
    const recurrenceId = timePropertyValue(vevent, 'recurrence-id');
    if (recurrenceId === undefined)
        return null;
    return {
        uid: base.uid,
        href: base.href,
        summary: asString(vevent.getFirstPropertyValue('summary')) ?? base.summary,
        start: icalTimeToIso(recurrenceId),
        end: icalTimeToIso(recurrenceId),
        allDay: recurrenceId.isDate === true,
        isOccurrence: true,
        seriesStart: base.start,
        ...(base.icalUid !== undefined ? { icalUid: base.icalUid } : {}),
        ...(base.etag !== undefined ? { etag: base.etag } : {}),
        ...(base.description !== undefined ? { description: base.description } : {}),
        ...(base.location !== undefined ? { location: base.location } : {}),
    };
}
/**
 * 解析并（可选）展开一个 VEVENT：非重复事件原样返回（isOccurrence: false）；
 * 重复事件用 ICAL.RecurExpansion 在 [rangeStart, rangeEnd] 内展开，最多返回
 * maxOccurrences 个实例（isOccurrence: true + seriesStart）。
 *
 * 同一 VCALENDAR 里带 RECURRENCE-ID 的 VEVENT 是单次实例的覆盖（改期/改标题）：
 * 展开时用覆盖 VEVENT 替换对应原实例；原实例被 EXDATE 排除或原时间在窗口外时，
 * 只要覆盖后的实例落在窗口内仍单独返回，避免实例被静默丢弃。
 * @param data - iCal 文本。
 * @param href - CalDAV 对象 href，作为稳定 uid。
 * @param etag - 服务器 ETag。
 * @param rangeStart - 查询窗口起始（ISO 8601）。
 * @param rangeEnd - 查询窗口结束（ISO 8601）。
 * @param maxOccurrences - 每个事件最多展开的实例数（防死循环）。
 */
export function expandEventFromICal(data, href, etag, rangeStart, rangeEnd, maxOccurrences) {
    let vcal;
    try {
        vcal = new ICAL.Component(ICAL.parse(data));
    }
    catch {
        return [];
    }
    const master = masterVevent(vcal);
    if (master === null)
        return [];
    const base = veventToEvent(master, href, etag);
    if (base === null)
        return [];
    // 收集 RECURRENCE-ID -> 覆盖 VEVENT，展开时按原实例时间替换。
    const overrides = new Map();
    for (const candidate of vcal.getAllSubcomponents('vevent')) {
        if (candidate === master)
            continue;
        const recurrenceId = timePropertyValue(candidate, 'recurrence-id');
        if (recurrenceId === undefined)
            continue;
        overrides.set(recurrenceKey(recurrenceId), candidate);
    }
    if (!master.hasProperty('rrule') && !master.hasProperty('rdate')) {
        return [{ ...base, isOccurrence: false }];
    }
    const dtstart = timePropertyValue(master, 'dtstart');
    if (dtstart === undefined)
        return [{ ...base, isOccurrence: false }];
    const rangeStartMs = isoToEpochMs(rangeStart);
    const rangeEndMs = isoToEpochMs(rangeEnd);
    const inRange = (event) => {
        const startMs = isoToEpochMs(event.start);
        return !Number.isNaN(startMs) && startMs >= rangeStartMs && startMs <= rangeEndMs;
    };
    const duration = veventDuration(master, dtstart);
    const expansion = new ICAL.RecurExpansion({ component: master, dtstart });
    const occurrences = [];
    const consumedOverrides = new Set();
    try {
        const totalIterationCap = Math.max(100000, maxOccurrences * 1000);
        let iterations = 0;
        while (occurrences.length < maxOccurrences) {
            iterations += 1;
            if (iterations > totalIterationCap)
                break;
            const next = expansion.next();
            if (next === null || next === undefined)
                break;
            const occMs = next.toUnixTime() * 1000;
            if (occMs > rangeEndMs)
                break;
            const key = recurrenceKey(next);
            const overrideVevent = overrides.get(key);
            if (overrideVevent !== undefined) {
                // 该次实例已被单独覆盖：只输出覆盖后的字段与时间（覆盖后移出窗口则不再出现）。
                consumedOverrides.add(key);
                const overrideEvent = buildOverrideEvent(base, overrideVevent);
                if (overrideEvent !== null && inRange(overrideEvent))
                    occurrences.push(overrideEvent);
                continue;
            }
            if (occMs < rangeStartMs)
                continue;
            occurrences.push(buildOccurrence(base, next, duration));
        }
    }
    catch {
        // 规则无法满足或迭代异常时，返回已成功展开的部分实例。
    }
    // EXDATE 已把原时间排除、或原时间在窗口外但覆盖后移入窗口：覆盖实例仍需单独返回。
    for (const [key, overrideVevent] of overrides) {
        if (consumedOverrides.has(key))
            continue;
        const overrideEvent = buildOverrideEvent(base, overrideVevent);
        if (overrideEvent === null || !inRange(overrideEvent))
            continue;
        if (occurrences.length >= maxOccurrences)
            break;
        occurrences.push(overrideEvent);
    }
    return occurrences;
}
/** 生成随机 iCal UID（带 host 后缀，形如 UUID）。 */
export function generateUid() {
    return randomUUID();
}
/** 把字段生成一段完整 iCal 文本（单个 VEVENT）。 */
export function buildICalString(fields) {
    const vcal = new ICAL.Component('vcalendar');
    const vevent = new ICAL.Component('vevent');
    vevent.addPropertyWithValue('uid', fields.icalUid ?? generateUid());
    vevent.addPropertyWithValue('summary', fields.summary);
    const start = parseTime(fields.start, fields.allDay === true || isDateOnly(fields.start));
    const end = parseTime(fields.end, fields.allDay === true || isDateOnly(fields.end));
    vevent.addPropertyWithValue('dtstart', start);
    vevent.addPropertyWithValue('dtend', end);
    if (fields.description !== undefined && fields.description !== '') {
        vevent.addPropertyWithValue('description', fields.description);
    }
    if (fields.location !== undefined && fields.location !== '') {
        vevent.addPropertyWithValue('location', fields.location);
    }
    if (fields.rrule !== undefined && fields.rrule !== '') {
        const rule = fields.rrule.trim();
        if (!/^FREQ=/i.test(rule)) {
            throw new Error('rrule 格式无效：' + fields.rrule + '（应为 RFC 5545 RRULE，如 FREQ=WEEKLY;COUNT=4）');
        }
        try {
            vevent.addPropertyWithValue('rrule', ICAL.Recur.fromString(rule));
        }
        catch (error) {
            throw new Error('rrule 格式无效：' + fields.rrule);
        }
    }
    vcal.addSubcomponent(vevent);
    return vcal.toString();
}
/** 把 ICAL.Time 转成全天 DATE 值（保留原年月日）。 */
function toDateValue(time) {
    return ICAL.Time.fromDateString(pad(time.year) + '-' + pad(time.month) + '-' + pad(time.day));
}
/** 把 ICAL.Time 转成 UTC 零点的定时值（allDay 由 true 改 false 时使用）。 */
function toMidnightUtc(time) {
    return ICAL.Time.fromDateTimeString(pad(time.year) + '-' + pad(time.month) + '-' + pad(time.day) + 'T00:00:00Z');
}
/** 显式改 allDay 时同步 DTSTART/DTEND 的 DATE / DATE-TIME 表示。 */
function convertTimeForAllDay(time, allDay) {
    if (allDay)
        return time.isDate === true ? time : toDateValue(time);
    return time.isDate === true ? toMidnightUtc(time) : time;
}
/** 在既有 VEVENT 上覆盖开始/结束时间（含 allDay 表示转换），未显式给出的时间不动。 */
function applyEventTimes(vevent, changes) {
    const existingStart = timePropertyValue(vevent, 'dtstart');
    const existingEnd = timePropertyValue(vevent, 'dtend');
    const allDay = changes.allDay ?? (existingStart?.isDate === true);
    let start;
    if (changes.start !== undefined) {
        start = parseTime(changes.start, allDay || isDateOnly(changes.start));
    }
    else if (existingStart !== undefined && changes.allDay !== undefined) {
        start = convertTimeForAllDay(existingStart, allDay);
    }
    if (start !== undefined)
        vevent.updatePropertyWithValue('dtstart', start);
    let end;
    if (changes.end !== undefined) {
        end = parseTime(changes.end, allDay || isDateOnly(changes.end));
    }
    else if (existingEnd !== undefined && changes.allDay !== undefined) {
        end = convertTimeForAllDay(existingEnd, allDay);
    }
    if (end !== undefined) {
        vevent.updatePropertyWithValue('dtend', end);
        // DTEND 与 DURATION 互斥；显式给结束时间时移除原 DURATION，避免双份定义。
        vevent.removeProperty('duration');
    }
}
/**
 * 在原 iCal 文本上做字段级覆盖：保留原 VCALENDAR / VEVENT 的全部属性
 * （ATTENDEE、ORGANIZER、EXDATE、STATUS、CATEGORIES、VALARM 及未知属性等），
 * 只替换 changes 里显式给出的字段；原文本缺少 RFC 5545 必需属性时补齐
 * （VCALENDAR 的 VERSION/PRODID，VEVENT 的 UID/DTSTAMP）。
 * 解析失败或没有 VEVENT 时返回 null，由调用方回退到整条重建。
 * @param data - 原 iCal 文本（通常来自服务器的 calendar-data）。
 * @param changes - 需要覆盖的字段；未提供的字段保留原值。
 */
export function updateICalString(data, changes) {
    let vcal;
    try {
        vcal = new ICAL.Component(ICAL.parse(data));
    }
    catch {
        return null;
    }
    const vevent = masterVevent(vcal);
    if (vevent === null)
        return null;
    if (!vcal.hasProperty('version'))
        vcal.addPropertyWithValue('version', '2.0');
    if (!vcal.hasProperty('prodid'))
        vcal.addPropertyWithValue('prodid', '-//dsh-calendar//EN');
    if (!vevent.hasProperty('uid')) {
        vevent.addPropertyWithValue('uid', changes.icalUid ?? generateUid());
    }
    else if (changes.icalUid !== undefined) {
        vevent.updatePropertyWithValue('uid', changes.icalUid);
    }
    if (!vevent.hasProperty('dtstamp')) {
        vevent.addPropertyWithValue('dtstamp', ICAL.Time.fromJSDate(new Date(), true));
    }
    // 字段级覆盖：updatePropertyWithValue 保留原属性参数（如 ATTENDEE 的 CN/PARTSTAT）。
    if (changes.summary !== undefined)
        vevent.updatePropertyWithValue('summary', changes.summary);
    if (changes.description !== undefined)
        vevent.updatePropertyWithValue('description', changes.description);
    if (changes.location !== undefined)
        vevent.updatePropertyWithValue('location', changes.location);
    if (changes.rrule !== undefined) {
        const rule = changes.rrule.trim();
        if (rule === '') {
            vevent.removeProperty('rrule');
        }
        else {
            if (!/^FREQ=/i.test(rule)) {
                throw new Error('rrule 格式无效：' + changes.rrule + '（应为 RFC 5545 RRULE，如 FREQ=WEEKLY;COUNT=4）');
            }
            try {
                vevent.updatePropertyWithValue('rrule', ICAL.Recur.fromString(rule));
            }
            catch (error) {
                throw new Error('rrule 格式无效：' + changes.rrule);
            }
        }
    }
    if (changes.start !== undefined || changes.end !== undefined || changes.allDay !== undefined) {
        applyEventTimes(vevent, changes);
    }
    return vcal.toString();
}
/** 把 ISO 字符串解析成 ICAL.Time（全天 YYYY-MM-DD 或转 UTC 的定时时间）。 */
function parseTime(value, allDay) {
    if (allDay || isDateOnly(value)) {
        return ICAL.Time.fromDateString(value);
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new Error('时间格式不合法：' + value + '（应为 ISO 8601，含时区偏移，如 2025-01-01T09:00:00+08:00）');
    }
    // 用 UTC 瞬间构造，序列化为带 Z 的稳定形式，避免时区歧义。
    return ICAL.Time.fromJSDate(date, true);
}
