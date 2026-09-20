/**
 * 真 DOM 行为测试：jsdom + 真 React 渲染周视图，然后派发 pointer / click / keydown。
 *
 * 为什么要有这一层：纯函数测试与源码正则都测不到下面这些 ——
 *   · 组件渲染时会不会直接抛（曾把 useEffect 依赖数组写在 const data 之前，TDZ 崩掉整个面板）；
 *   · 点事件块会不会冒泡到日列的「新建日程」；
 *   · 一次拖动到底发了几次请求、Esc 有没有取消；
 *   · 组件卸载后 window 上有没有留下监听器（残留的 pointerup 会替用户改期）；
 *   · 浮层面板里横向换天是否真的生效（列矩形必须用视口坐标）。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const SOURCE = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const EXPOSE = 'module.exports.__internals = { __components: { WeekView, MonthView, CalendarPanel } };';
if (!SOURCE.includes('return module.exports;')) throw new Error('client.js 装载契约变了，本测试的注入点要跟着改');
const PATCHED = SOURCE.replace('return module.exports;', EXPOSE + '\nreturn module.exports;');

/** 每个测试一套干净的 jsdom + 真 React；顺手给 window 的监听器记账。 */
async function setup() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true, url: 'http://localhost/' });
  const win = dom.window;
  const listenerLog = [];
  const origAdd = win.addEventListener.bind(win);
  const origRemove = win.removeEventListener.bind(win);
  win.addEventListener = (type, fn, opts) => { listenerLog.push(['add', type, fn && fn.name ? fn.name : '(anon)']); return origAdd(type, fn, opts); };
  win.removeEventListener = (type, fn, opts) => { listenerLog.push(['remove', type, fn && fn.name ? fn.name : '(anon)']); return origRemove(type, fn, opts); };
  const apiCalls = [];
  win.fetch = async (url, init) => {
    apiCalls.push({ url: String(url), body: init && init.body ? JSON.parse(String(init.body)) : null });
    return { ok: true, status: 200, json: async () => ({ ok: true, value: { count: 0, start: '', end: '', events: [] } }) };
  };
  win.AbortSignal.timeout = () => undefined;
  globalThis.window = win;
  globalThis.document = win.document;
  // Node 24 的 globalThis.navigator 是只读 getter，得用 defineProperty 覆盖。
  try { Object.defineProperty(globalThis, 'navigator', { value: win.navigator, configurable: true }); } catch (error) { /* 覆盖不了也无妨：这些测试不碰 navigator */ }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const react = await import('react');
  const reactDomClient = await import('react-dom/client');
  let captured = null;
  win.__ModuleLoader__ = {
    load: (registration) => {
      captured = registration.factory((name) => {
        if (name === 'react') return react;
        if (name === 'react-dom/client') return reactDomClient;
        if (name === 'react/jsx-runtime') return {};
        throw new Error('unexpected require: ' + name);
      });
    },
  };
  new Function('window', 'document', 'navigator', PATCHED)(win, win.document, win.navigator);
  return { dom, win, react, reactDomClient, components: captured.__internals.__components, listenerLog, apiCalls };
}

/** 造一个 pointer 事件：jsdom 没有 PointerEvent，用 MouseEvent 补上我们的实现要读的字段。 */
function pointerEvent(win, type, options = {}) {
  const event = new win.MouseEvent(type, { bubbles: true, cancelable: true, clientX: options.x || 0, clientY: options.y || 0 });
  Object.defineProperty(event, 'pointerId', { value: options.pointerId === undefined ? 1 : options.pointerId });
  Object.defineProperty(event, 'buttons', { value: options.buttons === undefined ? 1 : options.buttons });
  return event;
}

/** jsdom 没有布局：给日列与滚动容器塞上「视口坐标」，模拟浮层（left 很大）或设置页。 */
function stubGeometry(container, options = {}) {
  const left = options.left === undefined ? 0 : options.left;
  const width = options.width === undefined ? 100 : options.width;
  const columns = [...container.querySelectorAll('[data-day]')];
  columns.forEach((column, index) => {
    const rect = { left: left + index * width, right: left + (index + 1) * width, top: 0, bottom: 500, width, height: 500, x: left + index * width, y: 0 };
    column.getBoundingClientRect = () => rect;
  });
  const scroller = container.querySelector('.dshc-week');
  if (scroller !== null) {
    scroller.getBoundingClientRect = () => ({ left, right: left + 7 * width, top: 0, bottom: 500, width: 7 * width, height: 500, x: left, y: 0 });
  }
  return { columns, scroller, left, width };
}

/** 一个单次日程：2026-09-19（周六）10:00–11:00，本地墙钟。 */
function sampleEvent(overrides = {}) {
  const start = new Date('2026-09-19T10:00:00');
  const end = new Date('2026-09-19T11:00:00');
  const iso = (d) => d.toISOString().replace(/\.\d{3}Z$/, 'Z');
  return Object.assign({ uid: 'uid-1', summary: '评审会', start: iso(start), end: iso(end), allDay: false }, overrides);
}

