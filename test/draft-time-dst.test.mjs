import test from 'node:test'
import assert from 'node:assert/strict'
import {api} from './helpers/client-internals.mjs'
process.env.TZ='America/New_York'
const draft=(start,end)=>api.draftOfEvent({start,end,summary:'Selected time',allDay:false})
test('a selected slot across the fall-back fold preserves both absolute instants',()=>{
 const value=draft('2026-11-01T05:30:00Z','2026-11-01T06:15:00Z');assert.equal(value.startTime,'01:30');assert.equal(value.endTime,'01:15')
 const fields=api.fieldsOfDraft(value);assert.equal(fields.start,'2026-11-01T05:30:00Z');assert.equal(fields.end,'2026-11-01T06:15:00Z')
})
test('choosing the second repeated clock time does not revert it to the first offset',()=>{
 const value=draft('2026-11-01T06:30:00Z','2026-11-01T07:30:00Z');value.summary='Edited title'
 const fields=api.fieldsOfDraft(value);assert.equal(fields.start,'2026-11-01T06:30:00Z');assert.equal(fields.end,'2026-11-01T07:30:00Z')
})
test('editing one endpoint preserves the other endpoint and changing the date resolves anew',()=>{
 const value=draft('2026-11-01T06:30:00Z','2026-11-01T07:30:00Z');value.endTime='02:45'
 assert.equal(api.fieldsOfDraft(value).start,'2026-11-01T06:30:00Z');assert.equal(api.fieldsOfDraft(value).end,'2026-11-01T07:45:00Z')
 value.date='2026-11-02';assert.equal(api.fieldsOfDraft(value).start,'2026-11-02T06:30:00Z')
})
test('temporarily clearing a draft date cannot crash the event editor',()=>{
 const value=draft('2026-11-01T06:30:00Z','2026-11-01T07:30:00Z');value.date='';assert.equal(api.asPseudoEvent(value),null)
})
