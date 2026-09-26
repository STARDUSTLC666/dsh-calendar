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
import { CalendarSettingsBackend, installCalendarSettingsWeb, CONNECTION_KEYS, hostFormsFaceOf, settingsFaceOf } from './web.js';
import { connectionFile, readConnectionFile, writeConnectionFile } from './store.js';
import { Config as ConfigSchema, liveConfig } from './host-config.js';
import { entryIdOf, installLegacySettingsImport, isFormsProvider, isLegacyProvider, settingsProviderOf } from './host-settings.js';
/** 宿主用 entry 的 Config 生成设置表单：0.1.7 起这就是「注册设置项」的方式。 */
export const Config = ConfigSchema;
/** cordis 服务注入：apply 里要用 ctx.tools，必须显式声明注入，否则宿主会抛 cannot get property without inject。 */
export const name = 'calendar';
export const inject = ['tools', 'settings'];
/** 组合包补丁里那一行的 id；拿不到 fiber 时用它兜底。 */
const ENTRY_ID = 'calendar';
/** 老 settings.yaml 的 dsh-calendar 段里要搬进 profile 的字段（与面板读写的连接字段同一份）。 */
const CONNECTION_FIELDS = [...CONNECTION_KEYS];
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
export function attachSettings(ctx, cfg) {
    const provider = settingsProviderOf(ctx);
    if (isFormsProvider(provider)) {
        const entryId = entryIdOf(ctx, ENTRY_ID);
        // replace 退路必须保留一次性搬迁标记，避免下次启动重搬老 settings.yaml。
        return {
            ns: entryId,
            face: hostFormsFaceOf(provider, entryId, () => toSettingsBase(cfg), () => cfg.legacySettingsImported === undefined
                ? {}
                : { legacySettingsImported: cfg.legacySettingsImported }),
        };
    }
    const usable = isLegacyProvider(provider);
    if (usable !== true) {
        const reason = provider === undefined ? '插件未注入宿主 settings 服务' : '宿主 settings 服务既不能注册也不提供表单';
        console.warn('dsh-calendar: ' + reason + '，连接配置改存插件自己的文件：' + connectionFile());
        return { face: fileSettingsFace(), reason, ns: SETTINGS_NAMESPACE };
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
        return { face: settingsFaceOf(provider, undefined), ns: SETTINGS_NAMESPACE };
    }
    if (failure !== undefined) {
        // 注册失败且没人注册过：写进去也会报 namespace is not registered，直接换兜底文件。
        const reason = 'settings 命名空间注册失败：' + failure;
        console.warn('dsh-calendar: ' + reason + '，连接配置改存插件自己的文件：' + connectionFile());
        return { face: fileSettingsFace(), reason, ns: SETTINGS_NAMESPACE };
    }
    return { face: settingsFaceOf(provider, scope), ns: SETTINGS_NAMESPACE };
}
/**
 * 插件入口：惰性解析配置并注册五个日历工具。
 * @param ctx - 宿主上下文（至少含 tools.register）。
 * @param config - 插件配置（可缺省）。
 */
export function apply(ctx, config) {
    // 0.1.7 的宿主把 volatile 字段交成引用；摊平之后老宿主的字面量配置走同一条路。
    const cfg = liveConfig(config ?? {});
    try {
        resolveConfig(cfg);
    }
    catch (error) {
        console.warn('dsh-calendar: ' + (error instanceof Error ? error.message : String(error)));
    }
    // 老 settings.yaml 里的 dsh-calendar 段搬进本 entry（只补空缺、只搬一次）。
    installLegacySettingsImport(ctx, cfg, SETTINGS_NAMESPACE, ENTRY_ID, CONNECTION_FIELDS);
    // 面板由本插件自己渲染：告诉宿主别再按 schema 自动生成一页。
    // 子作用域负责自动清理页面策略；settings 已在插件依赖中声明，
    // 工具配置和自带面板都使用同一个宿主设置服务。
    if (typeof ctx.inject === 'function') {
        try {
            ctx.inject(['settings'], (settingsCtx) => {
                if (typeof settingsCtx?.settings?.configure !== 'function')
                    return;
                settingsCtx.effect(() => settingsCtx.settings.configure({ auto: false }, ctx.fiber));
            });
        }
        catch (error) {
            console.warn('dsh-calendar: 设置页策略未登记：' + (error instanceof Error ? error.message : String(error)));
        }
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
        settingsNs: attached.ns,
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
export * from './host-settings.js';
export { liveConfig } from './host-config.js';
