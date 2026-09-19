/**
 * 设置页日历面板的后端：安全壳 + list/create/update/delete 全链路。
 *
 * 全部走假的 CalDAV 服务与假的 req/res —— 这套测试不联网、不碰真实日历，
 * 也不打印任何凭据。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { CalendarSettingsBackend, SETTINGS_ROUTE, hostVerdict, postVerdict } from '../lib/web.js';

/** 造一个最小 req：POST body 走异步迭代器（handle 里就是 for await 读的）。 */
function makeReq(options = {}) {
  const method = options.method ?? 'POST';
  const headers = Object.assign({ host: 'localhost:3080', 'content-type': 'application/json' }, options.headers ?? {});
  const chunks = options.raw !== undefined
    ? [Buffer.from(options.raw)]
    : [Buffer.from(JSON.stringify(options.body ?? {}))];
  return {
    method,
    headers,
    socket: { remoteAddress: options.remote ?? '127.0.0.1' },
    async *[Symbol.asyncIterator]() { for (const chunk of chunks) yield chunk; },
  };
}

function makeRes() {
  const state = { status: 0, body: undefined, raw: '' };
  return {
    state,
    writeHead(status) { state.status = status; },
    end(text) { state.raw = text; state.body = JSON.parse(text); },
  };
}

/** 假 CalDAV：记录收到的调用，返回可预测的事件对象。 */
function fakeService(events = []) {
  const calls = [];
  return {
    calls,
    async list(start, end) {
      calls.push({ op: 'list', start, end });
      return events;
    },
    async create(fields) {
      calls.push({ op: 'create', fields });
      return Object.assign({ uid: 'https://caldav.example/new.ics', etag: 'e1', isOccurrence: false }, fields);
    },
    async update(uid, changes) {
      calls.push({ op: 'update', uid, changes });
      return Object.assign({ uid, etag: 'e2', isOccurrence: false }, changes);
    },
    async delete(uid) {
      calls.push({ op: 'delete', uid });
      return { uid, href: uid };
    },
  };
}

const EVENT = {
  uid: 'https://caldav.example/meeting.ics',
  href: 'https://caldav.example/meeting.ics',
  summary: '产品评审会',
  start: '2026-09-21T02:00:00Z',
  end: '2026-09-21T03:00:00Z',
  allDay: false,
  location: '会议室 A',
  isOccurrence: false,
};

function backendWith(service, config = { provider: 'custom', caldavUrl: 'https://caldav.example', username: 'me', password: 'secret-password' }) {
  return new CalendarSettingsBackend({ config, serviceFactory: () => service });
}

test('只有回环地址能访问这条路由', async () => {
  const backend = backendWith(fakeService());
  const res = makeRes();
  await backend.handle(makeReq({ remote: '192.168.1.9', method: 'GET' }), res);
  assert.equal(res.state.status, 403);
  assert.match(res.state.body.error.message, /localhost-only/);
});

test('Host 头必须是 localhost 名（挡 DNS rebinding）', async () => {
  const backend = backendWith(fakeService());
  const res = makeRes();
  await backend.handle(makeReq({ method: 'GET', headers: { host: 'evil.example.com' } }), res);
  assert.equal(res.state.status, 403);
  assert.match(res.state.body.error.message, /not a localhost name/);
});

test('写操作必须是 application/json，且 Origin/Sec-Fetch-Site 不能跨源', async () => {
  const backend = backendWith(fakeService());
  const plain = makeRes();
  await backend.handle(makeReq({ raw: 'action=list', headers: { 'content-type': 'text/plain' } }), plain);
  assert.equal(plain.state.status, 415);

  const crossOrigin = makeRes();
  await backend.handle(makeReq({ headers: { origin: 'https://evil.example' } }), crossOrigin);
  assert.equal(crossOrigin.state.status, 403);
  assert.match(crossOrigin.state.body.error.message, /is not allowed to write/);

  const crossSite = makeRes();
  await backend.handle(makeReq({ headers: { 'sec-fetch-site': 'cross-site' } }), crossSite);
  assert.equal(crossSite.state.status, 403);

  // 同源写请求（Origin 是 localhost）必须放行。
  assert.equal(postVerdict({ 'content-type': 'application/json', origin: 'http://localhost:3080', 'sec-fetch-site': 'same-origin' }), undefined);
  // 非浏览器客户端不带这些头 —— 缺席是允许的，不是拒绝。
  assert.equal(postVerdict({ 'content-type': 'application/json' }), undefined);
  assert.equal(hostVerdict('[::1]:3080'), undefined);
});

