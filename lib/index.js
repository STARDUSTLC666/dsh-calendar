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
import { connectionFile, readConnectionFile, writeConnectionFile } from './store.js';
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
/** 兜底：把连接配置存进插件自己的文件（宿主 settings 不可用/注册失败时）。 */
export function fileSettingsFace(file = connectionFile()) {
    return {
        kind: 'file',
        read: () => readConnectionFile(file).value,
        descriptor: () => ({ revision: readConnectionFile(file).revision }),
        replace: async (value) => {
            const current = readConnectionFile(file);
            writeConnectionFile({ revision: current.revision + 1, value }, file);
        },
    };
}
/**
 * 接上配置存储：首选宿主 settings 命名空间，不行就退到插件自己的文件。
 *
 * 三步走，每一步失败都往下退而不是抛：
 *   1. 拿到 settings 服务 → 在**插件加载阶段**同步注册命名空间（宿主的 register 要活动作用域）；
 *   2. 注册失败但 describe() 里已有我们这个命名空间 → 搭既有注册的车（重复 apply 的第二个实例）；
 *   3. 服务不在、或注册失败且没人注册过 → 用兜底文件。
 * 返回 reason 是为了让面板说清「为什么不是宿主设置」，而不是笼统一句「不可用」。
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
    const usable = provider !== undefined && provider !== null && typeof provider.register === 'function' && typeof provider.replace === 'function';
    if (usable !== true) {
        const reason = '宿主没有提供 settings 服务';
        console.warn('dsh-calendar: ' + reason + '，连接配置改存插件自己的文件：' + connectionFile());
        return { face: fileSettingsFace(), reason };
    }
    let scope;
    let failure;
    try {
        scope = provider.register(SETTINGS_NAMESPACE, CalendarSettingsSchema, {
            base: toSettingsBase(cfg),
            applies: 'live',
            validate: (value) => validateSettingsValue(value),
        });
    }
    catch (error) {
        failure = error instanceof Error ? error.message : String(error);
    }
    const known = (typeof provider.describe === 'function' ? provider.describe() ?? [] : []).some((row) => row !== undefined && row !== null && row.ns === SETTINGS_NAMESPACE);
    if (failure !== undefined && known === true) {
        // 已被注册（重复 apply 的第二个实例）：不注册，搭既有注册的车。
        console.warn('dsh-calendar: settings 命名空间注册失败（' + failure + '），改为搭既有注册');
        return { face: settingsFaceOf(provider, undefined) };
    }
    if (failure !== undefined) {
        // 注册失败且没人注册过：写进去也会报 namespace is not registered，直接换兜底文件。
        const reason = 'settings 命名空间注册失败：' + failure;
        console.warn('dsh-calendar: ' + reason + '，连接配置改存插件自己的文件：' + connectionFile());
        return { face: fileSettingsFace(), reason };
    }
    return { face: settingsFaceOf(provider, scope) };
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
    const attached = attachSettings(ctx, cfg);
    const configOf = () => ({ ...cfg, ...toCalendarConfig(attached.face.read(), null) });
    const disposers = [];
    for (const definition of buildCalendarTools(configOf)) {
        disposers.push(ctx.tools.register(definition));
    }
    // 面板路由挂上即用：settings 服务由 backend 在第一个请求上懒接入（见 web.ts 的
    // ensureSettings），所以这里不依赖任何子 fiber 的时序，也不会因为重复 apply 而失效。
    const backend = new CalendarSettingsBackend({
        config: configOf,
        ctx,
        settings: attached.face,
        settingsBase: toSettingsBase(cfg),
        ...(attached.reason !== undefined ? { settingsReason: attached.reason } : {}),
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
export * from './store.js';
