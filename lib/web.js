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
import { CalendarSettingsSchema, SETTINGS_NAMESPACE, draftToConfig, validateSettingsValue } from './settings.js';
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
/** 面板要读写的连接字段。空串 = 保持不变，null = 明确清除。 */
export const CONNECTION_KEYS = ['provider', 'caldavUrl', 'username', 'password', 'host', 'user', 'calendar', 'calendarId', 'authMethod', 'clientId', 'clientSecret', 'refreshToken', 'tokenUrl', 'proxyUrl'];
/** 把「已存值 + 草稿」合并成要落盘的一版：草稿里缺席的键保留原值。 */
export function mergeConnection(stored, draft) {
    const out = {};
    for (const key of CONNECTION_KEYS) {
        const value = stored[key];
        if (typeof value === 'string' && value !== '')
            out[key] = value;
    }
    for (const key of CONNECTION_KEYS) {
        if (!(key in draft))
            continue;
        const value = draft[key];
        if (value === null) {
            delete out[key];
            continue;
        }
        if (typeof value !== 'string')
            continue;
        if (value === '')
            continue;
        out[key] = value;
    }
    return out;
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
    settings;
    constructor(options = {}) {
        this.options = options;
        this.settings = options.settings;
    }
    /** settings 服务到位后接上（传 undefined 摘掉）—— 面板据此从只读变成可保存。 */
    attachSettings(face) {
        this.settings = face;
    }
    /**
     * 懒接入宿主 settings。为什么不只用 ctx.inject(['settings'], cb)：那条路依赖子 fiber
     * 的时序，插件被重复 apply、或命名空间已被兄弟实例注册时它会静默失效，面板就永远停在
     * 「不能保存」。这里每个请求前试一次 ctx.get('settings')，拿到就接上，代价是一次属性读取。
     *
     * 命名空间已被注册（重复 apply 的第二个实例）不当作失败：直接搭在既有注册上 ——
     * describe() 给出的描述符里就带着当前值，写则走 provider 的 replace，功能完全一样。
     */
    ensureSettings() {
        if (this.settings !== undefined)
            return;
        const ctx = this.options.ctx;
        if (ctx === undefined || ctx === null)
            return;
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
        if (provider === undefined || provider === null || typeof provider.register !== 'function')
            return;
        const describe = () => (typeof provider.describe === 'function' ? provider.describe() ?? [] : []);
        const findRow = () => describe().find((row) => row !== undefined && row !== null && row.ns === SETTINGS_NAMESPACE);
        let scope;
        try {
            scope = provider.register(SETTINGS_NAMESPACE, CalendarSettingsSchema, {
                base: this.options.settingsBase ?? {},
                applies: 'live',
                validate: (value) => validateSettingsValue(value),
            });
        }
        catch (error) {
            // 「已经注册过」是最常见的一种：不报错，改搭既有注册。
            scope = undefined;
        }
        const read = () => {
            if (scope !== undefined && typeof scope.get === 'function') {
                const value = scope.get();
                if (value !== undefined && value !== null)
                    return value;
            }
            const row = findRow();
            const value = row === undefined ? undefined : (row.value ?? row.user);
            return (value ?? {});
        };
        this.attachSettings({
            read,
            descriptor: () => findRow(),
            replace: async (value, revision) => {
                await provider.replace(SETTINGS_NAMESPACE, value, revision);
            },
        });
        try {
            this.options.onSettings?.(read());
        }
        catch (error) { /* 回调失败不该让面板挂掉 */ }
    }
    /**
     * 当前生效配置：patch 行配置（或 getter 现取的那份）+ 面板写进 settings 的字段。
     *
     * 面板自己也要合并一遍，而不是只依赖传入的 getter —— 否则「面板显示的连接」
     * 与「工具实际用的连接」就成了两份来源，保存成功却看到未配置的怪象。
     */
    configOf() {
        this.ensureSettings();
        const source = this.options.config;
        const base = (typeof source === 'function' ? source() : source) ?? {};
        const stored = this.settings?.read?.();
        if (stored === undefined || stored === null)
            return base;
        return { ...base, ...draftToConfig(stored) };
    }
    /** 惰性解析配置；凭据/端点变化即重建（闭包内比较，不落盘不记日志）。 */
    service() {
        const current = this.configOf();
        if (this.options.serviceFactory !== undefined)
            return this.options.serviceFactory(current);
        const resolved = resolveConfig(current, this.options.env ?? process.env);
        const key = JSON.stringify(resolved);
        if (this.cachedService === undefined || this.cachedKey !== key) {
            this.cachedService = new CalendarService(resolved);
            this.cachedKey = key;
        }
        return this.cachedService;
    }
    /**
     * 连接摘要：面板要的每一个非敏感字段都在这里，密钥只回「有没有」。
     * 未配置时 configured:false + reason（resolveConfig 的中文指引），面板据此渲染引导态。
     */
    connection() {
        const stored = (this.settings?.read?.() ?? {});
        const effective = this.configOf();
        const descriptor = this.settings?.descriptor?.();
        let configured = false;
        let reason;
        try {
            resolveConfig(effective, this.options.env ?? process.env);
            configured = true;
        }
        catch (error) {
            reason = error instanceof Error ? error.message : String(error);
        }
        const text = (key) => {
            const value = stored[key];
            if (typeof value === 'string' && value !== '')
                return value;
            const resolved = effective[key];
            return typeof resolved === 'string' ? resolved : '';
        };
        return {
            configured,
            ...(reason !== undefined ? { reason } : {}),
            settingsAvailable: this.settings !== undefined,
            revision: descriptor?.revision ?? 0,
            provider: text('provider'),
            caldavUrl: text('caldavUrl'),
            username: text('username'),
            host: text('host'),
            user: text('user'),
            calendar: text('calendar'),
            calendarId: text('calendarId'),
            authMethod: text('authMethod'),
            clientId: text('clientId'),
            tokenUrl: text('tokenUrl'),
            proxyUrl: text('proxyUrl'),
            hasPassword: text('password') !== '' || (effective.password ?? '') !== '',
            hasClientSecret: text('clientSecret') !== '' || (effective.clientSecret ?? '') !== '',
            hasRefreshToken: text('refreshToken') !== '' || (effective.refreshToken ?? '') !== '',
        };
    }
    /** 兼容旧动作名：status 就是连接摘要。 */
    status() {
        return this.connection();
    }
    /**
     * 草稿 → 拟议配置：先与已存值合并（草稿缺席的键保留原值），再叠加到当前生效配置之上。
     * 连接测试和保存都走这条路，所以「测试通过」与「保存后能用」看到的是同一份配置。
     */
    proposed(draft) {
        const storedValue = (this.settings?.read?.() ?? {});
        const stored = mergeConnection(storedValue, draft);
        return { stored, config: { ...this.configOf(), ...draftToConfig(stored) } };
    }
    /** 真连一次：拿拟议配置列一下未来 30 天，能列出来就算通。 */
    async probe(config) {
        if (this.options.probeFactory !== undefined)
            return await this.options.probeFactory(config);
        const service = this.options.serviceFactory !== undefined
            ? this.options.serviceFactory(config)
            : new CalendarService(resolveConfig(config, this.options.env ?? process.env));
        const now = new Date();
        const events = await service.list(isoNoMillis(now.toISOString()), isoNoMillis(new Date(now.getTime() + 30 * 86400000).toISOString()), { expand: false, maxOccurrences: 5 });
        return { count: events.length, sample: events.slice(0, 3).map((event) => event.summary) };
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
        // 每次请求前试一次：settings 服务晚到、或上一个实例刚卸载，都能在这一刻补上。
        this.ensureSettings();
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
        if (action === 'status' || action === 'connection')
            return this.connection();
        if (action === 'testConnection') {
            const { config } = this.proposed(connectionDraft(body));
            const probe = await this.probe(config);
            return { ok: true, ...probe, connection: this.connection() };
        }
        if (action === 'saveConnection') {
            const { stored, config } = this.proposed(connectionDraft(body));
            // 校验的是「落盘后的形状」：只有它同时覆盖了 YAML 兜底与面板新填的字段。
            validateSettingsValue(stored);
            // 默认先测再存：一个连不上的地址不该被写进 settings 再让人去猜哪里错了。
            const probe = body.test === false ? undefined : await this.probe(config);
            const face = this.settings;
            if (face === undefined) {
                throw new Error('当前宿主的 settings 服务不可用：请在 profile 的 cordis.patch.yml 里配置 dsh-calendar 后重启');
            }
            await face.replace(stored, face.descriptor()?.revision ?? 0);
            try {
                this.options.onSettings?.(stored);
            }
            catch (error) { /* 同上 */ }
            return { saved: true, ...(probe !== undefined ? { probe } : {}), connection: this.connection() };
        }
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
/** 从请求体里挑出连接字段：只认 CONNECTION_KEYS，字符串原样、null 表示清除。 */
function connectionDraft(body) {
    const draft = {};
    for (const key of CONNECTION_KEYS) {
        if (!(key in body))
            continue;
        const value = body[key];
        if (value === null || typeof value === 'string')
            draft[key] = value;
    }
    return draft;
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