test('未配置时 status 回 configured:false，而不是让面板拿到 500', async () => {
  const backend = new CalendarSettingsBackend({ config: {}, serviceFactory: undefined });
  const res = makeRes();
  await backend.handle(makeReq({ method: 'GET' }), res);
  assert.equal(res.state.status, 200);
  assert.equal(res.state.body.ok, true);
  assert.equal(res.state.body.value.configured, false);
  assert.equal(typeof res.state.body.value.reason, 'string');
  assert.equal(/secret-password/.test(res.state.raw), false, '响应里永远不能出现配置里的凭据');
});

test('list 传窗口给服务端，默认展开重复事件', async () => {
  const service = fakeService([EVENT]);
  const backend = backendWith(service);
  const res = makeRes();
  await backend.handle(makeReq({ body: { action: 'list', start: '2026-09-20T00:00:00Z', end: '2026-09-27T00:00:00Z' } }), res);
  assert.equal(res.state.status, 200);
  assert.equal(res.state.body.value.count, 1);
  assert.equal(res.state.body.value.events[0].summary, '产品评审会');
  assert.deepEqual(service.calls[0], { op: 'list', start: '2026-09-20T00:00:00Z', end: '2026-09-27T00:00:00Z' });
});

test('create / update / delete 走同一套动作，且参数原样到达服务端', async () => {
  const service = fakeService();
  const backend = backendWith(service);

  const created = makeRes();
  await backend.handle(makeReq({ body: { action: 'create', summary: '周会', start: '2026-09-22T01:30:00Z', end: '2026-09-22T02:00:00Z', location: '线上', rrule: 'FREQ=WEEKLY;COUNT=4' } }), created);
  assert.equal(created.state.status, 200);
  assert.equal(service.calls[0].op, 'create');
  assert.equal(service.calls[0].fields.rrule, 'FREQ=WEEKLY;COUNT=4');

  const updated = makeRes();
  await backend.handle(makeReq({ body: { action: 'update', uid: EVENT.uid, summary: '周会（改）', start: '2026-09-22T02:00:00Z', end: '2026-09-22T02:30:00Z' } }), updated);
  assert.equal(updated.state.status, 200);
  assert.equal(service.calls[1].op, 'update');
  assert.equal(service.calls[1].uid, EVENT.uid);
  assert.equal(service.calls[1].changes.summary, '周会（改）');

  const deleted = makeRes();
  await backend.handle(makeReq({ body: { action: 'delete', uid: EVENT.uid } }), deleted);
  assert.equal(deleted.state.status, 200);
  assert.deepEqual(service.calls[2], { op: 'delete', uid: EVENT.uid });
});

test('参数不合法时给出可读的中文错误，且不去打扰 CalDAV 服务器', async () => {
  const service = fakeService();
  const backend = backendWith(service);
  for (const body of [
    { action: 'create', start: '2026-09-22T01:30:00Z', end: '2026-09-22T02:00:00Z' },
    { action: 'create', summary: '没有时间' },
    { action: 'update' },
    { action: 'delete' },
    { action: 'nope' },
    { action: 'list', start: '不是时间', end: '2026-09-22T02:00:00Z' },
    { action: 'list', start: '2026-09-22T02:00:00Z', end: '2026-09-22T01:00:00Z' },
  ]) {
    const res = makeRes();
    await backend.handle(makeReq({ body }), res);
    assert.equal(res.state.status, 400, JSON.stringify(body));
    assert.equal(res.state.body.ok, false);
    assert.equal(typeof res.state.body.error.message, 'string');
    assert.equal(res.state.body.error.message.length > 0, true);
  }
  assert.equal(service.calls.length, 0, '校验失败的请求不该打到 CalDAV');
});

test('路由常量与面板一致（改一处忘另一处会被这条抓住）', async () => {
  assert.equal(SETTINGS_ROUTE, '/_dsh/dsh-calendar/settings');
  const source = await import('node:fs').then((fs) => fs.readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'));
  assert.match(source, /"\/_dsh\/dsh-calendar\/settings"/, '面板 fetch 的就是这个路由');
});

test('面板挂在宿主的 settings 槽位，并自带一个对话页悬浮按钮', async () => {
  const fs = await import('node:fs');
  const source = fs.readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');
  assert.match(source, /ctx\.slots\.inject\("settings\.section"/, '设置页里要有「日历」一节');
  assert.match(source, /require\("react-dom\/client"\)/, '悬浮面板自己挂 root，用的是平台 seed 里的 react-dom/client');
  assert.match(source, /dshc-fab/, '对话页右下角的小按钮');
  assert.match(source, /--dsw-alias-bg-layer-1/, '配色走宿主设计令牌，深浅色主题自动跟随');
  assert.match(source, /export(s)?\.inject = inject/, 'inject 必须导出，否则 cordis 不会调用 apply');
});
