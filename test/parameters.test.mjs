import { test } from 'node:test'
import assert from 'node:assert/strict'
import { compileParameters } from '../lib/index.js'

test('compileParameters 输出 object 根 schema', () => {
  const schema = compileParameters({ summary: { type: 'string', required: true } })
  assert.equal(schema.type, 'object')
  assert.deepEqual(schema.required, ['summary'])
  assert.equal(schema.properties.summary.type, 'string')
})

test('compileParameters 保留各属性类型、description 与 required', () => {
  const schema = compileParameters({
    summary: { type: 'string', required: true, description: '标题' },
    start: { type: 'string', required: true },
    allDay: { type: 'boolean' },
    limit: { type: 'integer' },
  })
  assert.equal(schema.type, 'object')
  assert.equal(schema.properties.summary.type, 'string')
  assert.equal(schema.properties.summary.description, '标题')
  assert.equal(schema.properties.start.type, 'string')
  assert.equal(schema.properties.allDay.type, 'boolean')
  assert.equal(schema.properties.limit.type, 'integer')
  assert.deepEqual(schema.required, ['summary', 'start'])
})

test('compileParameters 处理 enum 与 array items', () => {
  const schema = compileParameters({
    provider: { type: 'string', enum: ['google', 'icloud'] },
    tags: { type: 'array', items: 'string' },
  })
  assert.deepEqual(schema.properties.provider, { type: 'string', enum: ['google', 'icloud'] })
  assert.deepEqual(schema.properties.tags, { type: 'array', items: { type: 'string' } })
})

test('compileParameters 空 DSL 无 required 字段', () => {
  const schema = compileParameters({})
  assert.equal(schema.type, 'object')
  assert.deepEqual(schema.properties, {})
  assert.equal(schema.required, undefined)
})
