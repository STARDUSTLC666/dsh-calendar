/**
 * 设置页日历面板的后端：安全壳 + list/create/update/delete 全链路。
 *
 * 全部走假的 CalDAV 服务与假的 req/res —— 这套测试不联网、不碰真实日历，
 * 也不打印任何凭据。
 */
import test from 'node:test';
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict';
import { CalendarSettingsBackend, SETTINGS_ROUTE, hostVerdict, mergeConnection, postVerdict } from '../lib/web.js';
import { toCalendarConfig, toSettingsBase, validateSettingsValue } from '../lib/settings.js';
import { attachSettings } from '../lib/index.js';
import { readConnectionFile, writeConnectionFile } from '../lib/store.js';

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

// ───────────────────────────── 连接设置（面板内配置） ─────────────────────────────

/** 假的 settings 面：记录写入、给出 revision，行为与宿主的 replace 一致。 */
function fakeSettings(initial = {}, revision = 7) {
  const state = { value: Object.assign({}, initial), revision, writes: [] };
  return {
    state,
    read: () => state.value,
    descriptor: () => ({ revision: state.revision, user: state.value }),
    replace: async (value, expected) => {
      state.writes.push({ value: Object.assign({}, value), revision: expected });
      state.value = Object.assign({}, value);
    },
  };
}

test('mergeConnection：草稿缺席＝保持、空串＝保持、null＝清除', () => {
  const stored = { provider: 'icloud', username: 'me@icloud.com', password: 'old', caldavUrl: 'https://caldav.icloud.com/1/calendars/home/' };
  assert.deepEqual(
    mergeConnection(stored, { provider: 'custom' }),
    { provider: 'custom', username: 'me@icloud.com', password: 'old', caldavUrl: 'https://caldav.icloud.com/1/calendars/home/' },
    '只改 provider，其余原样保留'
  );
  assert.deepEqual(mergeConnection(stored, { password: '' }).password, 'old', '空串是「保持不变」，不是清除');
  const cleared = mergeConnection(stored, { password: null });
  assert.equal('password' in cleared, false, 'null 才是明确清除');
});

test('connection 摘要只回「有没有密钥」，绝不回显密钥本身', async () => {
  const settings = fakeSettings({
    provider: 'icloud',
    caldavUrl: 'https://caldav.icloud.com/1/calendars/home/',
    username: 'me@icloud.com',
    password: 'super-secret-password',
    clientSecret: 'super-secret-client',
  });
  const backend = new CalendarSettingsBackend({ config: {}, settings, probeFactory: async () => ({ count: 0, sample: [] }) });
  const res = makeRes();
  await backend.handle(makeReq({ body: { action: 'connection' } }), res);
  assert.equal(res.state.status, 200);
  const value = res.state.body.value;
  assert.equal(value.configured, true, 'icloud + URL + 账号 + 密码就是一份能用的配置');
  assert.equal(value.provider, 'icloud');
  assert.equal(value.hasPassword, true);
  assert.equal(value.hasClientSecret, true);
  assert.equal(value.settingsAvailable, true);
  assert.equal(value.revision, 7);
  assert.equal(/super-secret/.test(res.state.raw), false, '响应里不能出现任何密钥');
  assert.equal(Object.keys(value).some((key) => key === 'password' || key === 'clientSecret'), false, '字段名也不该叫 password/clientSecret');
});

