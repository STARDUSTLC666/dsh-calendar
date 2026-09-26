/**
 * dsh-calendar —— CalDAV 日历工具插件（node 半身，配置走 cordis.patch.yml）。
 *
 * 插件导出 apply(ctx, config)：把五个面向模型的工具（calendar_list / calendar_create /
 * calendar_update / calendar_delete / calendar_search）注册进宿主进程的工具注册表。
 * 配置缺失时插件照常加载，工具在 execute 时才抛出带中文指引的错误。
 *
 * @module dsh-calendar
 */
import { type CalendarConfig } from './config.js';
import { type CalendarToolDefinition } from './tools.js';
import { type CalendarSettingsFace } from './web.js';
/** 宿主用 entry 的 Config 生成设置表单：0.1.7 起这就是「注册设置项」的方式。 */
export declare const Config: import("@deepseek-ai/schemastery").default;
export type Config = CalendarConfig;
/** cordis 服务注入：apply 里要用 ctx.tools，必须显式声明注入，否则宿主会抛 cannot get property without inject。 */
export declare const name = "calendar";
export declare const inject: string[];
/** 插件所需的最小 ctx 面（社区插件不依赖宿主内部类型）。 */
export interface CalendarPluginContext {
    tools: {
        register(definition: CalendarToolDefinition): () => void;
    };
    on?(event: string, listener: () => void): () => void;
    /** 设置页面板需要挂路由；隔离环境（测试/headless）可以没有。 */
    inject?(services: string[], callback: (ctx: any) => void): void;
    /** 0.1.7 的宿主表单按 entry id 寻址，id 从 fiber 上读。 */
    fiber?: {
        entry?: {
            options?: {
                id?: string;
            };
        };
    };
    /** settings 服务：能拿到就用，拿不到就退化（见 attachSettings）。 */
    get?(service: string): any;
    settings?: any;
    logger?: {
        warn?(message: string): void;
    };
}
/**
 * 同步注册 settings 命名空间并返回读写面。
 *
 * 时机是关键：宿主的 register 内部会 `ctx.effect(...)`，必须在插件加载的**同步阶段**调用 ——
 * 在请求处理里注册会失败，而失败一旦被吞掉，就会在保存时才暴露成「namespace is not registered」。
 * 拿不到服务 / 注册失败都只 warn：面板退化为只读，配置仍可写在 cordis.patch.yml。
 */
/** 兜底：把连接配置存进插件自己的文件（宿主 settings 不可用/注册失败时）。 */
export declare function fileSettingsFace(file?: string): CalendarSettingsFace;
/**
 * 接上配置存储：0.1.7 的宿主表单 → 老宿主的 settings 命名空间 → 插件自己的兜底文件。
 *
 * 三代宿主三条路，每一条失败都往下退而不是抛：
 *   1. **0.1.7 起**：设置项就是 entry 的 Config（`.volatile()` 字段），宿主自己投影成表单，
 *      插件不再注册命名空间；读=投影活配置，写=按 entry id 逐字段 set/unset。
 *   2. **0.1.6 及更早**：在插件加载的**同步阶段**调 `settings.register`（宿主的 register
 *      内部会 `ctx.effect(...)`，在请求处理里注册会失败，而失败一旦被吞掉，就会在保存时
 *      才暴露成「namespace is not registered」）；注册失败但 describe() 里已有我们这一段，
 *      说明是重复 apply 的第二个实例，搭既有注册的车。
 *   3. 服务不在、或注册失败且没人注册过 → 用兜底文件。
 * 返回 reason 是为了让面板说清「为什么不是宿主设置」，而不是笼统一句「不可用」。
 * @returns 读写面、它在 describe() 里的 ns，以及退化原因（没退化就没有）。
 */
export declare function attachSettings(ctx: CalendarPluginContext, cfg: CalendarConfig): {
    face: CalendarSettingsFace;
    reason?: string;
    ns: string;
};
/**
 * 插件入口：惰性解析配置并注册五个日历工具。
 * @param ctx - 宿主上下文（至少含 tools.register）。
 * @param config - 插件配置（可缺省）。
 */
export declare function apply(ctx: CalendarPluginContext, config?: CalendarConfig | null): void;
export * from './parameters.js';
export * from './config.js';
export * from './ical.js';
export * from './caldav.js';
export * from './tools.js';
export * from './web.js';
export * from './settings.js';
export * from './store.js';
export * from './host-settings.js';
export { liveConfig } from './host-config.js';
