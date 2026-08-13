/**
 * iCal 解析与生成：用 ical.js 处理 VEVENT 的字段提取与 round-trip 序列化。
 * 输入输出统一 ISO 8601（含时区偏移）：全天事件用 YYYY-MM-DD，定时事件转 UTC（Z）。
 *
 * @module dsh-calendar/ical
 */
/** 一个暴露给模型的日历事件。 */
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
    /** 重复规则原样返回，不展开（见 README 已知限制）。 */
    rrule?: string;
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
/** 生成随机 iCal UID（带 host 后缀，形如 UUID）。 */
export declare function generateUid(): string;
/** 把字段生成一段完整 iCal 文本（单个 VEVENT）。 */
export declare function buildICalString(fields: EventFields): string;
