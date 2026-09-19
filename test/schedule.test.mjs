/**
 * 周视图改期的几何算法 —— 直接测发布文件 lib/client.js 里的实现（见 helpers/client-internals.mjs）。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { api as internals, source as SOURCE } from './helpers/client-internals.mjs';

const { snapMinutes, slotFromEvent, moveSlot, slotFromDrag, resizeSlot, rangeOfSlot, conflictsForSlot, isRecurring, columnIndexFromRects } = internals;

/** 本机时区下构造一个事件（测试与实现都用本地墙钟，所以这里不写 Z）。 */
function timedEvent(day, hour, minute, minutes) {
  const start = new Date(day + 'T00:00:00');
  start.setHours(hour, minute || 0, 0, 0);
  const end = new Date(start.getTime() + minutes * 60000);
  const iso = (d) => d.toISOString().replace(/\.\d{3}Z$/, 'Z');
  return { uid: 'u1', summary: '评审会', start: iso(start), end: iso(end), allDay: false };
}
test('snapMinutes：吸附到 15 分钟', () => {
  assert.equal(snapMinutes(0, 15), 0);
  assert.equal(snapMinutes(7, 15), 0);
  assert.equal(snapMinutes(8, 15), 15);
  assert.equal(snapMinutes(52, 15), 45);
  assert.equal(snapMinutes(53, 15), 60);
  assert.equal(snapMinutes(37, 30), 30);
});

test('slotFromEvent：定时事件取本地墙钟与时长，全天事件打标记', () => {
  const slot = slotFromEvent(timedEvent('2026-09-19', 10, 30, 45));
  assert.deepEqual(slot, { dayKey: '2026-09-19', minutes: 630, durationMinutes: 45, allDay: false });
  const allDay = slotFromEvent({ uid: 'a', summary: '发布日', start: '2026-09-19', end: '2026-09-20', allDay: true });
  assert.equal(allDay.allDay, true);
  assert.equal(allDay.minutes, 0);
});

test('moveSlot：上下挪时间、左右挪天，15 分钟吸附', () => {
  const base = { dayKey: '2026-09-19', minutes: 600, durationMinutes: 60, allDay: false };
  assert.equal(moveSlot(base, 0, 60, 15).minutes, 660, '下移一小时');
  assert.equal(moveSlot(base, 0, 7, 15).minutes, 600, '不到 8 分钟不吸附');
  assert.equal(moveSlot(base, 0, 8, 15).minutes, 615, '过 7.5 分钟吸到 15');
  assert.equal(moveSlot(base, 1, 0, 15).dayKey, '2026-09-20', '右移一天');
  assert.equal(moveSlot(base, -1, 0, 15).dayKey, '2026-09-18', '左移一天');
});

test('moveSlot：跨月跨年靠时间戳进位，不需要特殊分支', () => {
  assert.equal(moveSlot({ dayKey: '2026-09-01', minutes: 600, durationMinutes: 60 }, -1, 0, 15).dayKey, '2026-08-31');
  assert.equal(moveSlot({ dayKey: '2026-12-31', minutes: 600, durationMinutes: 60 }, 1, 0, 15).dayKey, '2027-01-01');
  assert.equal(moveSlot({ dayKey: '2026-03-01', minutes: 0, durationMinutes: 60 }, -1, 0, 15).dayKey, '2026-02-28', '非闰年 2 月');
});

test('moveSlot：越过午夜会自动进退一天（而不是负数或 24:xx）', () => {
  const late = { dayKey: '2026-09-19', minutes: 23 * 60, durationMinutes: 30, allDay: false };
  const nextDay = moveSlot(late, 0, 60, 15);
  assert.equal(nextDay.dayKey, '2026-09-20', '23:00 + 1h = 次日 00:00');
  assert.equal(nextDay.minutes, 0);
  const early = { dayKey: '2026-09-19', minutes: 30, durationMinutes: 30, allDay: false };
  const previousDay = moveSlot(early, 0, -60, 15);
  assert.equal(previousDay.dayKey, '2026-09-18', '00:30 − 1h = 前一天 23:30');
  assert.equal(previousDay.minutes, 23 * 60 + 30);
});

/**
 * 越过午夜：**滚到下一天**，而不是硬钳在当天最后一刻 —— 真实日历（Google）就是滚，
 * 而且幽灵块按 slot.dayKey 渲染，滚动语义才自洽（同一天内仍钳到「还放得下整个时长」）。
 */
test('moveSlot：越过午夜滚到次日（同一天内仍钳制）', () => {
  const late = { dayKey: '2026-09-19', minutes: 22 * 60, durationMinutes: 120, allDay: false };
  const rolled = moveSlot(late, 0, 180, 15);
  assert.equal(rolled.dayKey, '2026-09-20', '22:00 + 3h 滚到次日');
  assert.equal(rolled.minutes, 60, '落在次日 01:00，而不是 24:00 或 22:00');
  assert.equal(rolled.durationMinutes, 120, '时长不变');
  const withinDay = moveSlot({ dayKey: '2026-09-19', minutes: 21 * 60, durationMinutes: 120, allDay: false }, 0, 30, 15);
  assert.equal(withinDay.dayKey, '2026-09-19');
  assert.equal(withinDay.minutes, 21 * 60 + 30, '同一格内往下拖 30 分钟就是 21:30');
  const overflow = moveSlot({ dayKey: '2026-09-19', minutes: 23 * 60, durationMinutes: 120, allDay: false }, 0, 0, 15);
  assert.equal(overflow.minutes, 22 * 60, '起点本身就塞不下时（23:00 起、2 小时长）钳到 22:00');
});

