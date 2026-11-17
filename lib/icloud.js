import { propfind } from 'tsdav';
import { ICLOUD_CALDAV_URL, resolveCredentials } from './config.js';
import { createProxyFetch } from './proxy-fetch.js';
class ICloudError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
const allowedHost = /^(?:p\d+-)?caldav\.icloud\.com(?:\.cn)?$/;
const redirectStatuses = new Set([301, 302, 303, 307, 308]);
const maxXmlBytes = 1024 * 1024;
function appleUrl(value, base) {
    let url;
    try {
        url = new URL(value, base);
    }
    catch { /* Reject invalid service and collection URLs below. */ }
    if (!url || url.protocol !== 'https:' || !allowedHost.test(url.hostname) || url.port
        || url.username || url.password || url.search || url.hash) {
        throw new ICloudError('发现日历时收到不受信任的 iCloud 地址。');
    }
    return url;
}
// Keep request and XML limits before the DAV parser consumes an entire response.
async function xmlResponse(response) {
    const reader = response.body?.getReader();
    if (!reader || !response.headers.get('content-type')?.toLowerCase().includes('xml')) {
        await reader?.cancel().catch(() => { });
        throw new ICloudError('iCloud 返回了无法读取的日历列表。');
    }
    let bytes = 0;
    const chunks = [];
    try {
        for (;;) {
            const { value, done } = await reader.read();
            if (done)
                break;
            bytes += value.length;
            if (bytes > maxXmlBytes)
                throw new ICloudError('iCloud 返回的日历列表过大。');
            chunks.push(Buffer.from(value));
        }
    }
    finally {
        await reader.cancel().catch(() => { });
    }
    const xml = Buffer.concat(chunks).toString('utf8');
    if (/<!DOCTYPE/i.test(xml))
        throw new ICloudError('iCloud 返回了无法读取的日历列表。');
    return new Response(xml, { status: 207, headers: { 'content-type': 'application/xml' } });
}
async function discoverFrom(root, authorization, transport, signal) {
    async function query(url, depth, props) {
        let current = url;
        const rows = await propfind({
            url: url.href, depth, props,
            fetch: async (_input, options) => {
                const headers = new Headers(options?.headers);
                headers.set('authorization', authorization);
                for (let redirects = 0; redirects <= 4; redirects++) {
                    signal.throwIfAborted();
                    const response = await transport(current.href, {
                        ...options, headers, redirect: 'manual', signal,
                    });
                    if (response.status === 207)
                        return xmlResponse(response);
                    const location = response.headers.get('location');
                    await response.body?.cancel().catch(() => { });
                    if (redirectStatuses.has(response.status) && location && redirects < 4) {
                        current = appleUrl(location, current);
                        continue;
                    }
                    throw new ICloudError('iCloud 日历发现请求失败。', response.status);
                }
                throw new ICloudError('iCloud 日历发现请求失败。');
            },
        });
        return { rows, url: current };
    }
    const principal = await query(appleUrl(root), '0', { 'd:current-user-principal': {} });
    const principalHref = principal.rows.find(row => row.ok && typeof row.props?.currentUserPrincipal?.href === 'string')?.props?.currentUserPrincipal.href;
    if (!principalHref)
        throw new ICloudError('iCloud 未返回日历账户地址。');
    const home = await query(appleUrl(principalHref, principal.url), '0', { 'c:calendar-home-set': {} });
    const homeHref = home.rows.find(row => row.ok && typeof row.props?.calendarHomeSet?.href === 'string')?.props?.calendarHomeSet.href;
    if (!homeHref)
        throw new ICloudError('iCloud 未返回日历目录。');
    const collections = await query(appleUrl(homeHref, home.url), '1', {
        'd:displayname': {}, 'd:resourcetype': {}, 'c:supported-calendar-component-set': {},
    });
    const found = new Map();
    for (const row of collections.rows) {
        if (!row.ok || !row.props?.resourcetype || !Object.hasOwn(row.props.resourcetype, 'calendar') || typeof row.href !== 'string' || !row.href)
            continue;
        const component = row.props.supportedCalendarComponentSet?.comp;
        if (component && ![component].flat().some(item => item?._attributes?.name === 'VEVENT'))
            continue;
        let calendar;
        try {
            calendar = appleUrl(row.href, collections.url);
        }
        catch {
            continue;
        }
        const parent = collections.url.pathname.replace(/\/?$/, '/');
        const child = calendar.pathname.replace(/\/?$/, '/');
        if (child === parent || !child.startsWith(parent))
            continue;
        calendar.pathname = child;
        const display = row.props.displayname?._cdata ?? row.props.displayname;
        const name = typeof display === 'string' ? display.trim().slice(0, 200) : '';
        found.set(calendar.href, { url: calendar.href, name });
        if (found.size >= 150)
            break;
    }
    if (!found.size)
        throw new ICloudError('没有找到可选择的 iCloud 日历。');
    return [...found.values()];
}
/** iCloud discovery is read-only. Follow the authenticated account to its Apple CalDAV shard. */
export async function discoverICloud(config, env, signal) {
    const { username, password } = resolveCredentials({ ...config, provider: 'icloud', authMethod: 'basic' }, env);
    if (/[:\r\n]/.test(username))
        throw new ICloudError('请填写有效的 Apple 账户。');
    const transport = config.proxyUrl ? createProxyFetch(config.proxyUrl) : globalThis.fetch;
    const auth = 'Basic ' + Buffer.from(username + ':' + password, 'utf8').toString('base64');
    const active = signal ? AbortSignal.any([signal, AbortSignal.timeout(20000)]) : AbortSignal.timeout(20000);
    try {
        try {
            return await discoverFrom(ICLOUD_CALDAV_URL, auth, transport, active);
        }
        catch (error) {
            if (!(error instanceof ICloudError) || ![401, 403, 404].includes(error.status ?? 0))
                throw error;
            return await discoverFrom('https://caldav.icloud.com.cn', auth, transport, active);
        }
    }
    catch (error) {
        if (active.aborted)
            throw new ICloudError('iCloud 日历发现已取消或超时。');
        if (error instanceof ICloudError) {
            if (error.status === 401 || error.status === 403)
                throw new ICloudError('iCloud 认证失败，请检查 Apple 账户与 App 专用密码。');
            throw error;
        }
        throw new ICloudError('无法连接 iCloud，请检查网络或代理后重试。');
    }
}