test('saveConnection：先测后存，写进 settings 时带上 revision', async () => {
  const settings = fakeSettings({
    provider: 'custom',
    caldavUrl: 'https://old.example/dav/',
    username: 'old-user',
    password: 'old-pass',
  });
  const probes = [];
  const backend = new CalendarSettingsBackend({
    config: {},
    settings,
    probeFactory: async (config) => { probes.push(config); return { count: 3, sample: ['评审会', '站会'] }; },
  });
  const res = makeRes();
  await backend.handle(makeReq({
    body: {
      action: 'saveConnection',
      provider: 'icloud',
      caldavUrl: 'https://caldav.icloud.com/1/calendars/home/',
      username: 'me@icloud.com',
      password: 'app-pass',
    },
  }), res);
  assert.equal(res.state.status, 200, JSON.stringify(res.state.body));
  assert.equal(settings.state.writes.length, 1, '保存成功 = 恰好写一次');
  const written = settings.state.writes[0];
  assert.equal(written.revision, 7, '带上读到的 revision，冲突交给宿主判定');
  assert.equal(written.value.provider, 'icloud');
  assert.equal(written.value.password, 'app-pass');
  assert.equal(probes.length, 1, '默认先测一次');
  assert.equal(probes[0].caldavUrl, 'https://caldav.icloud.com/1/calendars/home/', '测的就是即将保存的那份配置');
  assert.equal(res.state.body.value.saved, true);
  assert.equal(res.state.body.value.probe.count, 3);
  assert.equal(/app-pass/.test(res.state.raw), false, '响应不回显刚保存的密码');
});

test('保存时留空密钥＝沿用已存的那一份（面板不用把密码回填到前端）', async () => {
  const settings = fakeSettings({
    provider: 'custom',
    caldavUrl: 'https://old.example/dav/',
    username: 'me',
    password: 'stored-pass',
  });
  const backend = new CalendarSettingsBackend({ config: {}, settings, probeFactory: async () => ({ count: 0, sample: [] }) });
  const res = makeRes();
  await backend.handle(makeReq({
    body: { action: 'saveConnection', provider: 'custom', caldavUrl: 'https://new.example/dav/', username: 'me' },
  }), res);
  assert.equal(res.state.status, 200, JSON.stringify(res.state.body));
  assert.equal(settings.state.writes[0].value.password, 'stored-pass', '没填就不动它');
  assert.equal(settings.state.writes[0].value.caldavUrl, 'https://new.example/dav/');
});

test('连接测试失败 → 不落盘，并把服务器原话带回面板', async () => {
  const settings = fakeSettings({ provider: 'custom', caldavUrl: 'https://old.example/dav/', username: 'me', password: 'p' });
  const backend = new CalendarSettingsBackend({
    config: {},
    settings,
    probeFactory: async () => { throw new Error('401 Unauthorized：账号或应用专用密码不对'); },
  });
  const res = makeRes();
  await backend.handle(makeReq({ body: { action: 'saveConnection', provider: 'custom', caldavUrl: 'https://bad.example/dav/', username: 'me', password: 'x' } }), res);
  assert.equal(res.state.status, 400);
  assert.match(res.state.body.error.message, /401 Unauthorized/);
  assert.equal(settings.state.writes.length, 0, '连不上就不该写进 settings');
});

test('testConnection 只试不存，并回报读到的条目数', async () => {
  const settings = fakeSettings({}, 3);
  const backend = new CalendarSettingsBackend({
    config: {},
    settings,
    probeFactory: async () => ({ count: 5, sample: ['A', 'B', 'C'] }),
  });
  const res = makeRes();
  await backend.handle(makeReq({ body: { action: 'testConnection', provider: 'custom', caldavUrl: 'https://x.example/dav/', username: 'me', password: 'p' } }), res);
  assert.equal(res.state.status, 200);
  assert.equal(res.state.body.value.ok, true);
  assert.equal(res.state.body.value.count, 5);
  assert.deepEqual(res.state.body.value.sample, ['A', 'B', 'C']);
  assert.equal(settings.state.writes.length, 0, '测试连接不写盘');
});

test('没有 settings 服务时保存要明确拒绝（面板据此禁用按钮）', async () => {
  const backend = new CalendarSettingsBackend({ config: {}, probeFactory: async () => ({ count: 0, sample: [] }) });
  const res = makeRes();
  await backend.handle(makeReq({ body: { action: 'saveConnection', provider: 'custom', caldavUrl: 'https://x.example/dav/', username: 'me', password: 'p' } }), res);
  assert.equal(res.state.status, 400);
  assert.match(res.state.body.error.message, /settings 服务不可用/);
  const status = makeRes();
  await backend.handle(makeReq({ body: { action: 'connection' } }), status);
  assert.equal(status.state.body.value.settingsAvailable, false);
});

