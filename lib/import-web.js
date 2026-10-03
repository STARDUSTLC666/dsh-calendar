import { createHash, randomUUID } from 'node:crypto';
import { resolveConfig } from './config.js';
import { CalendarService } from './caldav.js';
import { parseImportICS, importTimezones } from './import-ical.js';
export const CALENDAR_IMPORT_ROUTE = '/api/dsh-calendar/import';
const json = (status, value) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const fail = (status, message) => json(status, { ok: false, message });
const keyOf = (config) => createHash('sha256').update(JSON.stringify(config)).digest('hex');
function overlaps(a, b) {
    const as = Date.parse(a.start ?? ''), ae = Math.max(Date.parse(a.end ?? '') || as, as + 1);
    const bs = Date.parse(b.start), be = Math.max(Date.parse(b.end) || bs, bs + 1);
    return as < be && bs < ae;
}
export class CalendarImportBackend {
    options;
    plans = new Map();
    committing = false;
    constructor(options) {
        this.options = options;
    }
    now() { return this.options.now?.() ?? Date.now(); }
    current() { return resolveConfig(this.options.config(), this.options.env ?? process.env); }
    service(config) { return this.options.serviceFactory?.(config) ?? new CalendarService(config); }
    prune() { for (const [id, plan] of this.plans)
        if (this.now() - plan.created > 15 * 60 * 1000)
            this.plans.delete(id); }
    safeMessage(error) {
        let message = error instanceof Error ? error.message : '导入失败，请检查日历连接后重试';
        try {
            const config = this.current();
            for (const secret of [config.password, config.oauth?.clientSecret, config.oauth?.refreshToken])
                if (secret)
                    message = message.split(secret).join('[已隐藏]');
        }
        catch { /* Configuration errors contain guidance, never credentials. */ }
        return message.slice(0, 1200);
    }
    async action(body, signal) {
        this.prune();
        signal?.throwIfAborted();
        if (body.action === 'zones')
            return { zones: importTimezones() };
        if (body.action === 'preview') {
            const parsed = parseImportICS(body.ics, typeof body.floatingTimezone === 'string' ? body.floatingTimezone : undefined);
            let config;
            try {
                config = this.current();
            }
            catch (error) {
                return { id: null, connectionReady: false, connectionMessage: this.safeMessage(error), rows: parsed.items.map(i => i.row), ignored: parsed.ignored, suggestedTimezone: parsed.suggestedTimezone };
            }
            const snapshot = await this.service(config).importSnapshot(signal);
            if (keyOf(this.current()) !== keyOf(config))
                throw new Error('日历连接已改变，请重新预览');
            for (const { row } of parsed.items)
                if (row.status === 'ready') {
                    if (snapshot.uids.has(row.uid)) {
                        row.status = 'duplicate';
                        continue;
                    }
                    row.conflicts = snapshot.events.filter(event => event.icalUid !== row.uid && overlaps(row, event)).length;
                }
            for (const { row } of parsed.items)
                if (row.status === 'ready')
                    row.conflicts += parsed.items.filter(i => i.row.id !== row.id && i.row.status === 'ready' && overlaps(row, { start: i.row.start ?? '', end: i.row.end ?? '' })).length;
            if (this.plans.size >= 5)
                this.plans.delete(this.plans.keys().next().value);
            const id = randomUUID();
            this.plans.set(id, { created: this.now(), key: keyOf(config), items: parsed.items, done: new Set() });
            return { id, connectionReady: true, rows: parsed.items.map(i => i.row), ignored: parsed.ignored, suggestedTimezone: parsed.suggestedTimezone, expiresAt: this.now() + 15 * 60 * 1000 };
        }
        if (body.action === 'commit') {
            if (body.confirmed !== true)
                throw new Error('请先核对预览，再确认导入');
            const plan = typeof body.id === 'string' ? this.plans.get(body.id) : undefined;
            if (!plan)
                throw new Error('预览已过期或插件已重启，请重新预览');
            const config = this.current();
            if (keyOf(config) !== plan.key)
                throw new Error('日历连接已改变，请重新预览');
            if (!Array.isArray(body.selected) || !body.selected.length || body.selected.length > 20
                || body.selected.some(id => typeof id !== 'string') || new Set(body.selected).size !== body.selected.length)
                throw new Error('每次请选择 1–20 个日程系列，其余可分批导入');
            const selected = body.selected.map(id => plan.items.find(i => i.row.id === id));
            if (selected.some(i => !i || i.row.status !== 'ready'))
                throw new Error('选择包含不可导入的日程，请重新预览');
            if (this.committing)
                throw new Error('另一批日程正在导入，请稍后重试');
            this.committing = true;
            const results = [];
            try {
                const service = this.service(config), snapshot = await service.importSnapshot(signal);
                for (const item of selected) {
                    if (keyOf(this.current()) !== plan.key) {
                        results.push({ id: item.row.id, status: 'failed', message: '日历连接已改变，请重新预览' });
                        break;
                    }
                    signal?.throwIfAborted();
                    if (plan.done.has(item.row.id)) {
                        results.push({ id: item.row.id, status: 'imported' });
                        continue;
                    }
                    if (snapshot.uids.has(item.row.uid)) {
                        results.push({ id: item.row.id, status: 'duplicate' });
                        continue;
                    }
                    try {
                        await service.importRaw(item.row.uid, item.data, signal);
                        plan.done.add(item.row.id);
                        snapshot.uids.add(item.row.uid);
                        results.push({ id: item.row.id, status: 'imported' });
                    }
                    catch (error) {
                        signal?.throwIfAborted();
                        results.push({ id: item.row.id, status: 'failed', message: this.safeMessage(error) });
                    }
                }
                return { results };
            }
            finally {
                this.committing = false;
            }
        }
        throw new Error('不支持此导入操作');
    }
    async fetch(request) {
        if (request.method !== 'POST')
            return fail(405, '请使用 POST');
        if (request.headers.get('x-dsh-calendar-import') !== '1' || request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json')
            return fail(403, '请从日历导入面板操作');
        const site = request.headers.get('sec-fetch-site'), origin = request.headers.get('origin');
        if (site && !['same-origin', 'none'].includes(site))
            return fail(403, '拒绝跨站操作');
        if (origin) {
            try {
                const url = new URL(origin);
                if (!['http:', 'https:'].includes(url.protocol) || url.host !== (request.headers.get('host') || new URL(request.url).host))
                    return fail(403, '拒绝跨源操作');
            }
            catch {
                return fail(403, '无效来源');
            }
        }
        try {
            const reader = request.body?.getReader();
            if (!reader)
                return fail(400, '缺少请求内容');
            let size = 0;
            const chunks = [];
            try {
                for (;;) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    size += value.byteLength;
                    if (size > 512 * 1024) {
                        await reader.cancel();
                        return fail(413, '请求过大，请分批导入');
                    }
                    chunks.push(value);
                }
            }
            finally {
                reader.releaseLock();
            }
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
            if (!body || typeof body !== 'object' || Array.isArray(body))
                throw new Error('请求必须是对象');
            const signal = AbortSignal.any([request.signal, AbortSignal.timeout(120000)]);
            return json(200, { ok: true, value: await this.action(body, signal) });
        }
        catch (error) {
            return fail(400, this.safeMessage(error));
        }
    }
}
export function installCalendarImport(ctx, backend) {
    ctx.inject?.(['connection'], (host) => host.connection?.fetch?.register({ path: CALENDAR_IMPORT_ROUTE, methods: ['POST'], requestBody: 'buffered', fetch: (request) => backend.fetch(request) }));
}
