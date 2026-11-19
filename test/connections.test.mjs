import test from 'node:test'
import assert from 'node:assert/strict'
import { createConnectionService, connectionCollections } from '../lib/connections.js'
const base={provider:'custom',username:'fixture',password:'fixture',calendars:[{id:'a',url:'https://calendar.invalid/a/'},{id:'b',url:'https://calendar.invalid/b/'}]}
const event=(id,start,end)=>({uid:`https://calendar.invalid/${id}/event.ics`,summary:id,start,end})
function fixture(config=base,events={}){
 const calls=[]
 const service=createConnectionService(config,{},resolved=>{
  const id=resolved.caldavUrl.includes('/b/')?'b':'a'
  return {
   async list(){return events[id]??[]},async all(){return events[id]??[]},async availabilityEvents(){return events[id]??[]},
   async create(fields){calls.push(['create',id]);return event(id,fields.start,fields.end)},
   async get(uid){calls.push(['get',id]);return {uid}},async update(uid){calls.push(['update',id]);return {uid}},async delete(uid){calls.push(['delete',id]);return {uid,href:uid}},
   async importSnapshot(){calls.push(['snapshot',id]);return {uids:new Set(),events:[]}},async importRaw(){calls.push(['import',id])},
  }
 })
 return {service,calls}
}

test('several collections merge reads and identify their source',async()=>{
 const a=event('a','2026-11-20T10:00:00Z','2026-11-20T11:00:00Z'),b=event('b','2026-11-20T09:00:00Z','2026-11-20T10:00:00Z')
 const {service}=fixture(base,{a:[a],b:[b]})
 const result=await service.list('2026-11-20T00:00:00Z','2026-11-21T00:00:00Z')
 assert.deepEqual(result.map(row=>row.calendarId),['b','a'])
 assert.equal((await service.all()).length,2)
})
test('multiple collections require an explicit create/import destination',async()=>{
 const {service,calls}=fixture()
 await assert.rejects(service.create({summary:'x',start:'2026-11-20',end:'2026-11-21'}),/writeCalendar/)
 await assert.rejects(service.importRaw('x','ics'),/writeCalendar/)
 assert.deepEqual(calls,[])
 const chosen=fixture({...base,writeCalendar:'b'})
 await chosen.service.create({summary:'x',start:'2026-11-20',end:'2026-11-21'})
 await chosen.service.importRaw('x','ics')
 assert.deepEqual(chosen.calls,[['create','b'],['import','b']])
})
test('connection and collection read-only policies block every write path',async()=>{
 const uid='https://calendar.invalid/a/event.ics'
 for(const config of [{...base,readOnly:true,writeCalendar:'a'},{...base,writeCalendar:'a',calendars:[{...base.calendars[0],readOnly:true},base.calendars[1]]}]){
  const {service,calls}=fixture(config)
  await assert.rejects(service.create({}),/read-only/)
  await assert.rejects(service.update(uid,{}),/read-only/)
  await assert.rejects(service.delete(uid),/read-only/)
  await assert.rejects(service.importRaw('x','ics'),/read-only/)
  assert.deepEqual(calls,[])
  assert.equal((await service.get(uid)).uid,uid)
 }
})
test('event ownership is collection-bound and does not permit foreign paths',async()=>{
 const {service,calls}=fixture({...base,writeCalendar:'a'})
 for(const uid of ['https://evil.invalid/a/event.ics','https://calendar.invalid/ab/event.ics','https://calendar.invalid/a/../other/event.ics'])await assert.rejects(service.update(uid,{}),/not in/)
 assert.deepEqual(calls,[])
 await service.update('https://calendar.invalid/b/event.ics',{})
 assert.deepEqual(calls,[['update','b']])
 assert.throws(()=>connectionCollections({...base,calendars:[{id:'a',url:'https://calendar.invalid/a'},{id:'b',url:'https://calendar.invalid/a/'}]}),/Duplicate/)
})
test('availability combines complete expansions of all collections',async()=>{
 const events={a:[event('a','2026-11-20T09:00:00Z','2026-11-20T10:00:00Z')],b:[event('b','2026-11-20T10:00:00Z','2026-11-20T11:00:00Z')]}
 const {service}=fixture(base,events)
 const result=await service.availability({start:'2026-11-20T09:00:00Z',end:'2026-11-20T12:00:00Z',timeZone:'UTC',workStart:'09:00',workEnd:'12:00',durationMinutes:60})
 assert.equal(result.busyEventCount,2)
 assert.equal(result.slots[0].start,'2026-11-20T11:00:00.000Z')
})
