import { test } from 'node:test'
import assert from 'node:assert/strict'
import { apply, buildCalendarTools } from '../lib/index.js'

/** 构造一个收集工具注册与 dispose 监听的假 ctx。 */
function makeFakeCtx() {
  const registered = []
  const listeners = {}
  const ctx = {
    tools: {
      register(definition) {
        registered.push(definition)
        return () => {
          const index = registered.indexOf(definition)
          if (index >= 0) registered.splice(index, 1)
        }
      },
    },
    on(event, listener) {
      (listeners[event] ??= []).push(listener)
      return () => {}
    },
  }
  return { ctx, registered, listeners }
}

test('apply 注册 5 个工具且名字正确', () => {
  const { ctx, registered } = makeFakeCtx()
  apply(ctx, { provider: 'custom', username: 'u', password: 'p', caldavUrl: 'https://x/' })
  assert.equal(registered.length, 5)
  const names = registered.map((definition) => definition.name).sort()
  assert.deepEqual(names, [
    'calendar_create',
    'calendar_delete',
    'calendar_list',
    'calendar_search',
    'calendar_update',
  ])
})

test('每个工具的 parameters 是编译好的 object JSON Schema', () => {
  const tools = buildCalendarTools({ provider: 'custom', username: 'u', password: 'p', caldavUrl: 'https://x/' })
  assert.equal(tools.length, 5)
  for (const tool of tools) {
    assert.equal(tool.parameters.type, 'object')
    assert.equal(typeof tool.parameters.properties, 'object')
    assert.equal(typeof tool.output.render, 'function')
    assert.equal(tool.output.schema.type, 'object')
    assert.equal(tool.output.schema.additionalProperties, true)
    assert.equal(typeof tool.execute, 'function')
  }
})

test('calendar_create 的 summary/start/end 为必填', () => {
  const create = buildCalendarTools({})[1]
  assert.equal(create.name, 'calendar_create')
  assert.ok(create.parameters.required.includes('summary'))
  assert.ok(create.parameters.required.includes('start'))
  assert.ok(create.parameters.required.includes('end'))
})

test('配置缺失时 execute 抛中文指引（插件仍已加载）', async () => {
  const tools = buildCalendarTools({})
  const list = tools.find((tool) => tool.name === 'calendar_list')
  await assert.rejects(
    () => list.execute({}),
    (error) => /username/.test(error.message) && /cordis\.patch\.yml/.test(error.message),
  )
})

test('apply 在配置缺失时不抛，仅注册工具', () => {
  const { ctx, registered } = makeFakeCtx()
  assert.doesNotThrow(() => apply(ctx, {}))
  assert.equal(registered.length, 5)
})

test('dispose 触发时卸载全部工具', () => {
  const { ctx, registered, listeners } = makeFakeCtx()
  apply(ctx, { provider: 'custom', username: 'u', password: 'p', caldavUrl: 'https://x/' })
  assert.equal(registered.length, 5)
  assert.ok(listeners.dispose, '应注册 dispose 监听')
  for (const listener of listeners.dispose) listener()
  assert.equal(registered.length, 0)
})

test('必填参数缺失抛中文错误（create 缺 summary）', async () => {
  const create = buildCalendarTools({})[1]
  await assert.rejects(
    () => create.execute({ start: '2025-01-01T00:00:00Z', end: '2025-01-01T01:00:00Z' }),
    (error) => /summary/.test(error.message),
  )
})

test('无效时间抛中文错误（list 的 start 非法）', async () => {
  const list = buildCalendarTools({ provider: 'custom', username: 'u', password: 'p', caldavUrl: 'https://x/' })[0]
  await assert.rejects(
    () => list.execute({ start: 'not-a-date' }),
    (error) => /ISO 8601/.test(error.message),
  )
})

test('不存在的日历日期抛中文错误（2025-02-30 非法）', async () => {
  const list = buildCalendarTools({ provider: 'custom', username: 'u', password: 'p', caldavUrl: 'https://x/' })[0]
  await assert.rejects(
    () => list.execute({ start: '2025-02-30' }),
    (error) => /真实存在的日期/.test(error.message),
  )
})

test('end 早于 start 时抛中文范围错误', async () => {
  const list = buildCalendarTools({ provider: 'custom', username: 'u', password: 'p', caldavUrl: 'https://x/' })[0]
  await assert.rejects(
    () => list.execute({ start: '2025-01-02T00:00:00Z', end: '2025-01-01T00:00:00Z' }),
    (error) => /end 不能早于 start/.test(error.message),
  )
})
