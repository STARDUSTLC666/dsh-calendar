/**
 * iCal 解析与生成：用 ical.js 处理 VEVENT 的字段提取、round-trip 序列化与重复展开。
 * 输入输出统一 ISO 8601（含时区偏移）：全天事件用 YYYY-MM-DD，定时事件转 UTC（Z）。
 *
 * @module dsh-calendar/ical
 */
/** 一个暴露给模型的日历事件（或重复系列的一个展开实例）。 */
export interface CalendarEvent {
    /** 稳定标识（CalDAV href），calendar_update / calendar_delete 用它。 */
    uid: string;
    /** 与 uid 相同的完整对象 URL，便于调试。 */
    href: string;
    /** iCal 里的 UID 原始值（可能为空）。 */
    icalUid?: string;
    /** 服务器 ETag（内部用于并发安全更新）。 */
    etag?: string;
    summary: string;
    description?: string;
    location?: string;
    /** 开始时间，ISO 8601（定时事件为 UTC，全天为 YYYY-MM-DD）。 */
    start: string;
    /** 结束时间，同上；无 DTEND/DURATION 时等于 start。 */
    end: string;
    allDay: boolean;
    /** 重复规则原样返回（未展开时）；展开后的实例不带此字段。 */
    rrule?: string;
    /** 是否为重复系列展开出的实例；非重复事件为 false。 */
    isOccurrence?: boolean;
    /** 系列原开始时间（仅 isOccurrence 为 true 的实例存在）。 */
    seriesStart?: string;
    status?: string;
    url?: string;
    created?: string;
    lastModified?: string;
}
/** 新建 / 更新事件时需要的字段。 */
export interface EventFields {
    summary: string;
    start: string;
    end: string;
    description?: string;
    location?: string;
    allDay?: boolean;
    /** 重复规则（RFC 5545 RRULE 语法），如 FREQ=WEEKLY;COUNT=4。 */
    rrule?: string;
    /** iCal UID；创建时缺省则自动生成，更新时用于保留原 UID。 */
    icalUid?: string;
}
/**
 * 解析一段 iCal 文本中的首个 VEVENT 为 CalendarEvent；解析失败返回 null。
 * @param data - iCal 文本（通常来自服务器的 calendar-data）。
 * @param href - CalDAV 对象 href，作为稳定 uid。
 * @param etag - 服务器 ETag。
 */
export declare function parseEventFromICal(data: string, href: string, etag?: string): CalendarEvent | null;
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
export declare function expandEventFromICal(data: string, href: string, etag: string | undefined, rangeStart: string, rangeEnd: string, maxOccurrences: number): CalendarEvent[];
/** 生成随机 iCal UID（带 host 后缀，形如 UUID）。 */
export declare function generateUid(): string;
/** 把字段生成一段完整 iCal 文本（单个 VEVENT）。 */
export declare function buildICalString(fields: EventFields): string;
