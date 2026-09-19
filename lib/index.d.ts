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
 * 接上配置存储：首选宿主 settings 命名空间，不行就退到插件自己的文件。
 *
 * 三步走，每一步失败都往下退而不是抛：
 *   1. 拿到 settings 服务 → 在**插件加载阶段**同步注册命名空间（宿主的 register 要活动作用域）；
 *   2. 注册失败但 describe() 里已有我们这个命名空间 → 搭既有注册的车（重复 apply 的第二个实例）；
 *   3. 服务不在、或注册失败且没人注册过 → 用兜底文件。
 * 返回 reason 是为了让面板说清「为什么不是宿主设置」，而不是笼统一句「不可用」。
 */
export declare function attachSettings(ctx: CalendarPluginContext, cfg: CalendarConfig): {
    face: CalendarSettingsFace;
    reason?: string;
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
