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
import { type CalendarSettingsValue } from './settings.js';
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
/** 面板用于读写 settings 命名空间的最小面（index.ts 在 settings 服务到位后接上）。 */
export interface CalendarSettingsFace {
    read(): Record<string, unknown>;
    descriptor(): {
        revision?: number;
        user?: Record<string, unknown>;
    } | undefined;
    replace(value: Record<string, unknown>, revision: number): Promise<void>;
}
/** 面板要读写的连接字段。空串 = 保持不变，null = 明确清除。 */
export declare const CONNECTION_KEYS: readonly ["provider", "caldavUrl", "username", "password", "host", "user", "calendar", "calendarId", "authMethod", "clientId", "clientSecret", "refreshToken", "tokenUrl", "proxyUrl"];
export interface CalendarSettingsBackendOptions {
    /** 静态配置，或一个 getter（面板保存后工具应当立刻用上新配置）。 */
    config?: CalendarConfig | null | (() => CalendarConfig);
    /** 测试用：替换真实 CalDAV 客户端（收到的是当前/拟议配置）。 */
    serviceFactory?: (config: CalendarConfig) => CalendarServiceLike;
    /** 测试用：替换「保存前的连接测试」。 */
    probeFactory?: (config: CalendarConfig) => Promise<{
        count: number;
        sample: string[];
    }>;
    env?: NodeJS.ProcessEnv;
    settings?: CalendarSettingsFace;
    /** 宿主 ctx：用来懒接入 settings 服务（不赌子 fiber 的时序）。 */
    ctx?: any;
    /** settings 值变化时回调（index.ts 用它把新配置喂给工具层）。 */
    onSettings?: (value: Record<string, unknown>) => void;
    /** 注册命名空间时的 base 层（来自 cordis.patch.yml 的配置）。 */
    settingsBase?: Partial<CalendarSettingsValue>;
}
/** 把「已存值 + 草稿」合并成要落盘的一版：草稿里缺席的键保留原值。 */
export declare function mergeConnection(stored: Record<string, unknown>, draft: Record<string, unknown>): Record<string, unknown>;
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
    private settings;
    constructor(options?: CalendarSettingsBackendOptions);
    /** settings 服务到位后接上（传 undefined 摘掉）—— 面板据此从只读变成可保存。 */
    attachSettings(face: CalendarSettingsFace | undefined): void;
    /**
     * 懒接入宿主 settings。为什么不只用 ctx.inject(['settings'], cb)：那条路依赖子 fiber
     * 的时序，插件被重复 apply、或命名空间已被兄弟实例注册时它会静默失效，面板就永远停在
     * 「不能保存」。这里每个请求前试一次 ctx.get('settings')，拿到就接上，代价是一次属性读取。
     *
     * 命名空间已被注册（重复 apply 的第二个实例）不当作失败：直接搭在既有注册上 ——
     * describe() 给出的描述符里就带着当前值，写则走 provider 的 replace，功能完全一样。
     */
    private ensureSettings;
    /**
     * 当前生效配置：patch 行配置（或 getter 现取的那份）+ 面板写进 settings 的字段。
     *
     * 面板自己也要合并一遍，而不是只依赖传入的 getter —— 否则「面板显示的连接」
     * 与「工具实际用的连接」就成了两份来源，保存成功却看到未配置的怪象。
     */
    private configOf;
    /** 惰性解析配置；凭据/端点变化即重建（闭包内比较，不落盘不记日志）。 */
    private service;
    /**
     * 连接摘要：面板要的每一个非敏感字段都在这里，密钥只回「有没有」。
     * 未配置时 configured:false + reason（resolveConfig 的中文指引），面板据此渲染引导态。
     */
    connection(): Record<string, unknown>;
    /** 兼容旧动作名：status 就是连接摘要。 */
    status(): Record<string, unknown>;
    /**
     * 草稿 → 拟议配置：先与已存值合并（草稿缺席的键保留原值），再叠加到当前生效配置之上。
     * 连接测试和保存都走这条路，所以「测试通过」与「保存后能用」看到的是同一份配置。
     */
    private proposed;
    /** 真连一次：拿拟议配置列一下未来 30 天，能列出来就算通。 */
    private probe;
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
