/**
 * dsh-calendar 的网页端后端：给设置页里的日历面板提供数据与写操作。
 *
 * 与 dsh-email 的设置路由同一套安全模型，理由也一样：这个路由能读用户的
 * 全部日程、还能替用户改/删日程，而宿主 webserver 有可能绑定在 0.0.0.0。
 * 四道门缺一不可 ——
 *   1. remoteAddress 必须是回环地址（局域网不可达）；
 *   2. Host 头必须是 localhost 名（挡 DNS rebinding：恶意域名解析到 127.0.0.1）；
 *   3. 写操作要求 application/json（跨源页面无法用简单请求绕过预检）+
 *      Origin/Sec-Fetch-Site 校验（挡 Origin: null 的沙箱 iframe）；
 *   4. 响应里永不回显凭证（服务对象只在闭包里，事件对象本来也不含密码）。
 *
 * 面板要的是「事件列表 + 增删改」，所以这一层不做自己的状态：每次请求都问
 * CalDAV 服务器要，服务器就是唯一真相。缓存的只有 service 实例（token 复用）。
 */
import { type CalendarConfig } from './config.js';
import type { CalendarEvent } from './ical.js';
/** 面板与浏览器说话的同源路由。 */
export declare const SETTINGS_ROUTE = "/_dsh/dsh-calendar/settings";
/** Host 头裁决：undefined = 放行，否则给出拒绝原因。 */
export declare function hostVerdict(host: unknown): string | undefined;
/** 写操作裁决：undefined = 放行，否则给出状态码与原因。 */
export declare function postVerdict(headers: Record<string, unknown>): {
    status: number;
    message: string;
} | undefined;
/** 面板需要的服务面；测试里可以塞假的进来。 */
export interface CalendarServiceLike {
    list(start: string, end: string, options?: unknown, signal?: AbortSignal): Promise<CalendarEvent[]>;
    create(fields: unknown, signal?: AbortSignal): Promise<CalendarEvent>;
    update(uid: string, changes: unknown, signal?: AbortSignal): Promise<CalendarEvent>;
    delete(uid: string, signal?: AbortSignal): Promise<{
        uid: string;
        href: string;
    }>;
}
export interface CalendarSettingsBackendOptions {
    config?: CalendarConfig | null;
    /** 测试用：替换真实 CalDAV 客户端。 */
    serviceFactory?: () => CalendarServiceLike;
    env?: NodeJS.ProcessEnv;
}
/**
 * 浏览器端后端：把面板的四个动作翻译成 CalDAV 调用。
 *
 * 配置缺失不抛错：面板需要它来渲染「还没配置」的引导态，所以 status 动作
 * 会回一个 configured:false，而不是让页面拿到 500。
 */
export declare class CalendarSettingsBackend {
    private readonly options;
    private cachedKey;
    private cachedService;
    constructor(options?: CalendarSettingsBackendOptions);
    /** 惰性解析配置；凭据/端点变化即重建（闭包内比较，不落盘不记日志）。 */
    private service;
    /** 配置状态：只回面板要用的非敏感字段。 */
    status(): Record<string, unknown>;
    private responseJson;
    /** 路由入口。GET = 读状态，POST = 动作（list/create/update/delete）。 */
    handle(req: any, res: any): Promise<void>;
    /** 动作分发。每个动作自己校验参数，错误信息面向用户（中文，面板直接显示）。 */
    private dispatch;
}
/**
 * 把设置页里的日历面板挂到宿主 webserver 上。
 * 与 dsh-email 相同：ctx.inject(['webServer']) + effect 注册，插件卸载即摘掉路由。
 */
export declare function installCalendarSettingsWeb(ctx: any, backend: CalendarSettingsBackend): void;
