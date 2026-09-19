/**
 * Google OAuth 换取脚本：授权地址、code 换 token、参数解析。
 *
 * 令牌端点用本地假服务器替换（--token-url），回调也走本机回环：
 * 这条测试不碰 Google，也不会打开任何浏览器。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { buildAuthUrl, exchangeCode, parseArgs, runFlow, SCOPE_FULL, SCOPE_READONLY, AUTH_URL } from '../scripts/google-oauth.mjs';

test('授权地址带 offline + consent，否则拿不到 refresh token', () => {
  const url = new URL(buildAuthUrl({ clientId: 'cid', redirectUri: 'http://127.0.0.1:1234/', scope: SCOPE_FULL }));
  assert.equal(url.origin + url.pathname, AUTH_URL);
  assert.equal(url.searchParams.get('client_id'), 'cid');
  assert.equal(url.searchParams.get('redirect_uri'), 'http://127.0.0.1:1234/');
  assert.equal(url.searchParams.get('response_type'), 'code');
  assert.equal(url.searchParams.get('access_type'), 'offline');
  assert.equal(url.searchParams.get('prompt'), 'consent');
  assert.equal(url.searchParams.get('scope'), SCOPE_FULL);
});

test('参数解析：命令行优先于环境变量，scope 支持只读', () => {
  const env = { DSH_CALENDAR_CLIENT_ID: 'env-id', DSH_CALENDAR_CLIENT_SECRET: 'env-secret' };
  const defaults = parseArgs([], env);
  assert.equal(defaults.clientId, 'env-id');
  assert.equal(defaults.clientSecret, 'env-secret');
  assert.equal(defaults.scope, SCOPE_FULL);
  assert.equal(defaults.open, true);

  const cli = parseArgs(['--client-id', 'cli-id', '--client-secret', 'cli-secret', '--scope', 'calendar.readonly', '--no-open', '--timeout', '12', '--port', '3210'], env);
  assert.equal(cli.clientId, 'cli-id');
  assert.equal(cli.clientSecret, 'cli-secret');
  assert.equal(cli.scope, SCOPE_READONLY);
  assert.equal(cli.open, false);
  assert.equal(cli.timeoutSeconds, 12);
  assert.equal(cli.port, 3210);
});

test('code 换 token：成功拿到 refresh_token，失败带上 Google 的原话', async (t) => {
  const requests = [];
  const server = createServer((request, response) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk });
    request.on('end', () => {
      requests.push({ url: request.url, contentType: request.headers['content-type'], body });
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ refresh_token: 'rt-abc', scope: SCOPE_FULL, access_token: 'at-1' }));
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const tokenUrl = 'http://127.0.0.1:' + server.address().port + '/token';

  const payload = await exchangeCode({ code: 'the-code', clientId: 'cid', clientSecret: 'sec', redirectUri: 'http://127.0.0.1:9/', tokenUrl });
  assert.equal(payload.refresh_token, 'rt-abc');
  const sent = new URLSearchParams(requests[0].body);
  assert.equal(requests[0].contentType, 'application/x-www-form-urlencoded');
  assert.equal(sent.get('grant_type'), 'authorization_code');
  assert.equal(sent.get('code'), 'the-code');
  assert.equal(sent.get('client_id'), 'cid');
  assert.equal(sent.get('client_secret'), 'sec');
  assert.equal(sent.get('redirect_uri'), 'http://127.0.0.1:9/');

  // 没有 refresh_token 的响应（例如用户之前授过权但没走 consent）必须报错，而不是静默成功。
  const bad = createServer((request, response) => {
    response.writeHead(400, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ error: 'invalid_grant', error_description: 'Bad Request' }));
  });
  await new Promise((resolve) => bad.listen(0, '127.0.0.1', resolve));
  t.after(() => bad.close());
  await assert.rejects(
    () => exchangeCode({ code: 'x', clientId: 'c', clientSecret: 's', redirectUri: 'http://127.0.0.1:9/', tokenUrl: 'http://127.0.0.1:' + bad.address().port + '/token' }),
    /HTTP 400.*Bad Request/
  );
});

test('完整流程：本地回调收到 code 后换成 token', async (t) => {
  const tokenServer = createServer((request, response) => {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ refresh_token: 'rt-flow', scope: SCOPE_FULL, access_token: 'at-flow' }));
  });
  await new Promise((resolve) => tokenServer.listen(0, '127.0.0.1', resolve));
  t.after(() => tokenServer.close());

  // 抓 stdout 里的授权 URL，从而拿到随机端口（脚本自己选端口时也得能对上）。
  const logged = [];
  const original = console.log;
  console.log = (...args) => { logged.push(args.join(' ')); };
  const flow = runFlow({
    clientId: 'cid',
    clientSecret: 'sec',
    scope: SCOPE_FULL,
    port: 0,
    open: false,
    timeoutSeconds: 10,
    tokenUrl: 'http://127.0.0.1:' + tokenServer.address().port + '/token',
  });
  try {
    let url;
    for (let i = 0; i < 50 && url === undefined; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      const line = logged.find((entry) => entry.startsWith('   http'));
      if (line !== undefined) url = line.trim();
    }
    assert.ok(url, '脚本要打印授权地址');
    const parsed = new URL(url);
    const port = parsed.searchParams.get('redirect_uri').match(/:(\d+)\//)[1];

    // 模拟浏览器回跳
    const callback = await fetch('http://127.0.0.1:' + port + '/?code=the-code&scope=' + encodeURIComponent(SCOPE_FULL));
    assert.equal(callback.status, 200);
    assert.match(await callback.text(), /授权成功/);

    const result = await flow;
    assert.equal(result.refreshToken, 'rt-flow');
    assert.equal(result.accessToken, 'at-flow');
  } finally {
    console.log = original;
  }
});
