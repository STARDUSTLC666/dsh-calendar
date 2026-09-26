/**
 * Harness 0.1.7 的设置接口：entry 的 Config 就是设置项，插件不再注册命名空间。
 *
 * 这一层是 0.8.x 的真实回归 —— 那时插件只会 `ctx.settings.register(...)`，
 * 在 0.1.7 上直接抛 `ctx.settings.register is not a function`，整个插件挂载失败。
 * 全部用假宿主，不联网、不碰真实日历、不打印凭据。
 */
import test from 'node:test';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { Config, liveConfig } from '../lib/host-config.js';
import { entryIdOf, importLegacySettings, isFormsProvider, isLegacyProvider, settingsProviderOf } from '../lib/host-settings.js';
import { attachSettings, apply } from '../lib/index.js';
import { CalendarSettingsBackend, SETTINGS_ROUTE, hostFormsFaceOf } from '../lib/web.js';

const CONNECTION_FIELDS = ['provider', 'caldavUrl', 'username', 'password', 'host', 'user', 'calendar', 'calendarId', 'authMethod', 'clientId', 'clientSecret', 'refreshToken', 'tokenUrl', 'proxyUrl'];
const SECRETS = ['password', 'clientSecret', 'refreshToken'];

/** 假宿主：0.1.7 的 SettingsForms 形态（有 describe/update/replace/mutate，没有 register）。 */
function formsProvider(options = {}) {
  const state = {
    revision: options.revision ?? 7,
    rows: options.rows ?? [{ ns: options.entryId ?? 'calendar', value: {}, user: {}, revision: options.revision ?? 7, applies: 'live', autoGenerate: false }],
    mutated: [],
    replaced: [],
    updated: [],
    configured: [],
  };
  const provider = {
    state,
    describe: () => state.rows,
    async update(ns, patch, revision) { state.updated.push({ ns, patch, revision }); },
    async replace(ns, section, revision) { state.replaced.push({ ns, section, revision }); },
    async mutate(ns, ops, revision) { state.mutated.push({ ns, ops, revision }); },
    configure(presentation, owner) { state.configured.push({ presentation, owner }); return () => {}; },
    get writable() { return true; },
  };
  if (options.mutate === false) delete provider.mutate;
  return provider;
}

/** 假 ctx：只带这套代码真的会碰的成员。 */
function formsCtx(provider, options = {}) {
  const registered = [];
  const routes = [];
  const fiber = { entry: { options: { id: options.entryId ?? 'calendar' } } };
  const child = {
    settings: provider,
    appReady: { onReady: (fn) => { fn(); return () => {}; } },
    // 面板路由要挂到宿主 webserver 上；这里给个只记录的最小替身。
    webServer: { register: (route) => { routes.push(route); return () => {}; } },
    effect: (fn) => { fn(); return () => {}; },
    fiber,
  };
  return {
    registered,
    routes,
    fiber,
    get: (name) => (name === 'settings' ? provider : undefined),
    tools: { register(definition) { registered.push(definition); return () => {}; } },
    on: () => () => {},
    inject: (services, callback) => { if (options.noInject !== true) callback(child); },
  };
}

function makeReq(body) {
  const chunks = [Buffer.from(JSON.stringify(body))];
  return {
    method: 'POST',
    headers: { host: 'localhost:3080', 'content-type': 'application/json' },
    socket: { remoteAddress: '127.0.0.1' },
    async *[Symbol.asyncIterator]() { for (const chunk of chunks) yield chunk; },
  };
}

function makeRes() {
  const state = { status: 0, body: undefined };
  return { state, writeHead(status) { state.status = status; }, end(text) { state.body = JSON.parse(text); } };
}

test('Config：连接字段全部 volatile，三个凭据标 secret，且不给默认值', () => {
  const json = Config.toJSON();
  const refs = json.refs;
  const root = refs[json.uid];
  assert.equal(root.type, 'object');
  for (const field of [...CONNECTION_FIELDS, 'legacySettingsImported']) {
    const node = refs[root.dict[field]];
    assert.ok(node, field + ' 要在 Config 里');
    assert.equal(node.meta.volatile, true, field + ' 要能在设置页改完就生效（volatile）');
    assert.equal(node.meta.default, undefined, field + ' 不能带默认值：默认值会盖掉 cordis.patch.yml 与 provider 预设');
  }
  for (const field of SECRETS) {
    assert.equal(refs[root.dict[field]].meta.role, 'secret', field + ' 要按凭据处理（不回传、不进日志）');
  }
  assert.equal(refs[root.dict.provider].meta.role, undefined, 'provider 不是凭据');
});

