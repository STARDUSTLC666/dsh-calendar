/**
 * iCal 解析与生成：用 ical.js 处理 VEVENT 的字段提取与 round-trip 序列化。
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
function timePropertyValue(vevent, name) {
    const value = vevent.getFirstPropertyValue(name);
    return value instanceof ICAL.Time ? value : undefined;
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
    const vevent = vcal.getFirstSubcomponent('vevent');
    if (vevent === null)
        return null;
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
    vcal.addSubcomponent(vevent);
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