async function render(react, reactDomClient, element) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = reactDomClient.createRoot(container);
  await react.act(async () => { root.render(element); });
  return { container, root };
}

test('周视图能渲染出来（曾经因为 useEffect 依赖数组 TDZ 而每次渲染即崩）', async () => {
  const { react, reactDomClient, components } = await setup();
  const { container } = await render(react, reactDomClient, react.createElement(components.WeekView, {
    anchor: new Date('2026-09-19T00:00:00'), events: [sampleEvent()], onPick: () => {}, onCreateAt: () => {}, onReschedule: () => {},
  }));
  assert.equal(container.querySelectorAll('.dshc-slot').length, 1, '日程块要画出来');
  assert.equal(container.querySelectorAll('.dshc-daycol').length, 7, '七天都要有列');
});

test('单击事件块：只打开详情，不会顺手弹「新建日程」', async () => {
  const { react, reactDomClient, components, win } = await setup();
  const calls = { pick: 0, create: 0 };
  const { container } = await render(react, reactDomClient, react.createElement(components.WeekView, {
    anchor: new Date('2026-09-19T00:00:00'),
    events: [sampleEvent()],
    onPick: () => { calls.pick += 1; },
    onCreateAt: () => { calls.create += 1; },
    onReschedule: () => {},
  }));
  const slot = container.querySelector('.dshc-slot');
  await react.act(async () => { slot.dispatchEvent(new win.MouseEvent('click', { bubbles: true })); });
  assert.equal(calls.pick, 1, '点事件应该打开详情');
  assert.equal(calls.create, 0, '不能同时触发日列的「新建」（回归：曾经会把新建表单一起弹出来）');
});

test('拖动改期：只提交一次，落点按视口坐标换算（浮层偏移也算得对）', async () => {
  const { react, reactDomClient, components, win } = await setup();
  const moves = [];
  const { container } = await render(react, reactDomClient, react.createElement(components.WeekView, {
    anchor: new Date('2026-09-19T00:00:00'),
    events: [sampleEvent()],
    onPick: () => {},
    onCreateAt: () => {},
    onReschedule: (event, range, mode) => { moves.push({ range, mode }); },
  }));
  // 模拟浮层面板：整块网格从视口 x=600 开始
  const geometry = stubGeometry(container, { left: 600, width: 100 });
  const slot = container.querySelector('.dshc-slot');
  // 事件在周六（周一为第 0 列，周六 = 第 5 列）：从第 5 列中心拖到第 6 列中心 = 换天 +1
  const startX = geometry.left + 5 * geometry.width + geometry.width / 2;
  await react.act(async () => {
    slot.dispatchEvent(pointerEvent(win, 'pointerdown', { x: startX, y: 200 }));
    const endX = geometry.left + 6 * geometry.width + geometry.width / 2;
    win.dispatchEvent(pointerEvent(win, 'pointermove', { x: endX, y: 200 + 44 }));   // 右移一列（换天）+ 下移一小时
    win.dispatchEvent(pointerEvent(win, 'pointerup', { x: endX, y: 200 + 44 }));
  });
  assert.equal(moves.length, 1, '一次拖动只提交一次');
  const start = new Date(moves[0].range.start);
  const end = new Date(moves[0].range.end);
  assert.equal(start.getDate(), 20, '右移一列 = 换到次日');
  assert.equal(start.getHours(), 11, '下移 44px = 一小时（15 分钟吸附）');
  assert.equal((end - start) / 60000, 60, '时长不变');
});

test('拖动中按 Esc：放回原位，零请求；松手也不再提交', async () => {
  const { react, reactDomClient, components, win } = await setup();
  const moves = [];
  const { container } = await render(react, reactDomClient, react.createElement(components.WeekView, {
    anchor: new Date('2026-09-19T00:00:00'),
    events: [sampleEvent()],
    onPick: () => {},
    onCreateAt: () => {},
    onReschedule: (event, range) => { moves.push(range); },
  }));
  stubGeometry(container, { left: 0, width: 100 });
  const slot = container.querySelector('.dshc-slot');
  await react.act(async () => {
    slot.dispatchEvent(pointerEvent(win, 'pointerdown', { x: 550, y: 200 }));
    win.dispatchEvent(pointerEvent(win, 'pointermove', { x: 620, y: 300 }));
    win.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    win.dispatchEvent(pointerEvent(win, 'pointerup', { x: 620, y: 300, buttons: 0 }));
  });
  assert.equal(moves.length, 0, 'Esc 取消之后不能落盘');
});

