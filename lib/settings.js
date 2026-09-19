/**
 * 面板里的「连接设置」写进哪儿：宿主的 settings 命名空间（settings.yaml）。
 *
 * 与 dsh-email 同一套契约，理由也相同：
 *   - 面板是唯一的常规入口，用户不该为了填四个格子去编辑 cordis.patch.yml；
 *   - 但 cordis.patch.yml 仍是基座：settings 里没碰过的字段由它兜底，所以老用户的
 *     YAML 配置不会因为装上这个面板就失效（toCalendarConfig 只投影「用户真的设过」
 *     的字段，schema 默认值绝不覆盖 YAML 与预设）；
 *   - 密码走 role(secret)，与邮箱授权码同等对待：不进日志、不进导出、不进诊断。
 */
import z from 'schemastery';
import { CALENDAR_PROVIDERS } from './config.js';
/** 本插件独占的 settings 命名空间。 */
export const SETTINGS_NAMESPACE = 'dsh-calendar';
/**
 * 面板表单的形状。空串一律表示「没设置」：一行 patch 里的 YAML 配置与面板写下的值
 * 因此可以共存 —— 谁设过谁说了算。
 */
export const CalendarSettingsSchema = z.object({
    provider: z.string().default(''),
    caldavUrl: z.string().default(''),
    username: z.string().default(''),
    password: z.string().role('secret').default(''),
    host: z.string().default(''),
    user: z.string().default(''),
    calendar: z.string().default(''),
    calendarId: z.string().default(''),
    authMethod: z.string().default(''),
    clientId: z.string().default(''),
    clientSecret: z.string().role('secret').default(''),
    refreshToken: z.string().role('secret').default(''),
    tokenUrl: z.string().default(''),
    proxyUrl: z.string().default(''),
});
const TEXT_KEYS = [
    'provider', 'caldavUrl', 'username', 'password', 'host', 'user', 'calendar',
    'calendarId', 'authMethod', 'clientId', 'clientSecret', 'refreshToken', 'tokenUrl', 'proxyUrl',
];
/** 把一行 cordis.patch.yml 的配置投影成 schema 的 base（只带有值的字段）。 */
export function toSettingsBase(config) {
    const out = {};
    const cfg = (config ?? {});
    for (const key of TEXT_KEYS) {
        const value = cfg[key];
        if (typeof value === 'string' && value !== '')
            out[key] = value;
    }
    return out;
}
function isSet(value) {
    return value !== undefined && value !== null;
}
/**
 * settings 值 → CalendarConfig。
 *
 * user 是「用户真的改过哪些键」的投影：只有它列出的字段才会被投影出去，因此 schema
 * 的默认值（空串）不会擦掉 cordis.patch.yml 里的配置。传 null 表示按草稿全量投影
 * （保存与测试连接的路径）。
 */
export function toCalendarConfig(value, user) {
    const draft = (value ?? {});
    const has = (key) => user === null || (user !== undefined && user[key] !== undefined);
    const out = {};
    for (const key of TEXT_KEYS) {
        if (!has(key))
            continue;
        const raw = draft[key];
        if (!isSet(raw) || raw === '')
            continue;
        out[key] = raw;
    }
    return out;
}
/** 连接测试用的「拟议配置」：草稿全量投影，不经过已存值。 */
export function draftToConfig(draft) {
    return toCalendarConfig(draft, null);
}
function describe(value) {
    if (typeof value === 'string')
        return '"' + value + '"';
    if (value === undefined)
        return 'undefined';
    try {
        return JSON.stringify(value) ?? String(value);
    }
    catch {
        return String(value);
    }
}
/**
 * 写入前的温和校验：结构错误立刻报（中文，面板直接显示），不完整的配置放行 ——
 * 具体地址拼装留给 resolveConfig，它会在工具调用时给出带指引的错误。
 */
export function validateSettingsValue(value) {
    const draft = (value ?? {});
    const provider = typeof draft.provider === 'string' ? draft.provider : '';
    if (provider !== '' && !CALENDAR_PROVIDERS.includes(provider)) {
        throw new Error('未知的日历服务商 ' + describe(provider) + '，可选：' + CALENDAR_PROVIDERS.join(' / '));
    }
    const authMethod = typeof draft.authMethod === 'string' ? draft.authMethod : '';
    if (authMethod !== '' && authMethod !== 'oauth' && authMethod !== 'basic') {
        throw new Error('认证方式只能是 oauth 或 basic，收到 ' + describe(authMethod));
    }
    if (provider === 'google' && authMethod === 'basic') {
        throw new Error('Google 不接受 Basic（应用专用密码）：请把认证方式设为 oauth 并填 clientId / clientSecret / refreshToken');
    }
    const url = typeof draft.caldavUrl === 'string' ? draft.caldavUrl.trim() : '';
    if (url !== '' && !/^https?:\/\//i.test(url)) {
        throw new Error('日历集合 URL 必须以 http:// 或 https:// 开头，收到 ' + describe(url));
    }
    const tokenUrl = typeof draft.tokenUrl === 'string' ? draft.tokenUrl.trim() : '';
    if (tokenUrl !== '' && !/^https?:\/\//i.test(tokenUrl)) {
        throw new Error('令牌地址必须以 http:// 或 https:// 开头，收到 ' + describe(tokenUrl));
    }
    const proxyUrl = typeof draft.proxyUrl === 'string' ? draft.proxyUrl.trim() : '';
    if (proxyUrl !== '' && !/^https?:\/\//i.test(proxyUrl)) {
        throw new Error('代理地址必须以 http:// 或 https:// 开头，收到 ' + describe(proxyUrl));
    }
    if (provider === 'google') {
        if ((draft.calendarId ?? '') === '')
            throw new Error('Google 需要日历 ID（通常是你的邮箱地址）');
        if ((draft.clientId ?? '') === '')
            throw new Error('Google 需要 clientId');
        if ((draft.clientSecret ?? '') === '' || (draft.refreshToken ?? '') === '') {
            throw new Error('Google 需要 clientSecret 与 refreshToken：两者都由 OAuth 换来，缺一不可');
        }
    }
    if (provider === 'nextcloud') {
        if ((draft.host ?? '') === '')
            throw new Error('Nextcloud 需要 host（如 https://cloud.example.com）');
        if ((draft.user ?? '') === '')
            throw new Error('Nextcloud 需要 user');
        if ((draft.calendar ?? '') === '')
            throw new Error('Nextcloud 需要 calendar（日历名，如 personal）');
    }
    if ((provider === 'icloud' || provider === 'custom') && url === '') {
        throw new Error((provider === 'icloud' ? 'iCloud' : '自建 CalDAV') + '需要完整的日历集合 URL（caldavUrl）');
    }
}