test('slotFromDrag：像素位移换算成时间（一小时 44px）', () => {
  const base = { dayKey: '2026-09-19', minutes: 600, durationMinutes: 60, allDay: false };
  assert.equal(slotFromDrag(base, { columns: 0, pixelsY: 44, hourPx: 44 }, 15).minutes, 660, '往下拖一小时');
  assert.equal(slotFromDrag(base, { columns: 0, pixelsY: -22, hourPx: 44 }, 15).minutes, 570, '往上拖半小时');
  assert.equal(slotFromDrag(base, { columns: 2, pixelsY: 0, hourPx: 44 }, 15).dayKey, '2026-09-21', '横向两列 = 两天');
  assert.equal(slotFromDrag(base, { columns: 0, pixelsY: 5, hourPx: 44 }, 15).minutes, 600, '轻微抖动不改变槽位');
});

test('resizeSlot：只改时长（下限 15 分钟、上限 24 小时，允许跨午夜）', () => {
  const base = { dayKey: '2026-09-19', minutes: 600, durationMinutes: 60, allDay: false };
  assert.equal(resizeSlot(base, 30, 15).durationMinutes, 90);
  assert.equal(resizeSlot(base, -120, 15).durationMinutes, 15, '缩到最短 15 分钟');
  assert.equal(resizeSlot(base, 24 * 60, 15).durationMinutes, 24 * 60, '上限 24 小时（不再按「当天还剩多少」压缩 —— 那会把跨午夜日程一碰就砍短）');
  assert.equal(resizeSlot(base, 30, 15).minutes, 600, '开始时间不因缩放而变');
});

test('rangeOfSlot：输出能对回本地墙钟的 UTC ISO', () => {
  const range = rangeOfSlot({ dayKey: '2026-09-19', minutes: 10 * 60 + 30, durationMinutes: 90, allDay: false });
  const start = new Date(range.start);
  const end = new Date(range.end);
  assert.equal(start.getHours(), 10);
  assert.equal(start.getMinutes(), 30);
  assert.equal((end - start) / 60000, 90);
  assert.match(range.start, /Z$/, '提交给服务器的是 UTC 秒级 ISO');
  assert.equal(/\.\d{3}Z$/.test(range.start), false, '不带毫秒（后端断言只认秒级）');
});

test('conflictsForSlot：落点与谁重叠（自己不算）', () => {
  const moved = { dayKey: '2026-09-19', minutes: 600, durationMinutes: 60, allDay: false };
  const events = [
    timedEvent('2026-09-19', 10, 30, 30),   // 重叠
    timedEvent('2026-09-19', 14, 0, 30),    // 不重叠
  ];
  const hit = conflictsForSlot(events, moved, 'none');
  assert.equal(hit.length, 1);
  assert.equal(conflictsForSlot(events, moved, events[0].uid).length, 0, '被拖动的那条不算冲突');
  assert.equal(conflictsForSlot(events, { dayKey: '2026-09-20', minutes: 600, durationMinutes: 60 }, 'none').length, 0);
});

test('isRecurring：系列本身与展开出来的实例都要拦（它们会改整个系列）', () => {
  assert.equal(isRecurring({ rrule: 'FREQ=WEEKLY' }), true);
  assert.equal(isRecurring({ isOccurrence: true }), true);
  assert.equal(isRecurring({ seriesStart: '2026-09-01T01:00:00Z' }), true);
  assert.equal(isRecurring({ uid: 'x', summary: '单次' }), false);
});

// ───────────────────────────── 拖拽接线（源码级契约） ─────────────────────────────

