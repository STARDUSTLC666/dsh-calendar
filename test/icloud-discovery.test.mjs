import assert from 'node:assert/strict';
import test from 'node:test';
import { discoverICloud } from '../lib/icloud.js';

const globalRoot = 'https://caldav.icloud.com/';
const cnRoot = 'https://caldav.icloud.com.cn/';
const shard = 'https://p220-caldav.icloud.com.cn';
const fixtures = { username: 'calendar@example.test', password: 'fixture-app-password' };
const response = (href, props) => '<d:response><d:href>' + href + '</d:href><d:propstat><d:prop>' + props
  + '</d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response>';
const xml = (...rows) => new Response(
  '<?xml version="1.0"?><d:multistatus xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">'
  + rows.join('') + '</d:multistatus>',
  { status: 207, headers: { 'content-type': 'application/xml' } },
);
const resource = (href, name, component) => response(href, '<d:displayname>' + name + '</d:displayname>'
  + '<d:resourcetype><d:collection/><c:calendar/></d:resourcetype>'
  + '<c:supported-calendar-component-set><c:comp name="' + component + '"/></c:supported-calendar-component-set>');

test('read-only discovery falls back to the China endpoint, follows the Apple shard, and selects event collections', async t => {
  const visited = [];
  t.mock.method(globalThis, 'fetch', async (input, options) => {
    visited.push(input);
    const headers = new Headers(options.headers);
    assert.equal(options.method, 'PROPFIND');
    assert.equal(options.redirect, 'manual');
    assert.ok(headers.has('authorization'));
    if (input === globalRoot) return new Response('', { status: 401 });
    if (input === cnRoot) return new Response(null, { status: 302, headers: { location: shard + '/' } });
    if (input === shard + '/') return xml(response('/', '<d:current-user-principal><d:href>/123/principal/</d:href></d:current-user-principal>'));
    if (input === shard + '/123/principal/') return xml(response('/123/principal/', '<c:calendar-home-set><d:href>/123/calendars/</d:href></c:calendar-home-set>'));
    assert.equal(input, shard + '/123/calendars/');
    assert.equal(headers.get('depth'), '1');
    return xml(
      resource('/123/calendars/work/', 'Work &amp; School', 'VEVENT'),
      resource('/123/calendars/tasks/', 'Tasks', 'VTODO'),
      resource('https://example.test/123/calendars/evil/', 'External', 'VEVENT'),
    );
  });
  const calendars = await discoverICloud(fixtures, {});
  assert.deepEqual(calendars, [{ url: shard + '/123/calendars/work/', name: 'Work & School' }]);
  assert.deepEqual(visited, [globalRoot, cnRoot, shard + '/', shard + '/123/principal/', shard + '/123/calendars/']);
});

test('discovery never forwards credentials to an untrusted redirect or principal', async t => {
  for (const malicious of [
    () => new Response(null, { status: 302, headers: { location: 'https://example.test/steal' } }),
    () => xml(response('/', '<d:current-user-principal><d:href>https://caldav.icloud.com.example.test/</d:href></d:current-user-principal>')),
  ]) {
    const fetcher = t.mock.method(globalThis, 'fetch', async input => {
      assert.equal(input, globalRoot);
      return malicious();
    });
    await assert.rejects(discoverICloud(fixtures, {}), /不受信任/);
    assert.equal(fetcher.mock.callCount(), 1);
    fetcher.mock.restore();
  }
});