test('liveConfig：活引用摊平成值，老宿主的字面量原样通过', () => {
  let current = 'icloud';
  const live = liveConfig({ provider: { get: () => current }, username: 'me@icloud.com' });
  assert.equal(live.provider, 'icloud');
  assert.equal(live.username, 'me@icloud.com');
  current = 'nextcloud';
  assert.equal(live.provider, 'nextcloud', '每次读都取当前值：设置页改完工具立刻用得上');
  const plain = liveConfig({ provider: 'custom' });
  assert.equal(plain.provider, 'custom');
});

test('宿主形态判定：0.1.7 是 forms，0.1.6 是 legacy，两个都没有就退化', () => {
  assert.equal(isFormsProvider(formsProvider()), true);
  assert.equal(isLegacyProvider(formsProvider()), false);
  const legacy = { register: () => ({}), replace: async () => {} };
  assert.equal(isLegacyProvider(legacy), true);
  assert.equal(isFormsProvider(legacy), false);
  assert.equal(settingsProviderOf({ get: () => undefined, settings: undefined }), undefined);
  assert.equal(entryIdOf({ fiber: { entry: { options: { id: 'my-calendar' } } } }, 'calendar'), 'my-calendar');
  assert.equal(entryIdOf({}, 'calendar'), 'calendar');
});

test('attachSettings：0.1.7 宿主按 entry id 接表单，读活配置、写走 mutate', async () => {
  const provider = formsProvider({ revision: 7 });
  const ctx = formsCtx(provider);
  const attached = attachSettings(ctx, liveConfig({ provider: 'icloud', username: 'me@icloud.com', password: 'app-pass' }));
  assert.equal(attached.reason, undefined, '接上宿主表单就不该有退化原因');
  assert.equal(attached.ns, 'calendar', '表单以 entry id 为 ns');
  assert.equal(attached.face.kind, 'settings');
  assert.deepEqual(attached.face.read(), { provider: 'icloud', username: 'me@icloud.com', password: 'app-pass' }, '只投影真的设过的字段');
  assert.equal(attached.face.descriptor().revision, 7);

  await attached.face.replace({ provider: 'icloud', username: 'me@icloud.com' }, 7);
  assert.equal(provider.state.replaced.length, 0, '有 mutate 就不用 replace：replace 会把面板不认识的 live 字段一起重置');
  assert.equal(provider.state.mutated.length, 1);
  const call = provider.state.mutated[0];
  assert.equal(call.ns, 'calendar');
  assert.equal(call.revision, 7, '带上读到的 revision（乐观并发）');
  const ops = Object.fromEntries(call.ops.map((op) => [op.path[0], op]));
  assert.deepEqual(ops.provider, { op: 'set', path: ['provider'], value: 'icloud' });
  assert.deepEqual(ops.password, { op: 'unset', path: ['password'] }, '草稿里没有的字段要显式清掉，否则删掉的凭据会留着');
  assert.equal(call.ops.length, CONNECTION_FIELDS.length, '每个连接字段都有一条 op');
});

test('attachSettings：宿主没有 mutate 时退回 replace，并带上一次性搬迁标记', async () => {
  const provider = formsProvider({ mutate: false });
  const attached = attachSettings(formsCtx(provider), liveConfig({ provider: 'custom', legacySettingsImported: true }));
  await attached.face.replace({ provider: 'nextcloud' }, 7);
  assert.equal(provider.state.mutated.length, 0);
  assert.equal(provider.state.replaced.length, 1);
  assert.equal(provider.state.replaced[0].section.legacySettingsImported, true, '标记不能被 replace 抹掉，否则下次启动又搬一遍老 settings.yaml');
  assert.equal(provider.state.replaced[0].section.provider, 'nextcloud');
});

