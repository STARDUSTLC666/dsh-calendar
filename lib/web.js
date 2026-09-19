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
import { resolveConfig } from './config.js';
import { CalendarService } from './caldav.js';
import { asRecord, assertIsoTime, assertTimeRange, isoNoMillis, optionalString, sortEvents } from './tools.js';
/** 面板与浏览器说话的同源路由。 */
export const SETTINGS_ROUTE = '/_dsh/dsh-calendar/settings';
/** 回环主机名白名单；带端口会被拆掉，IPv6 字面量保留方括号。 */
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
/** Host 头裁决：undefined = 放行，否则给出拒绝原因。 */
export function hostVerdict(host) {
    if (typeof host !== 'string' || host.trim() === '')
        return undefined;
    const text = host.trim().toLowerCase();
    const name = text.startsWith('[') ? text.slice(0, text.indexOf(']') + 1) : text.split(':')[0];
    return LOCAL_HOSTNAMES.has(name) ? undefined : `host "${host}" is not a localhost name`;
}
/** 写操作裁决：undefined = 放行，否则给出状态码与原因。 */
export function postVerdict(headers) {
    const contentType = String(headers['content-type'] ?? '');
    if (!contentType.toLowerCase().includes('application/json')) {
        return { status: 415, message: 'dsh-calendar settings route accepts application/json only' };
    }
    const origin = headers.origin;
    if (typeof origin === 'string' && origin.trim() !== '') {
        let url;
        try {
            url = new URL(origin);
        }
        catch {
            url = undefined;
        }
        if (url !== undefined && (url.protocol === 'http:' || url.protocol === 'https:')
            && !LOCAL_HOSTNAMES.has(url.hostname.toLowerCase())) {
            return { status: 403, message: `origin "${origin}" is not allowed to write dsh-calendar events` };
        }
    }
    const site = headers['sec-fetch-site'];
    if (typeof site === 'string' && site !== '' && site !== 'same-origin' && site !== 'none') {
        return { status: 403, message: `a ${site} request may not write dsh-calendar events` };
    }
    return undefined;
}
/**
 * 浏览器端后端：把面板的四个动作翻译成 CalDAV 调用。
 *
 * 配置缺失不抛错：面板需要它来渲染「还没配置」的引导态，所以 status 动作
 * 会回一个 configured:false，而不是让页面拿到 500。
 */
