import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

test('host labels update before plugin subscribers and error guidance follows UI language', () => {
  let client, definition, active = 'zh'
  const subscribers = new Set()
  const locale = { getSnapshot: () => ({ active }), subscribe(fn) { subscribers.add(fn); return () => subscribers.delete(fn) } }
  const source = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')
    .replace('return module.exports;', 'module.exports.probe = { backendMessage, formatMonthTitle, formatWeekTitle, humanRepeat, formatWhen, formatDuration }; return module.exports;')
  runInNewContext(source, {
    window: { __ModuleLoader__: { load({factory}) { client = factory(() => ({})) } } },
  })
  client.apply({
    locale, get: () => locale,
    effect(fn, label) { if (label.endsWith(': locale')) return fn() },
    slots: { inject(_name, fn) { fn() }, register(meta) { definition = meta } },
  })
  assert.equal(definition.label(), "日历")
  active = 'en-US'
  // Host settings renders before the plugin's locale callback.
  assert.equal(definition.label(), "Calendar")
  for (const notify of subscribers) notify()
  const guidance = client.probe.backendMessage({message:'HTTP 401',status:401})
  assert.ok(guidance); assert.doesNotMatch(guidance, /[\u3400-\u9fff]/)
  assert.match(client.probe.formatMonthTitle(new Date(2026, 9, 3)), /October 2026/)
  assert.match(client.probe.formatWeekTitle(new Date(2026, 11, 31)), /2026.*2027/)
  assert.equal(client.probe.humanRepeat('FREQ=WEEKLY;INTERVAL=2;COUNT=4'), 'Every 2 weeks (4 occurrences)')
  assert.match(client.probe.backendMessage('文件含未标注时区的时间，请选择解释时区后重新预览'), /Choose an interpretation timezone/)
  const event = {summary:'中文日程',start:'2026-10-05T00:00:00',end:'2026-10-07T00:00:00',allDay:true}
  assert.equal(client.probe.formatDuration(event), '2 days'); assert.equal(event.summary,'中文日程')
  active = 'zh'; assert.equal(definition.label(), "日历")
  for (const notify of subscribers) notify()
  assert.match(client.probe.backendMessage({message:'HTTP 401',status:401}), /[\u3400-\u9fff]|HTTP 401/)
})
