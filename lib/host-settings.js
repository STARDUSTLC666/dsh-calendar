/**
 * 宿主 settings 服务的两代接口，以及「老 settings.yaml 里这一段」的一次性搬迁。
 *
 * 为什么要搬：0.1.7 把 settings.yaml 改名成 settings.yaml.imported，并按 **entry id**
 * 把各段写回 profile。官方认识的那些段有映射表，插件自己的段（`dsh-calendar`）没有 ——
 * 我们的行 id 是 `calendar`，宿主找不到同名 entry，只会留一条 warn，值就搁在改名后的
 * 文件里。所以升级后第一次启动时，由插件自己把这一段搬进本 entry 的配置。
 *
 * 搬迁守三条规矩（与 dsh-email / dsh-rss 同一套）：
 *   1. 只补当前配置里**没有**的键，profile 里已写过的值永远优先；
 *   2. 只搬一次，完成标记 `legacySettingsImported` 与值写在同一处；
 *   3. 读不到/写不进都不抛：原文件原样保留，面板退化成兜底存储。
 *
 * @module dsh-calendar/host-settings
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';
/** 是不是普通对象（数组与 null 都不算）。 */
function plain(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
/** 只挑出「当前配置里缺席」的键；嵌套对象逐层比。 */
function missing(legacy, current) {
    const patch = {};
    for (const [key, value] of Object.entries(legacy)) {
        if (current[key] === undefined)
            patch[key] = value;
        else if (plain(value) && plain(current[key])) {
            const nested = missing(value, current[key]);
            if (Object.keys(nested).length)
                patch[key] = nested;
        }
    }
    return patch;
}
/**
 * 取宿主 settings 服务：优先 `ctx.get`（不必声明 inject），退回属性访问。
 * 两边都拿不到就返回 undefined —— 调用方据此退化，而不是抛。
 */
export function settingsProviderOf(ctx) {
    let provider;
    try {
        provider = typeof ctx?.get === 'function' ? ctx.get('settings') : undefined;
    }
    catch {
        provider = undefined;
    }
    if (provider === undefined || provider === null) {
        try {
            provider = ctx?.settings;
        }
        catch {
            provider = undefined;
        }
    }
    return provider === undefined || provider === null ? undefined : provider;
}
/** 0.1.6 及更早：插件在加载阶段注册自己的命名空间。 */
export function isLegacyProvider(provider) {
    return provider !== undefined && typeof provider.register === 'function' && typeof provider.replace === 'function';
}
/**
 * 0.1.7 起：宿主把 entry 的 Config 投影成表单，插件不再注册，
 * 读写都按 entry id 走（describe / update / replace）。
 */
export function isFormsProvider(provider) {
    return provider !== undefined && typeof provider.register !== 'function'
        && typeof provider.describe === 'function' && typeof provider.replace === 'function'
        && typeof provider.update === 'function';
}
/** 本实例在 profile 里的 entry id；拿不到时用组合包补丁里的行 id。 */
export function entryIdOf(ctx, fallback) {
    const id = ctx?.fiber?.entry?.options?.id;
    return typeof id === 'string' && id !== '' ? id : fallback;
}
/** 解析 DSH_HOME（与官方 dsh-home-paths 同规则：DSH_HOME 优先，否则 ~/.dsh）。 */
export function dshHome(home) {
    let base = home ?? (process.env.DSH_HOME?.trim() || join(homedir(), '.dsh'));
    if (base === '~')
        base = homedir();
    else if (base.startsWith('~/') || base.startsWith('~\\'))
        base = join(homedir(), base.slice(2));
    return base;
}
/**
 * 把老 settings.yaml 里属于本插件的那一段搬进当前 entry 的配置。
 * @returns 真的写了一次才回 true（调用方据此提示用户重启或直接热生效）。
 */
export async function importLegacySettings(ctx, config, namespace, entryId, fields, home) {
    const provider = settingsProviderOf(ctx);
    if (isLegacyProvider(provider) || config.legacySettingsImported === true)
        return false;
    if (typeof provider?.update !== 'function')
        return false;
    // 老命名空间是全局的：别把凭据复制进同插件的自定义实例。
    if (entryIdOf(ctx, entryId) !== entryId)
        return false;
    let document;
    for (const file of ['settings.yaml.imported', 'settings.yaml']) {
        try {
            document = parse(readFileSync(resolve(dshHome(home), file), 'utf8'));
            break;
        }
        catch (error) {
            if (error?.code !== 'ENOENT')
                throw new Error('Cannot read legacy settings; original file preserved');
        }
    }
    if (!plain(document) || !plain(document[namespace]))
        return false;
    const legacySection = document[namespace];
    const section = Object.fromEntries(fields
        .filter(key => Object.hasOwn(legacySection, key))
        .map(key => [key, legacySection[key]]));
    if (Object.keys(section).length === 0)
        return false;
    await provider.update(entryId, { ...missing(section, { ...config }), legacySettingsImported: true });
    return true;
}
/** 推迟到应用就绪后再搬：那时 entry 与 settings 服务都已挂载。 */
export function installLegacySettingsImport(ctx, config, namespace, entryId, fields) {
    if (isLegacyProvider(settingsProviderOf(ctx)) || typeof ctx?.inject !== 'function')
        return;
    ctx.inject(['appReady'], (readyCtx) => {
        readyCtx.effect(() => readyCtx.appReady.onReady(() => {
            void importLegacySettings(ctx, config, namespace, entryId, fields).catch(() => {
                ctx.logger?.warn?.(namespace + ': 老 settings.yaml 里的日历配置未能搬入，原文件已原样保留。');
            });
        }));
    });
}