export class CalendarSettingsBackend {
    options;
    cachedKey;
    cachedService;
    constructor(options = {}) {
        this.options = options;
    }
    /** 惰性解析配置；凭据/端点变化即重建（闭包内比较，不落盘不记日志）。 */
    service() {
        if (this.options.serviceFactory !== undefined)
            return this.options.serviceFactory();
        const resolved = resolveConfig(this.options.config ?? undefined, this.options.env ?? process.env);
        const key = JSON.stringify(resolved);
        if (this.cachedService === undefined || this.cachedKey !== key) {
            this.cachedService = new CalendarService(resolved);
            this.cachedKey = key;
        }
        return this.cachedService;
    }
    /** 配置状态：只回面板要用的非敏感字段。 */
    status() {
        try {
            const resolved = resolveConfig(this.options.config ?? undefined, this.options.env ?? process.env);
            return { configured: true, provider: resolved.provider, caldavUrl: resolved.caldavUrl };
        }
        catch (error) {
            return { configured: false, reason: error instanceof Error ? error.message : String(error) };
        }
    }
    responseJson(res, status, payload) {
        const text = JSON.stringify(payload);
        if (typeof res.writeHead === 'function') {
            res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
        }
        if (typeof res.end === 'function')
            res.end(text);
    }
    /** 路由入口。GET = 读状态，POST = 动作（list/create/update/delete）。 */
    async handle(req, res) {
        const remote = String(req.socket?.remoteAddress ?? '');
        if (remote !== '127.0.0.1' && remote !== '::1' && remote !== '::ffff:127.0.0.1') {
            this.responseJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'dsh-calendar settings route is localhost-only' } });
            return;
        }
        const headers = (req.headers ?? {});
        const host = hostVerdict(headers.host);
        if (host !== undefined) {
            this.responseJson(res, 403, { ok: false, error: { code: 'forbidden', message: host } });
            return;
        }
        if (req.method !== 'POST') {
            this.responseJson(res, 200, { ok: true, value: this.status() });
            return;
        }
        const post = postVerdict(headers);
        if (post !== undefined) {
            this.responseJson(res, post.status, {
                ok: false,
                error: { code: post.status === 415 ? 'unsupported-media-type' : 'forbidden', message: post.message },
            });
            return;
        }
        try {
            const body = await readJsonBody(req);
            const value = await this.dispatch(asRecord(body));
            this.responseJson(res, 200, { ok: true, value });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.responseJson(res, 400, { ok: false, error: { code: 'rejected', message } });
        }
    }
    /** 动作分发。每个动作自己校验参数，错误信息面向用户（中文，面板直接显示）。 */
    async dispatch(body) {
        const action = typeof body.action === 'string' ? body.action : '';
        if (action === 'status')
            return this.status();
        if (action === 'list') {
            const now = new Date();
            const start = optionalString(body, 'start') ?? isoNoMillis(now.toISOString());
            const end = optionalString(body, 'end') ?? isoNoMillis(new Date(now.getTime() + 7 * 86400000).toISOString());
            assertIsoTime(start, 'start');
            assertIsoTime(end, 'end');
            assertTimeRange(start, end);
            const events = sortEvents(await this.service().list(start, end, {
                expand: body.expand !== false,
                maxOccurrences: clampInt(body.maxOccurrences, 200, 1, 500),
            }));
            return { count: events.length, start, end, events };
        }
        if (action === 'create') {
            const fields = eventFields(body, true);
            return { event: await this.service().create(fields) };
        }
        if (action === 'update') {
            const uid = requireString(body, 'uid', '缺少要修改的事件 uid');
            return { event: await this.service().update(uid, eventFields(body, false)) };
        }
        if (action === 'delete') {
            const uid = requireString(body, 'uid', '缺少要删除的事件 uid');
            return await this.service().delete(uid);
        }
        throw new Error('未知动作：' + (action === '' ? '(空)' : action));
    }
}
/** POST body 读取：上限 256 KiB，超限或非 JSON 直接拒绝。 */
async function readJsonBody(req) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
        const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
        size += buf.length;
        if (size > 256 * 1024)
            throw new Error('请求体过大');
        chunks.push(buf);
    }
    const text = Buffer.concat(chunks).toString('utf8').trim();
    if (text === '')
        return {};
    try {
        return JSON.parse(text);
    }
    catch {
        throw new Error('请求体不是合法 JSON');
    }
}
function requireString(body, key, message) {
    const value = optionalString(body, key);
    if (value === undefined || value === '')
        throw new Error(message);
    return value;
}
/** 把面板/工具传来的字段整理成 EventFields；create 时 summary/start/end 必填。 */
function eventFields(body, requireAll) {
    const fields = {};
    const summary = optionalString(body, 'summary');
    if (summary !== undefined) {
        if (summary === '')
            throw new Error('标题不能为空');
        fields.summary = summary;
    }
    else if (requireAll) {
        throw new Error('缺少标题（summary）');
    }
    for (const key of ['start', 'end']) {
        const value = optionalString(body, key);
        if (value !== undefined) {
            assertIsoTime(value, key);
            fields[key] = value;
        }
        else if (requireAll) {
            throw new Error('缺少' + (key === 'start' ? '开始时间' : '结束时间'));
        }
    }
    if (typeof fields.start === 'string' && typeof fields.end === 'string')
        assertTimeRange(fields.start, fields.end);
    for (const key of ['description', 'location', 'rrule']) {
        const value = body[key];
        if (typeof value === 'string')
            fields[key] = value;
    }
    if (typeof body.allDay === 'boolean')
        fields.allDay = body.allDay;
    return fields;
}
function clampInt(value, fallback, min, max) {
    const n = typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : fallback;
    return Math.min(max, Math.max(min, n));
}
/**
 * 把设置页里的日历面板挂到宿主 webserver 上。
 * 与 dsh-email 相同：ctx.inject(['webServer']) + effect 注册，插件卸载即摘掉路由。
 */
export function installCalendarSettingsWeb(ctx, backend) {
    ctx.inject(['webServer'], (webCtx) => {
        webCtx.effect(() => {
            return webCtx.webServer.register({
                kind: 'exact',
                path: SETTINGS_ROUTE,
                handler: (req, res) => backend.handle(req, res),
            });
        }, 'dsh-calendar: web routes');
    });
}
