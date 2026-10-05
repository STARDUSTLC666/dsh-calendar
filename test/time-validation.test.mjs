import test from 'node:test'
import assert from 'node:assert/strict'
import { assertIsoTime } from '../lib/tools.js'
import { buildICalString, updateICalString } from '../lib/ical.js'

test('nonexistent or ambiguous dates cannot become a different scheduled day', () => {
  for (const value of ['2026-02-30T09:00:00+08:00', '2025-02-29T09:00:00Z', '2026-04-31T00:00:00Z', '2026-13-01', '01/02/2026', '2026-10-05T09:00:00', '2026-10-05T24:00:01Z', '2026-10-05T10:00:00+24:00']) {
    assert.throws(() => assertIsoTime(value, 'start'), /合法.*ISO 8601/)
    assert.throws(() => buildICalString({ summary: '不得错日', start: value, end: '2027-01-01T00:00:00Z' }), /合法.*ISO 8601/)
  }
})
test('leap days, explicit offsets, fractional seconds and ISO midnight remain valid', () => {
  for (const value of ['2000-02-29', '2024-02-29T09:00:00+08:00', '2026-10-05T01:15:00-04:30', '2026-10-05T09:00Z', '2026-10-05T09:00:00.123Z', '2026-10-05T24:00:00Z']) assert.doesNotThrow(() => assertIsoTime(value, 'start'))
  const original = buildICalString({ summary: '原事件', start: '2026-10-05T09:00:00+08:00', end: '2026-10-05T10:00:00+08:00' })
  assert.match(original, /DTSTART:20261005T010000Z/)
  assert.throws(() => updateICalString(original, { start: '2026-02-30T09:00:00Z' }), /合法.*ISO 8601/)
})
