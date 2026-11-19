import test from 'node:test'
import assert from 'node:assert/strict'
import { apply, Config, CALENDAR_TOOL_NAMES } from '../lib/index.js'

function mount(tools) {
  const registered = []
  const injections = []
  const disposers = []
  const ctx = {
    tools: { register(definition) { registered.push(definition); return () => registered.splice(registered.indexOf(definition), 1) } },
    effect(fn) { disposers.push(fn()) },
    inject(names) { injections.push(names) },
  }
  apply(ctx, { provider: 'custom', username: 'fixture', password: 'fixture', caldavUrl: 'https://calendar.invalid/', ...(tools === undefined ? {} : { tools }) })
  return { registered, injections, dispose() { for (const fn of disposers.reverse()) fn?.() } }
}

test('tools false removes model schemas while settings, import and draft carriers still mount', () => {
  const state = mount(false)
  assert.deepEqual(state.registered, [])
  assert.ok(state.injections.some(names => names.includes('webServer')))
  assert.ok(state.injections.some(names => names.includes('llm')))
  assert.ok(state.injections.some(names => names.includes('settings')))
  state.dispose()
})

test('default and tools true preserve all calendar schemas', () => {
  for (const setting of [undefined, true, {}]) {
    const state = mount(setting)
    assert.deepEqual(state.registered.map(tool => tool.name).sort(), [...CALENDAR_TOOL_NAMES].sort())
    state.dispose()
    assert.deepEqual(state.registered, [])
  }
})

test('individual model tools can be disabled without disabling panel operations', () => {
  const state = mount({ calendar_create: false, calendar_update: false, calendar_delete: false, calendar_list: true })
  assert.deepEqual(state.registered.map(tool => tool.name).sort(), ['calendar_find_time', 'calendar_health', 'calendar_list', 'calendar_search'])
  state.dispose()
  assert.deepEqual(state.registered, [])
})

test('host Config accepts both switch shapes and rejects non-boolean tool values', () => {
  assert.doesNotThrow(() => Config({ tools: false }))
  assert.doesNotThrow(() => Config({ tools: true }))
  assert.doesNotThrow(() => Config({ tools: { calendar_delete: false } }))
  assert.throws(() => Config({ tools: { calendar_delete: 'false' } }))
  assert.throws(() => Config({ tools: { calendar_deleet: false } }), 'misspelled tools must not silently stay enabled')
  assert.throws(() => Config({ tools: { unrelated_tool: false } }))
})