test('importLegacySettings：把老 settings.yaml 的 dsh-calendar 段补进 profile，只补空缺、只搬一次', async (t) => {
  const home = mkdtempSync(join(tmpdir(), 'dsh-calendar-legacy-'));
  t.after(() => rmSync(home, { recursive: true, force: true }));
  writeFileSync(join(home, 'settings.yaml.imported'), [
    'dsh-calendar:',
    '  provider: icloud',
    '  username: old@icloud.com',
    '  password: old-app-pass',
    'other-plugin:',
    '  token: not-mine',
    '',
  ].join('\n'));
  const provider = formsProvider();
  const ctx = formsCtx(provider);
  const fields = [...CONNECTION_FIELDS];

  const imported = await importLegacySettings(ctx, { provider: 'custom' }, 'dsh-calendar', 'calendar', fields, home);
  assert.equal(imported, true);
  assert.equal(provider.state.updated.length, 1);
  const patch = provider.state.updated[0].patch;
  assert.equal(provider.state.updated[0].ns, 'calendar');
  assert.equal(patch.username, 'old@icloud.com', '空缺字段补上');
  assert.equal(patch.password, 'old-app-pass');
  assert.equal(patch.provider, undefined, 'profile 里已经写过的值优先，不被老文件盖掉');
  assert.equal(patch.legacySettingsImported, true, '完成标记与值写在同一处');

  const again = await importLegacySettings(ctx, { provider: 'custom', legacySettingsImported: true }, 'dsh-calendar', 'calendar', fields, home);
  assert.equal(again, false, '搬过就不再搬');
  assert.equal(provider.state.updated.length, 1);

  const otherEntry = await importLegacySettings(formsCtx(formsProvider(), { entryId: 'calendar-lab' }), {}, 'dsh-calendar', 'calendar', fields, home);
  assert.equal(otherEntry, false, '自定义实例不继承全局命名空间里的凭据');
});

test('apply：0.1.7 宿主上照常注册 6 个工具，不再抛 register is not a function', (t) => {
  // 搬迁逻辑会去读 DSH_HOME 里的老 settings.yaml：测试必须与本机真实配置隔离。
  const home = mkdtempSync(join(tmpdir(), 'dsh-calendar-apply-'));
  t.after(() => rmSync(home, { recursive: true, force: true }));
  const originalHome = process.env.DSH_HOME;
  process.env.DSH_HOME = home;
  t.after(() => { if (originalHome === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = originalHome; });

  const provider = formsProvider();
  const ctx = formsCtx(provider);
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (message) => warnings.push(String(message));
  try {
    apply(ctx, { provider: 'icloud', username: 'me@icloud.com', password: 'app-pass', caldavUrl: 'https://caldav.icloud.com/1/calendars/home/' });
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(ctx.registered.length, 6);
  assert.equal(ctx.routes.length, 1, '面板路由照常挂上');
  assert.equal(ctx.routes[0].path, SETTINGS_ROUTE);
  assert.equal(provider.state.configured.length, 1, '自带设置页要登记 auto:false，宿主才不会再生成一页');
  assert.equal(provider.state.configured[0].presentation.auto, false);
  assert.deepEqual(warnings, [], '接上宿主表单时不该有退化告警：' + JSON.stringify(warnings));
});

test('面板保存：0.1.7 宿主上 saveConnection 逐字段落进 profile，摘要照常回显', async () => {
  const provider = formsProvider({ revision: 3 });
  const ctx = formsCtx(provider);
  const attached = attachSettings(ctx, liveConfig({ provider: 'custom' }));
  const backend = new CalendarSettingsBackend({
    config: () => ({ provider: 'custom' }),
    ctx,
    settings: attached.face,
    settingsNs: attached.ns,
    probeFactory: async () => ({ count: 2, sample: ['评审会'] }),
  });

  const status = makeRes();
  await backend.handle(makeReq({ action: 'connection' }), status);
  assert.equal(status.state.body.ok, true);
  assert.equal(status.state.body.value.settingsAvailable, true);
  assert.equal(status.state.body.value.settingsKind, 'settings');
  assert.equal(status.state.body.value.revision, 3);

  const saved = makeRes();
  await backend.handle(makeReq({
    action: 'saveConnection', provider: 'icloud', caldavUrl: 'https://caldav.icloud.com/1/calendars/home/', username: 'me@icloud.com', password: 'app-pass',
  }), saved);
  assert.equal(saved.state.status, 200, JSON.stringify(saved.state.body));
  assert.equal(saved.state.body.value.saved, true);
  assert.equal(provider.state.mutated.length, 1);
  const ops = Object.fromEntries(provider.state.mutated[0].ops.map((op) => [op.path[0], op]));
  assert.equal(ops.provider.value, 'icloud');
  assert.equal(ops.password.value, 'app-pass');
  assert.equal(provider.state.mutated[0].revision, 3, '写入带上读到的 revision');
});

test('hostFormsFaceOf：宿主没有 describe 也不炸（读活配置不依赖描述符）', async () => {
  const provider = { async mutate() {}, async replace() {} };
  const face = hostFormsFaceOf(provider, 'calendar', () => ({ provider: 'custom' }));
  assert.deepEqual(face.read(), { provider: 'custom' });
  assert.equal(face.descriptor(), undefined);
});