test('settings 投影：schema 默认值不覆盖 cordis.patch.yml 的配置', () => {
  const base = toSettingsBase({ provider: 'icloud', caldavUrl: 'https://caldav.icloud.com/1/calendars/home/', username: 'me@icloud.com', password: 'p' });
  assert.deepEqual(base, { provider: 'icloud', caldavUrl: 'https://caldav.icloud.com/1/calendars/home/', username: 'me@icloud.com', password: 'p' });
  assert.deepEqual(toSettingsBase(undefined), {});
  // 用户只改过 provider：其余字段必须缺席（缺席 = 交给 YAML 兜底）。
  const partial = toCalendarConfig({ provider: 'custom', caldavUrl: '', username: '' }, { provider: 'custom' });
  assert.deepEqual(partial, { provider: 'custom' });
  // 草稿路径（null）= 全量投影，且空串仍然表示「没设置」。
  const full = toCalendarConfig({ provider: 'custom', caldavUrl: 'https://x/dav/', username: '', password: '' }, null);
  assert.deepEqual(full, { provider: 'custom', caldavUrl: 'https://x/dav/' });
});

test('写入校验：Google 必须 OAuth 且四件套齐全，地址必须是 http(s)', () => {
  assert.throws(() => validateSettingsValue({ provider: 'nope' }), /未知的日历服务商/);
  assert.throws(() => validateSettingsValue({ provider: 'google', authMethod: 'basic', calendarId: 'me@gmail.com' }), /不接受 Basic/);
  assert.throws(() => validateSettingsValue({ provider: 'google' }), /日历 ID/);
  assert.throws(() => validateSettingsValue({ provider: 'google', calendarId: 'me@gmail.com', clientId: 'c' }), /clientSecret/);
  assert.throws(() => validateSettingsValue({ provider: 'custom', caldavUrl: 'ftp://x' }), /http:\/\/ 或 https:\/\//);
  assert.throws(() => validateSettingsValue({ provider: 'nextcloud', host: 'https://c.example' }), /user/);
  assert.throws(() => validateSettingsValue({ provider: 'icloud' }), /日历集合 URL/);
  // 合法的一份不该抛
  validateSettingsValue({ provider: 'icloud', caldavUrl: 'https://caldav.icloud.com/1/calendars/home/', username: 'me@icloud.com', password: 'p' });
  validateSettingsValue(undefined);
});

test('面板里有连接设置表单，且密钥一律留空靠 placeholder 说明', async () => {
  const fs = await import('node:fs');
  const source = fs.readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');
  assert.match(source, /api\("saveConnection"/, '保存走 saveConnection');
  assert.match(source, /api\("testConnection"/, '测试连接走 testConnection');
  assert.match(source, /"conn\.keep"/, '已存的密钥用「已保存，留空不改」提示，不回填');
  assert.match(source, /PROVIDER_FIELDS/, '每个服务商一套字段');
  assert.match(source, /type: secret \? "password" : "text"/, '密钥输入框是 password 类型');
});

// ───────────────────────────── 懒接入 settings（回归） ─────────────────────────────

/** 模仿宿主 settings provider 的行为：注册返回 scope，describe 给出带值的描述符。 */
function fakeProvider(options = {}) {
  const state = { value: Object.assign({}, options.value), revision: 4, registered: [], replaced: [], describeCalls: 0 };
  const provider = {
    state,
    register(ns, schema, registerOptions) {
      if (options.alreadyRegistered === true) throw new Error('settings namespace "' + ns + '" is already registered');
      state.registered.push({ ns, registerOptions });
      return {
        get: () => state.value,
        watch: () => () => {},
        update: async () => {},
        replace: async (section) => { state.value = Object.assign({}, section); state.revision += 1 },
      };
    },
    describe() {
      state.describeCalls += 1;
      return [{ ns: 'dsh-calendar', value: Object.assign({}, state.value), user: Object.assign({}, state.value), revision: state.revision, applies: 'live' }];
    },
    async replace(ns, section, revision) {
      state.replaced.push({ ns, section: Object.assign({}, section), revision });
      state.value = Object.assign({}, section);
      state.revision += 1;
    },
  };
  return provider;
}

test('backend 能搭上既有注册：ctx.get(settings) 一到就能读能写', async () => {
  const provider = fakeProvider({});
  const seen = [];
  const backend = new CalendarSettingsBackend({
    config: {},
    ctx: { get: (name) => (name === 'settings' ? provider : undefined) },
    settingsBase: { provider: 'custom' },
    onSettings: (value) => seen.push(value),
    probeFactory: async () => ({ count: 2, sample: ['评审会'] }),
  });
  // 第一个请求之前什么都没接上
  const before = makeRes();
  await backend.handle(makeReq({ body: { action: 'connection' } }), before);
  assert.equal(before.state.body.value.settingsAvailable, true, '第一次请求就该把 settings 接上');
  assert.equal(provider.state.registered.length, 0, '注册是 index.ts 在插件加载时做的（宿主的 register 需要活动作用域），backend 只负责搭车');

  const saved = makeRes();
  await backend.handle(makeReq({
    body: { action: 'saveConnection', provider: 'icloud', caldavUrl: 'https://caldav.icloud.com/1/calendars/home/', username: 'me@icloud.com', password: 'app-pass' },
  }), saved);
  assert.equal(saved.state.status, 200, JSON.stringify(saved.state.body));
  assert.equal(provider.state.replaced.length, 1);
  assert.equal(provider.state.replaced[0].revision, 4, '写入带上读到的 revision');
  assert.equal(provider.state.replaced[0].section.provider, 'icloud');
  assert.equal(seen.length >= 1, true, '保存后要把新值回调出去（工具层据此立刻生效）');
});

test('命名空间已被注册（重复 apply 的第二个实例）→ 搭上去继续用，而不是整块失效', async () => {
  const provider = fakeProvider({
    alreadyRegistered: true,
    value: { provider: 'nextcloud', host: 'https://cloud.example', user: 'me', username: 'me', calendar: 'personal', password: 'stored' },
  });
  const backend = new CalendarSettingsBackend({
    config: {},
    ctx: { get: () => provider },
    probeFactory: async () => ({ count: 1, sample: ['站会'] }),
  });
  const res = makeRes();
  await backend.handle(makeReq({ body: { action: 'connection' } }), res);
  assert.equal(res.state.status, 200);
  assert.equal(res.state.body.value.settingsAvailable, true, 'register 抛异常不等于面板只读');
  assert.equal(res.state.body.value.configured, true, '值从 describe() 的描述符里读出来');
  assert.equal(res.state.body.value.provider, 'nextcloud');
  assert.equal(res.state.body.value.hasPassword, true);
  assert.equal(/stored/.test(res.state.raw), false, '描述符里的密码也不能回显');

  const saved = makeRes();
  await backend.handle(makeReq({ body: { action: 'saveConnection', provider: 'nextcloud', host: 'https://cloud.example', user: 'me', username: 'me', calendar: 'work' } }), saved);
  assert.equal(saved.state.status, 200, JSON.stringify(saved.state.body));
  assert.equal(provider.state.replaced[0].section.password, 'stored', '没填的密码沿用描述符里的那份');
  assert.equal(provider.state.replaced[0].section.calendar, 'work');
});

test('拿不到 settings 服务时依旧只读，且不抛错', async () => {
  const backend = new CalendarSettingsBackend({ config: {}, ctx: { get: () => undefined }, probeFactory: async () => ({ count: 0, sample: [] }) });
  const res = makeRes();
  await backend.handle(makeReq({ body: { action: 'connection' } }), res);
  assert.equal(res.state.status, 200);
  assert.equal(res.state.body.value.settingsAvailable, false);
});

test('连接设置旁边有提示与跳转（字段级小字 + 分步说明 + 外链）', async () => {
  const fs = await import('node:fs');
  const source = fs.readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');
  assert.match(source, /FIELD_HINT/, '每个字段的字段级提示表');
  assert.match(source, /"hint\.caldavUrl\.icloud"/, 'iCloud 的 URL 提示');
  assert.match(source, /"hint\.password\.icloud".*App 专用密码/, 'iCloud 的密码必须是 App 专用密码');
  assert.match(source, /"steps\.google": \[/, 'Google 的分步说明');
  assert.match(source, /developers\.google\.com\/oauthplayground/, 'OAuth Playground 跳转');
  assert.match(source, /console\.cloud\.google\.com/, 'Google Cloud 凭据页跳转');
  assert.match(source, /appleid\.apple\.com/, 'Apple ID 跳转');
  assert.match(source, /nextcloud: \["host", "user", "username"/, 'Nextcloud 必须同时有 user 与 username（否则 resolveConfig 报未配置 username）');
  assert.match(source, /target: "_blank", rel: "noreferrer"/, '外链新窗口打开且不带 referrer');
});

// ───────────────────────────── 注册时机（插件加载时同步注册） ─────────────────────────────

test('attachSettings：在插件加载阶段同步注册命名空间，base 来自 cordis.patch.yml', () => {
  const provider = fakeProvider({});
  const ctx = { get: (name) => (name === 'settings' ? provider : undefined) };
  const { face } = attachSettings(ctx, { provider: 'icloud', username: 'me@icloud.com', password: 'p' });
  assert.ok(face, '要拿到读写面');
  assert.equal(face.kind, 'settings', '有 settings 服务时走命名空间');
  assert.equal(provider.state.registered.length, 1, '注册恰好一次');
  assert.equal(provider.state.registered[0].ns, 'dsh-calendar');
  assert.deepEqual(provider.state.registered[0].registerOptions.base, { provider: 'icloud', username: 'me@icloud.com', password: 'p' });
  assert.equal(provider.state.registered[0].registerOptions.applies, 'live');
  assert.equal(typeof provider.state.registered[0].registerOptions.validate, 'function');
  // 校验函数就是 settings 模块那一套
  assert.throws(() => provider.state.registered[0].registerOptions.validate({ provider: 'nope' }), /未知的日历服务商/);
  assert.deepEqual(face.read(), {}, '还没写过时读到空对象');
  assert.equal(face.descriptor().revision, 4);
});

test('attachSettings：注册抛错（已被注册）时不炸，改为搭既有注册，并打出原因', () => {
  const provider = fakeProvider({ alreadyRegistered: true, value: { provider: 'custom', caldavUrl: 'https://x/dav/', username: 'me', password: 'p' } });
  const warnings = [];
  const original = console.warn;
  console.warn = (...args) => { warnings.push(args.join(' ')); };
  try {
    const { face } = attachSettings({ get: () => provider }, {});
    assert.ok(face, '搭既有注册也要给出读写面');
    assert.equal(face.kind, 'settings');
    assert.equal(face.read().provider, 'custom', '值从 describe() 描述符来');
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /settings 命名空间注册失败/);
  } finally {
    console.warn = original;
  }
});

// ───────────────────────────── 兜底存储（宿主 settings 不可用时） ─────────────────────────────

test('兜底文件：读写往返、坏文件当空、revision 递增、目录自动建', async (t) => {
  const home = mkdtempSync(join(tmpdir(), 'dsh-calendar-store-'));
  t.after(() => rmSync(home, { recursive: true, force: true }));
  const file = join(home, 'data', 'dsh-calendar', 'connection.json');
  assert.deepEqual(readConnectionFile(file), { revision: 0, value: {} }, '不存在就是空配置');
  writeConnectionFile({ revision: 1, value: { provider: 'google', refreshToken: 'rt' } }, file);
  assert.deepEqual(readConnectionFile(file), { revision: 1, value: { provider: 'google', refreshToken: 'rt' } });
  writeFileSync(file, '{ not json');
  assert.deepEqual(readConnectionFile(file), { revision: 0, value: {} }, '坏文件不能把面板拖垮');
  writeFileSync(file, JSON.stringify({ revision: 'x', value: [] }));
  assert.deepEqual(readConnectionFile(file), { revision: 0, value: {} }, '形状不对也当空');
});

test('attachSettings：拿不到 settings 服务时退到兜底文件（面板照常能保存）', async (t) => {
  const home = mkdtempSync(join(tmpdir(), 'dsh-calendar-fallback-'));
  t.after(() => rmSync(home, { recursive: true, force: true }));
  const originalHome = process.env.DSH_HOME;
  process.env.DSH_HOME = home;
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (...args) => { warnings.push(args.join(' ')); };
  try {
    const attached = attachSettings({ get: () => undefined }, {});
    assert.equal(attached.face.kind, 'file');
    assert.match(attached.reason, /未注入宿主 settings 服务/);
    assert.match(warnings[0], /连接配置改存插件自己的文件/);
    // 走一次完整保存：应该落到文件里，并能在下一次读回来
    const backend = new CalendarSettingsBackend({
      config: {},
      settings: attached.face,
      probeFactory: async () => ({ count: 0, sample: [] }),
    });
    const saved = makeRes();
    await backend.handle(makeReq({ body: { action: 'saveConnection', provider: 'custom', caldavUrl: 'https://x.example/dav/', username: 'me', password: 'p' } }), saved);
    assert.equal(saved.state.status, 200, JSON.stringify(saved.state.body));
    assert.equal(saved.state.body.value.connection.settingsKind, 'file');
    const stored = readConnectionFile(join(home, 'data', 'dsh-calendar', 'connection.json'));
    assert.equal(stored.value.username, 'me');
    assert.equal(stored.value.caldavUrl, 'https://x.example/dav/');
    assert.equal(stored.revision, 1, 'revision 递增，下一次写入据此');
    // 读回来能直接当配置用
    const again = attachSettings({ get: () => undefined }, {});
    assert.equal(again.face.read().username, 'me');
  } finally {
    console.warn = originalWarn;
    if (originalHome === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = originalHome;
  }
});

test('attachSettings：注册失败且没人注册过 → 也退到兜底文件（不再写进一个不存在的命名空间）', async (t) => {
  const home = mkdtempSync(join(tmpdir(), 'dsh-calendar-regfail-'));
  t.after(() => rmSync(home, { recursive: true, force: true }));
  const originalHome = process.env.DSH_HOME;
  process.env.DSH_HOME = home;
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    const provider = {
      register() { throw new Error('schema rejected') },
      describe() { return [] },
      async replace() { throw new Error('settings namespace "dsh-calendar" is not registered') },
    };
    const attached = attachSettings({ get: () => provider }, {});
    assert.equal(attached.face.kind, 'file', '注册失败 + 没人注册 = 不能往那儿写');
    assert.match(attached.reason, /settings 命名空间注册失败/);
  } finally {
    console.warn = originalWarn;
    if (originalHome === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = originalHome;
  }
});

test('月视图的格子不是 button —— 芯片是按钮，按钮不能套按钮', async () => {
  const fs = await import('node:fs');
  const source = fs.readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');
  const start = source.indexOf('function MonthView');
  const end = source.indexOf('function WeekView');
  assert.ok(start > 0 && end > start, '要能定位到 MonthView');
  const monthView = source.slice(start, end);
  assert.equal(/h\("button"/.test(monthView), false, '月视图里不该出现 button：格子是容器，芯片才是按钮（嵌套会被浏览器拆开，芯片跑出网格）');
  assert.match(monthView, /h\("div", \{\n\s*key: key,\n\s*role: "button"/, '格子改用 div + role=button，键盘仍可操作');
  assert.match(monthView, /onKeyDown/, '键盘要能触发新建');
});