test('卸载后 window 上不留监听器，之后的 pointerup 也不会替用户改期', async () => {
  const { react, reactDomClient, components, win, listenerLog } = await setup();
  const moves = [];
  const { container, root } = await render(react, reactDomClient, react.createElement(components.WeekView, {
    anchor: new Date('2026-09-19T00:00:00'),
    events: [sampleEvent()],
    onPick: () => {},
    onCreateAt: () => {},
    onReschedule: (event, range) => { moves.push(range); },
  }));
  stubGeometry(container, { left: 0, width: 100 });
  const slot = container.querySelector('.dshc-slot');
  await react.act(async () => {
    slot.dispatchEvent(pointerEvent(win, 'pointerdown', { x: 550, y: 200 }));
    win.dispatchEvent(pointerEvent(win, 'pointermove', { x: 620, y: 300 }));
  });
  await react.act(async () => { root.unmount(); });
  // 只看我们自己注册的那几个（React 19 也会往 window 上挂 click/focus/mouseover… 等委托监听器，别误伤）
  const mine = new Set(['onMove', 'onUp', 'onCancel', 'onKey', 'onBlur']);
  const tally = (op) => listenerLog.filter((e) => e[0] === op && mine.has(e[1])).map((e) => e[1]).sort();
  const addedList = listenerLog.filter((e) => e[0] === 'add').map((e) => e[1] + ':' + e[2]).sort();
  const removedList = listenerLog.filter((e) => e[0] === 'remove').map((e) => e[1] + ':' + e[2]).sort();
  const added = listenerLog.filter((e) => e[0] === 'add' && mine.has(e[2])).length;
  const removed = listenerLog.filter((e) => e[0] === 'remove' && mine.has(e[2])).length;
  const detail = 'add=[' + addedList.join(',') + '] remove=[' + removedList.join(',') + ']';
  assert.equal(added > 0, true, '应该注册过监听器（add=' + added + '）');
  assert.equal(removed >= added, true, '挂载时注册的监听器都要在卸载时摘掉（' + detail + '）');
  win.dispatchEvent(pointerEvent(win, 'pointerup', { x: 620, y: 300, buttons: 0 }));
  assert.equal(moves.length, 0, '卸载后的 pointerup 不能提交改期');
});

test('拖到容器下边缘：rAF 会持续滚动并重算落点', async () => {
  const { react, reactDomClient, components, win } = await setup();
  const { container } = await render(react, reactDomClient, react.createElement(components.WeekView, {
    anchor: new Date('2026-09-19T00:00:00'),
    events: [sampleEvent()],
    onPick: () => {},
    onCreateAt: () => {},
    onReschedule: () => {},
  }));
  const geometry = stubGeometry(container, { left: 0, width: 100 });
  const slot = container.querySelector('.dshc-slot');
  await react.act(async () => {
    slot.dispatchEvent(pointerEvent(win, 'pointerdown', { x: 550, y: 200 }));
    win.dispatchEvent(pointerEvent(win, 'pointermove', { x: 550, y: 495 }));   // 贴到 500 的下边缘
  });
  await new Promise((resolve) => setTimeout(resolve, 80));                     // 让 rAF 跑几帧
  assert.equal(geometry.scroller.scrollTop > 0, true, '指针停在边缘也要继续滚');
  await react.act(async () => { win.dispatchEvent(pointerEvent(win, 'pointerup', { x: 550, y: 495 })); });
});

test('重复日程：拖动被挡住（不做重锚系列起点的危险写入）', async () => {
  const { react, reactDomClient, components, win } = await setup();
  const moves = [];
  const { container } = await render(react, reactDomClient, react.createElement(components.WeekView, {
    anchor: new Date('2026-09-19T00:00:00'),
    events: [sampleEvent({ rrule: 'FREQ=WEEKLY;COUNT=4' })],
    onPick: () => {},
    onCreateAt: () => {},
    onReschedule: (event, range) => { moves.push(range); },
  }));
  stubGeometry(container, { left: 0, width: 100 });
  const slot = container.querySelector('.dshc-slot');
  await react.act(async () => {
    slot.dispatchEvent(pointerEvent(win, 'pointerdown', { x: 550, y: 200 }));
    win.dispatchEvent(pointerEvent(win, 'pointermove', { x: 550, y: 244 }));
    win.dispatchEvent(pointerEvent(win, 'pointerup', { x: 550, y: 244 }));
  });
  // WeekView 只负责把落点交给面板；「重复日程不给改」的判断在 CalendarPanel.reschedule 里，
  // 这里断言的是：拖动本身把 range 交上来了，具体拦截由面板那层做（见下面的源码级断言）。
  assert.equal(moves.length, 1);
  const inner = SOURCE.slice(SOURCE.indexOf('const reschedule ='), SOURCE.indexOf('const undoMove'));
  assert.match(inner, /if \(isRecurring\(event\)\) \{ notify\(t\("move\.recurringUnsupported"\)\); return; \}/, '面板层必须拦住重复日程');
});
