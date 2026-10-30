import test from 'node:test'
import assert from 'node:assert/strict'
import {findAvailableTimes,availabilityRequest} from '../lib/availability.js'
import {busyResource} from '../lib/availability-ical.js'
import {CalendarService,resolveConfig,buildCalendarTools} from '../lib/index.js'

const base={start:'2026-11-02T00:00:00Z',end:'2026-11-03T00:00:00Z',timeZone:'UTC',durationMinutes:60,limit:20}
const event=(start,end,extra={})=>({uid:'fixture',href:'fixture',summary:'private title',start,end,allDay:false,...extra})
const wrap=body=>'BEGIN:VCALENDAR\r\nVERSION:2.0\r\n'+body+'\r\nEND:VCALENDAR\r\n'
const vevent=(lines,uid='fixture')=>['BEGIN:VEVENT','UID:'+uid,...lines,'END:VEVENT'].join('\r\n')
const resource=(lines)=>wrap(vevent(lines))

test('overlapping busy intervals merge and timed buffers exclude adjacent proposals',()=>{
 const result=findAvailableTimes([event('2026-11-02T09:00:00Z','2026-11-02T10:30:00Z'),event('2026-11-02T10:00:00Z','2026-11-02T11:00:00Z')],{...base,bufferMinutes:15})
 assert.equal(result.slots[0].start,'2026-11-02T11:15:00.000Z');assert.equal(result.busyEventCount,2);assert.equal(result.scope,'connected-calendar');assert.ok(!JSON.stringify(result).includes('private title'))
})
test('cancelled and transparent events do not consume free time',()=>{
 const result=findAvailableTimes([event('2026-11-02T09:00:00Z','2026-11-02T18:00:00Z',{status:'CANCELLED'}),event('2026-11-02T09:00:00Z','2026-11-02T18:00:00Z',{transparency:'TRANSPARENT'})],base)
 assert.equal(result.slots[0].start,'2026-11-02T09:00:00.000Z');assert.equal(result.busyEventCount,0)
})
test('all-day end is exclusive and omitted all-day end consumes one local day',()=>{
 for(const end of ['2026-11-02','2026-11-03']){
  const result=findAvailableTimes([event('2026-11-02',end,{allDay:true})],{...base,end:'2026-11-04T00:00:00Z'})
  assert.equal(result.slots[0].start,'2026-11-03T09:00:00.000Z')
 }
})
test('all-day busy dates use the requested zone instead of UTC midnight',()=>{
 const result=findAvailableTimes([event('2026-11-02','2026-11-03',{allDay:true})],{...base,start:'2026-11-01T16:00:00Z',end:'2026-11-03T16:00:00Z',timeZone:'Asia/Shanghai'})
 assert.equal(result.slots[0].start,'2026-11-03T01:00:00.000Z')
})
test('touching endpoints do not conflict; candidate truncation is explicit',()=>{
 const result=findAvailableTimes([event('2026-11-02T08:00:00Z','2026-11-02T09:00:00Z'),event('2026-11-02T10:00:00Z','2026-11-02T11:00:00Z')],{...base,limit:1})
 assert.equal(result.slots[0].start,'2026-11-02T09:00:00.000Z');assert.equal(result.hasMore,true)
})
test('weekday and whole-minute working-window filters reject overnight proposals',()=>{
 const result=findAvailableTimes([],{...base,start:'2026-11-01T00:00:00Z',end:'2026-11-03T00:00:00Z'})
 assert.equal(result.slots[0].start,'2026-11-02T09:00:00.000Z');assert.equal(findAvailableTimes([],{...base,workStart:'09:00',workEnd:'09:30'}).count,0)
})
test('spring DST uses elapsed duration without inventing nonexistent clock times',()=>{
 const result=findAvailableTimes([],{...base,start:'2026-03-08T05:00:00Z',end:'2026-03-08T09:00:00Z',timeZone:'America/New_York',weekdays:[7],workStart:'01:00',workEnd:'04:00'})
 assert.equal(result.slots[0].start,'2026-03-08T06:00:00.000Z');assert.equal(result.slots[0].end,'2026-03-08T07:00:00.000Z')
})
test('fall DST cannot cross a repeated clock interval outside working hours',()=>{
 const result=findAvailableTimes([],{...base,start:'2026-11-01T04:00:00Z',end:'2026-11-01T09:00:00Z',timeZone:'America/New_York',weekdays:[7],workStart:'01:30',workEnd:'02:30'})
 assert.equal(result.slots[0].start,'2026-11-01T06:30:00.000Z')
})
test('fractional-hour zones align candidates to local clock minutes',()=>{
 const result=findAvailableTimes([],{...base,timeZone:'Asia/Kathmandu'})
 assert.equal(result.slots[0].start,'2026-11-02T03:15:00.000Z')
})
test('invalid and excessive query inputs fail before making availability claims',()=>{
 for(const patch of [{start:'2026-11-02'},{end:base.start},{end:'2027-01-01T00:00:00Z'},{timeZone:'invalid'},{durationMinutes:0},{bufferMinutes:-1},{workStart:'18:00',workEnd:'09:00'},{weekdays:[]},{weekdays:[0]},{limit:101},{stepMinutes:0}])assert.throws(()=>availabilityRequest({...base,...patch}))
 assert.throws(()=>findAvailableTimes([event('2026-11-02T10:00:00Z','2026-11-02T09:00:00Z')],base),/结束早于/)
})
test('a recurring event starting before the query still blocks its overlapping tail',()=>{
 const raw=resource(['DTSTART:20261101T230000Z','DTEND:20261102T020000Z','RRULE:FREQ=DAILY;COUNT=2'])
 const events=busyResource(raw,'fixture',base.start,'2026-11-02T04:00:00Z','UTC')
 assert.equal(events.length,1);assert.equal(findAvailableTimes(events,{...base,end:'2026-11-02T04:00:00Z',workStart:'00:00',workEnd:'04:00'}).slots[0].start,'2026-11-02T02:00:00.000Z')
})
test('floating recurrences and EXDATE use the requested time zone',()=>{
 const events=busyResource(resource(['DTSTART:20261102T090000','DTEND:20261102T100000','RRULE:FREQ=DAILY;COUNT=3','EXDATE:20261103T090000']),'fixture','2026-11-01T00:00:00Z','2026-11-05T00:00:00Z','Asia/Shanghai')
 assert.deepEqual(events.map(e=>e.start),['2026-11-02T01:00:00Z','2026-11-04T01:00:00Z'])
})
test('an explicit source TZID is preserved across DST when the viewer uses UTC',()=>{
 const events=busyResource(resource(['DTSTART;TZID=America/New_York:20261025T090000','DTEND;TZID=America/New_York:20261025T100000','RRULE:FREQ=WEEKLY;COUNT=2']),'fixture','2026-10-24T00:00:00Z','2026-11-03T00:00:00Z','UTC')
 assert.deepEqual(events.map(e=>e.start),['2026-10-25T13:00:00Z','2026-11-01T14:00:00Z'])
})
test('moved and cancelled recurrence exceptions replace the original occurrence',()=>{
 const raw=wrap(vevent(['DTSTART:20261102T090000Z','DTEND:20261102T100000Z','RRULE:FREQ=DAILY;COUNT=2'])+'\r\n'+vevent(['RECURRENCE-ID:20261102T090000Z','DTSTART:20261102T110000Z','DTEND:20261102T120000Z'])+'\r\n'+vevent(['RECURRENCE-ID:20261103T090000Z','DTSTART:20261103T090000Z','DTEND:20261103T100000Z','STATUS:CANCELLED']))
 const events=busyResource(raw,'fixture',base.start,'2026-11-04T00:00:00Z','UTC'),result=findAvailableTimes(events,base)
 assert.equal(result.busyEventCount,1);assert.equal(events.find(e=>e.start==='2026-11-02T09:00:00Z'),undefined)
})
test('transparent metadata survives recurrence expansion',()=>{
 const events=busyResource(resource(['DTSTART:20261102T090000Z','DTEND:20261102T100000Z','RRULE:FREQ=DAILY;COUNT=2','TRANSP:TRANSPARENT']),'fixture',base.start,'2026-11-04T00:00:00Z','UTC')
 assert.ok(events.every(e=>e.transparency==='TRANSPARENT'));assert.equal(findAvailableTimes(events,base).busyEventCount,0)
})
test('incomplete resources, unsupported ranged exceptions and recurrence truncation fail explicitly',()=>{
 for(const raw of ['broken',wrap(''),resource(['DTSTART:20261102T090000Z','DTEND:20261102T091000Z','RRULE:FREQ=MINUTELY;COUNT=3000']),wrap(vevent(['DTSTART:20261102T090000Z'])+'\r\n'+vevent(['RECURRENCE-ID;RANGE=THISANDFUTURE:20261102T090000Z','DTSTART:20261102T100000Z']))])assert.throws(()=>busyResource(raw,'fixture',base.start,'2026-11-05T00:00:00Z','UTC'))
 assert.throws(()=>busyResource(resource(['DTSTART:20261102T090000Z','RRULE:FREQ=DAILY']),'fixture',base.start,base.end,'UTC',0),/超时/)
})
test('service availability reads complete resources and performs no calendar mutation',async()=>{
 const service=new CalendarService(resolveConfig({provider:'custom',caldavUrl:'https://calendar.example/',username:'fixture',password:'fixture'},{})),calls=[]
 service.clientPromise=Promise.resolve({async fetchCalendarObjects(args){calls.push(args);return[{url:'fixture',data:resource(['DTSTART:20261102T090000Z','DTEND:20261102T100000Z'])}]}})
 const result=await service.availability(base);assert.equal(result.slots[0].start,'2026-11-02T10:00:00.000Z');assert.equal(calls.length,1);assert.ok(calls[0].fetchOptions.signal instanceof AbortSignal);assert.equal(calls[0].urlFilter('https://calendar.example/no-extension'),true)
 const cancel=new AbortController();cancel.abort(new Error('fixture canceled'));await assert.rejects(service.availability(base,cancel.signal),/fixture canceled/);assert.equal(calls.length,1)
 service.clientPromise=Promise.resolve({async fetchCalendarObjects(){return[{url:'bad',data:'invalid'}]}});await assert.rejects(service.availability(base),/无法|缺少|解析/)
})
test('the native read-only tool uses the same service and schema',async t=>{
 const calls=[];t.mock.method(CalendarService.prototype,'availability',async(input,signal)=>{calls.push({input,signal});return findAvailableTimes([],input)})
 const tool=buildCalendarTools({provider:'custom',caldavUrl:'https://calendar.example/',username:'fixture',password:'fixture'},{}).find(t=>t.name==='calendar_find_time'),controller=new AbortController()
 assert.deepEqual(tool.parameters.required,['start','end','timeZone']);const result=await tool.execute(base,{signal:controller.signal});assert.equal(result.scope,'connected-calendar');assert.equal(calls[0].signal,controller.signal);assert.match(tool.output.render({},result)[0].text,/尚未预约|数量已达/)
})
