/**
 * 日历插件配置解析：provider 预设 + 手填 URL，全部在调用时惰性解析。
 * 配置缺失绝不阻止插件加载，只在工具 execute 时抛出带中文指引的错误。
 *
 * @module dsh-calendar/config
 */
/** 预设端点常量。 */
export const GOOGLE_CALDAV_PREFIX = 'https://apidata.googleusercontent.com/caldav/v2/';
export const ICLOUD_CALDAV_URL = 'https://caldav.icloud.com';
export const NEXTCLOUD_PATH = '/remote.php/dav/calendars/';
/** 配置错误：带中文指引，模型和用户都能读。 */
export class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigError';
    }
}
const PROVIDERS = ['google', 'icloud', 'nextcloud', 'custom'];
function nonEmpty(value) {
    return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}
function trimTrailingSlash(value) {
    return value.replace(/\/+$/, '');
}
function normalizeProvider(value) {
    if (value === undefined || value === null || value === '')
        return 'custom';
    if (typeof value === 'string' && PROVIDERS.includes(value)) {
        return value;
    }
    throw new ConfigError('dsh-calendar 的 provider 取值不合法：只支持 google / icloud / nextcloud / custom。' +
        '请在 profile 的 cordis.patch.yml 覆盖 calendar 行的 provider 并重启。');
}
/**
 * 解析配置为可用的 caldavUrl + 凭证。配置缺失抛出 ConfigError（中文指引）。
 * @param config - 插件 config（可能 undefined）。
 * @param env - 环境变量来源（测试可注入）。
 */
export function resolveConfig(config, env = process.env) {
    const provider = normalizeProvider(config?.provider);
    const username = nonEmpty(config?.username);
    const password = nonEmpty(config?.password) ?? nonEmpty(env.DSH_CALENDAR_PASSWORD);
    if (username === undefined) {
        throw new ConfigError('dsh-calendar 未配置 username：请在 profile 的 cordis.patch.yml 覆盖 calendar 行的 config，' +
            '填上 CalDAV 账号（Google / iCloud 为账号邮箱）后重启。');
    }
    if (password === undefined) {
        throw new ConfigError('dsh-calendar 未配置密码：请设置环境变量 DSH_CALENDAR_PASSWORD，' +
            '或在 profile 的 cordis.patch.yml 覆盖 calendar 行的 password（Google / iCloud 请用应用专用密码）后重启。');
    }
    const caldavUrl = buildCaldavUrl(config ?? {}, provider);
    return { provider, caldavUrl, username, password, proxyUrl: nonEmpty(config?.proxyUrl) ?? '' };
}
/** 依据 provider 预设或手填字段拼出日历集合 URL。 */
export function buildCaldavUrl(config, provider) {
    const explicit = nonEmpty(config.caldavUrl);
    if (explicit !== undefined)
        return explicit;
    if (provider === 'google') {
        const calendarId = nonEmpty(config.calendarId);
        if (calendarId === undefined) {
            throw new ConfigError('dsh-calendar 的 provider=google 需要 calendarId（日历 ID，通常是你的邮箱地址）：' +
                '请在 profile 的 cordis.patch.yml 覆盖 calendar 行的 calendarId 并重启。');
        }
        return GOOGLE_CALDAV_PREFIX + encodeURIComponent(calendarId) + '/events';
    }
    if (provider === 'nextcloud') {
        const host = nonEmpty(config.host);
        const user = nonEmpty(config.user);
        const calendar = nonEmpty(config.calendar);
        if (host === undefined || user === undefined || calendar === undefined) {
            throw new ConfigError('dsh-calendar 的 provider=nextcloud 需要 host、user、calendar 三个字段：' +
                '请在 profile 的 cordis.patch.yml 覆盖 calendar 行并重启。');
        }
        return trimTrailingSlash(host) + NEXTCLOUD_PATH + encodeURIComponent(user) + '/' + encodeURIComponent(calendar) + '/';
    }
    if (provider === 'icloud') {
        throw new ConfigError('dsh-calendar 的 provider=icloud 需要完整日历集合 URL：请在 icloud.com 的日历设置里找到具体日历的 CalDAV 地址，' +
            '填入 profile 的 cordis.patch.yml 覆盖 calendar 行的 caldavUrl（形如 ' + ICLOUD_CALDAV_URL + '/<用户ID>/calendars/<日历ID>/）后重启。');
    }
    throw new ConfigError('dsh-calendar 未配置 caldavUrl：provider=custom 时需提供完整日历集合 URL，' +
        '请在 profile 的 cordis.patch.yml 覆盖 calendar 行的 caldavUrl 并重启。');
}