test('拖拽接线：监听器一次注册/卸载摘净、视口坐标判列、rAF 滚动、串行请求、重复日程被挡', () => {
  const src = SOURCE;
  assert.match(src, /window\.addEventListener\("pointermove", onMove\)/, '挂载时注册 pointermove');
  assert.match(src, /removeEventListener\("pointermove", onMove\)[\s\S]*?removeEventListener\("pointerup", onUp\)[\s\S]*?removeEventListener\("pointercancel", onCancel\)[\s\S]*?removeEventListener\("keydown", onKey, true\)/, '四个监听器在同一处摘掉（keydown 走捕获阶段）');
  assert.match(src, /dragRef\.current = null;\s*\/\/ 卸载时不能留着半截拖拽状态/, '卸载要复位拖拽状态');
  assert.match(src, /impl\.current = \{ stopDrag, updatePreview, isOwnPointer \}/, '监听器通过 impl ref 调最新实现');
  const begin = src.slice(src.indexOf('const beginDrag'), src.indexOf('const onKeyDown'));
  assert.equal(/addEventListener/.test(begin), false, 'beginDrag 里不再挂监听器');
  assert.match(src, /keyEvent\.key === "Escape"[\s\S]{0,80}stopPropagation\(\)[\s\S]{0,40}stopDrag\(false\)/, 'Esc 捕获阶段取消拖动（不吃掉浮层面板的 Esc）');
  assert.match(src, /if \(dragRef\.current !== null\) return;\s*\/\/ 已经有一根指针在拖/, '第二根手指按下要忽略');
  assert.match(src, /setTimeout\(\(\) => \{ suppressClick\.current = false; \}, 0\)/, '拖动后点击抑制要兜底清除');
  assert.match(src, /clickEvent\.stopPropagation\(\)/, 'slot 的 click 必须挡住冒泡（否则点事件同时弹新建）');
  assert.match(src, /if \(clickEvent\.target !== clickEvent\.currentTarget\) return;/, '只有点格子空白才新建');
  assert.equal(/\.offsetLeft/.test(src), false, '不能用 offsetLeft（与 clientX 不同坐标系）');
  assert.match(src, /columnIndexFromRects\(clientX, drag\.columns\)/, '列判定走纯函数');
  assert.match(src, /requestAnimationFrame\(stepAutoScroll\)/, '边缘滚动用 rAF 持续滚');
  assert.match(src, /applyPreviewAt\(autoScroll\.current\.x, y, drag\)/, '滚动后重算落点');
  assert.match(src, /stopAutoScroll\(\);\s*\n\s*const drag = dragRef\.current;/, '结束拖动要停掉 rAF');
  assert.match(src, /node\.scrollTop = 7 \* HOUR_PX/, '周视图默认 07:00');
  assert.match(src, /const moveQueue = useRef\(\{\}\)/, '每个 uid 一个串行队列');
  assert.match(src, /if \(range\.start === shown\.start && range\.end === shown\.end\) return;/, '无效位移不发请求');
  assert.match(src, /AbortSignal\.timeout\(API_TIMEOUT_MS\)/, '请求要有超时');
  assert.match(src, /if \(isRecurring\(event\)\) \{ notify\(t\("move\.recurringUnsupported"\)\); return; \}/, '重复日程拖动被挡（会重锚系列起点）');
  assert.match(src, /slotFromEvent\(event\)\.durationMinutes > 24 \* 60/, '超过 24 小时的日程也挡住');
  assert.ok(src.indexOf('const data = useCalendarData') < src.indexOf('const focusUid = useRef(null)'), '焦点恢复的 effect 必须写在 const data 之后（依赖数组在渲染期求值，写前面会 TDZ 崩溃）');
  assert.match(src, /active\.closest\("\.dshc-root"\)/, '只在焦点还在面板里时才回收焦点');
});

test('columnIndexFromRects：指针 x 落在哪一列（视口坐标，边界按左闭右开）', () => {
  const rects = [
    { index: 0, left: 100, width: 50 },
    { index: 1, left: 150, width: 50 },
    { index: 2, left: 200, width: 50 },
  ];
  assert.equal(columnIndexFromRects(120, rects), 0, '列内命中');
  assert.equal(columnIndexFromRects(150, rects), 1, '边界归右列（左闭右开，避免列缝里判不出）');
  assert.equal(columnIndexFromRects(249, rects), 2, '最后一列右边界内');
  assert.equal(columnIndexFromRects(99, rects), undefined, '左侧之外');
  assert.equal(columnIndexFromRects(250, rects), undefined, '右侧之外');
  assert.equal(columnIndexFromRects(120, []), undefined, '没有列就返回 undefined');
});

test('resizeSlot：只吸附位移量，且允许拖过午夜', () => {
  const fifty = { dayKey: '2026-09-19', minutes: 600, durationMinutes: 50, allDay: false };
  assert.equal(resizeSlot(fifty, 0, 15).durationMinutes, 50, '碰一下手柄（位移 0）不该把 50 分钟吸成 45');
  assert.equal(resizeSlot(fifty, 16, 15).durationMinutes, 65, '位移 16 分钟吸成 15 → 65');
  assert.equal(resizeSlot(fifty, -10, 15).durationMinutes, 35, '位移 -10 吸成 -15 → 35（吸附作用于位移量）');
  const crossMidnight = { dayKey: '2026-09-19', minutes: 23 * 60 + 30, durationMinutes: 60, allDay: false };
  assert.equal(resizeSlot(crossMidnight, 0, 15).durationMinutes, 60, '23:30–00:30 的事件一碰手柄不该被压成 30 分钟');
  assert.equal(resizeSlot(crossMidnight, 120, 15).durationMinutes, 180, '允许拉长到跨过午夜');
  assert.equal(resizeSlot(fifty, 24 * 60, 15).durationMinutes, 24 * 60, '上限 24 小时');
  assert.equal(resizeSlot(fifty, -600, 15).durationMinutes, 15, '下限 15 分钟');
});
