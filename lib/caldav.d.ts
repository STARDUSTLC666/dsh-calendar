/**
 * CalDAV 访问层：用 tsdav 客户端对单个日历集合做 查询/新建/更新/删除。
 * 直接用集合 URL 操作（createDAVClient 不带 defaultAccountType，跳过服务发现）。
 *
 * @module dsh-calendar/caldav
 */
import type { ResolvedConfig } from './config.js';
import { type CalendarEvent, type EventFields } from './ical.js';
/** CalDAV 操作错误：带中文指引。 */
export declare class CalDAVError extends Error {
    readonly status?: number;
    constructor(message: string, status?: number);
}
/** 对单个日历集合的封装。 */
export declare class CalendarService {
    private readonly config;
    private readonly collectionUrl;
    private clientPromise?;
    constructor(config: ResolvedConfig);
    private client;
    private calendar;
    /** 列出某时间段内的事件（不展开 RRULE）。 */
    list(startIso: string, endIso: string): Promise<CalendarEvent[]>;
    /** 列出全部事件（客户端过滤用）。 */
    all(): Promise<CalendarEvent[]>;
    private toEvents;
    /** 按 uid（href）找到服务器对象（含 etag 与原始 data）。 */
    private findObject;
    /** 新建事件，返回带 href/uid 的事件。 */
    create(fields: EventFields): Promise<CalendarEvent>;
    /** 按 uid 更新事件；未提供的字段保留原值。 */
    update(uid: string, changes: Partial<EventFields>): Promise<CalendarEvent>;
    /** 按 uid 删除事件。 */
    delete(uid: string): Promise<{
        uid: string;
        href: string;
    }>;
}
