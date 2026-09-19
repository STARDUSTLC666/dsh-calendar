/**
 * dsh-calendar —— CalDAV 日历工具插件（node 半身，配置走 cordis.patch.yml）。
 *
 * 插件导出 apply(ctx, config)：把五个面向模型的工具（calendar_list / calendar_create /
 * calendar_update / calendar_delete / calendar_search）注册进宿主进程的工具注册表。
 * 配置缺失时插件照常加载，工具在 execute 时才抛出带中文指引的错误。
 *
 * @module dsh-calendar
 */
import { resolveConfig } from './config.js';
import { buildCalendarTools } from './tools.js';
import { CalendarSettingsSchema, SETTINGS_NAMESPACE, toCalendarConfig, toSettingsBase, validateSettingsValue } from './settings.js';
import { CalendarSettingsBackend, installCalendarSettingsWeb, settingsFaceOf } from './web.js';
/** cordis 服务注入：apply 里要用 ctx.tools，必须显式声明注入，否则宿主会抛 cannot get property without inject。 */
export const name = 'calendar';
export const inject = ['tools'];
/**
 * 同步注册 settings 命名空间并返回读写面。
 *
 * 时机是关键：宿主的 register 内部会 `ctx.effect(...)`，必须在插件加载的**同步阶段**调用 ——
 * 在请求处理里注册会失败，而失败一旦被吞掉，就会在保存时才暴露成「namespace is not registered」。
 * 拿不到服务 / 注册失败都只 warn：面板退化为只读，配置仍可写在 cordis.patch.yml。
 */
export function attachSettings(ctx, cfg) {
    let provider;
    try {
        provider = typeof ctx.get === 'function' ? ctx.get('settings') : undefined;
    }
    catch (error) {
        provider = undefined;
    }
    if (provider === undefined || provider === null) {
        try {
            provider = ctx.settings;
        }
        catch (error) {
            provider = undefined;
        }
    }
    if (provider === undefined || provider === null || typeof provider.register !== 'function' || typeof provider.replace !== 'function') {
        console.warn('dsh-calendar: 没有 settings 服务，面板只能只读（配置仍可写在 profile 的 cordis.patch.yml）');
        return undefined;
    }
    let scope;
    try {
        scope = provider.register(SETTINGS_NAMESPACE, CalendarSettingsSchema, {
            base: toSettingsBase(cfg),
            applies: 'live',
            validate: (value) => validateSettingsValue(value),
        });
    }
    catch (error) {
        // 最常见的是「已被注册」（重复 apply 的第二个实例）：不注册，改搭既有注册的车。
        console.warn('dsh-calendar: settings 命名空间注册失败，改为搭既有注册：' + (error instanceof Error ? error.message : String(error)));
    }
    return settingsFaceOf(provider, scope);
}
/**
 * 插件入口：惰性解析配置并注册五个日历工具。
 * @param ctx - 宿主上下文（至少含 tools.register）。
 * @param config - 插件配置（可缺省）。
 */
export function apply(ctx, config) {
    const cfg = config ?? {};
    try {
        resolveConfig(cfg);
    }
    catch (error) {
        console.warn('dsh-calendar: ' + (error instanceof Error ? error.message : String(error)));
    }
    // 面板把连接配置写进 settings 之后，工具的下一次调用就该用新配置 —— 所以工具与面板
    // 拿到的是一个 getter，而不是启动时那一份静态对象。
    const settingsFace = attachSettings(ctx, cfg);
    const configOf = () => ({ ...cfg, ...toCalendarConfig(settingsFace?.read(), null) });
    const disposers = [];
    for (const definition of buildCalendarTools(configOf)) {
        disposers.push(ctx.tools.register(definition));
    }
    // 面板路由挂上即用：settings 服务由 backend 在第一个请求上懒接入（见 web.ts 的
    // ensureSettings），所以这里不依赖任何子 fiber 的时序，也不会因为重复 apply 而失效。
    const backend = new CalendarSettingsBackend({
        config: configOf,
        ctx,
        settings: settingsFace,
        settingsBase: toSettingsBase(cfg),
    });
    try {
        installCalendarSettingsWeb(ctx, backend);
    }
    catch (error) {
        console.warn('dsh-calendar: 面板路由未挂载：' + (error instanceof Error ? error.message : String(error)));
    }
    if (typeof ctx.on === 'function') {
        ctx.on('dispose', () => {
            for (const dispose of disposers)
                dispose();
        });
    }
}
export * from './parameters.js';
export * from './config.js';
export * from './ical.js';
export * from './caldav.js';
export * from './tools.js';
export * from './web.js';
export * from './settings.js';
