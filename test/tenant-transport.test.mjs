import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { apply, AUTH_DRAFT_ROUTE, AUTH_SETTINGS_ROUTE, createPersonSettingsFace, resolveCalendarCaller } from '../lib/index.js'

function mount(t,extra={}){
 const directory=mkdtempSync(join(tmpdir(),'calendar-tenant-'));t.after(()=>rmSync(directory,{recursive:true,force:true}))
 const routes=new Map(),tools=new Map(),injected=[]
 let identityProvider; let principal={kind:'user',id:'alice'},rejection
 const provider={register(_ns,_schema,options){return {get:()=>options.base}},describe:()=>[],async replace(){throw new Error('Owner settings must not be modified in tenant tests')}}
 const ctx={settings:provider,tools:{register(tool){tools.set(tool.name,tool);return()=>tools.delete(tool.name)}},
  get(name){return name==='settings'?provider:name==='requestIdentity'?identityProvider:undefined},effect(fn){fn()},
  inject(names,callback){injected.push(names);if(names.includes('connection'))callback({connection:{admit:()=>rejection?{rejection}:{peer:{principal}},fetch:{register(route){routes.set(route.path,route);return()=>{}}}},effect(fn){fn()}})},
 }
 apply(ctx,{perUser:true,connectionsDir:directory,provider:'custom',username:'OWNER',password:'OWNER-SECRET',caldavUrl:'https://owner.invalid/calendar/',...extra})
 const request=async(body,headers={})=>{
  const route=routes.get(AUTH_SETTINGS_ROUTE);assert.ok(route)
  const response=await route.fetch(new Request('https://dsh.example/api/dsh-calendar/settings',{method:'POST',headers:{host:'dsh.example',origin:'https://dsh.example','content-type':'application/json',...headers},body:JSON.stringify(body)}))
  return {status:response.status,body:await response.json()}
 }
 return {directory,routes,tools,injected,request,setIdentity(value){identityProvider=value},setPrincipal(value){principal=value},deny(value){rejection=value}}
}

test('authenticated reverse-proxy carrier isolates people and never inherits owner credentials',async t=>{
 const f=mount(t)
 assert.equal(f.injected.some(names=>names.includes('webServer')),false,'per-user mode must not mount legacy shared routes')
 let result=await f.request({action:'connection',userId:'owner'})
 assert.equal(result.status,200)
 assert.equal(result.body.value.hasPassword,false)
 assert.equal(result.body.value.username,'')
 await f.request({action:'saveConnection',provider:'custom',username:'ALICE',password:'ALICE-SECRET',caldavUrl:'https://alice.invalid/calendar/',test:false})
 result=await f.request({action:'connection'})
 assert.equal(result.body.value.username,'ALICE')
 assert.ok(!JSON.stringify(result.body).includes('ALICE-SECRET'))
 f.setPrincipal({kind:'user',id:'bob'})
 result=await f.request({action:'connection',userId:'alice'})
 assert.equal(result.body.value.hasPassword,false)
 assert.equal(result.body.value.username,'')
 f.setPrincipal({kind:'user',id:'alice'})
 assert.equal((await f.request({action:'connection'})).body.value.username,'ALICE')
 f.setPrincipal({kind:'owner'})
 assert.equal((await f.request({action:'connection'})).status,403,'per-user mode cannot expose owner credentials if an identity provider disappears')
 const legacy=mount(t,{allowOwnerFallback:true});legacy.setPrincipal({kind:'owner'})
 assert.equal((await legacy.request({action:'connection'})).body.value.username,'OWNER')
})
test('unauthorized, unidentified and cross-origin requests cannot choose a tenant',async t=>{
 const f=mount(t)
 f.deny(401);assert.equal((await f.request({action:'connection'})).status,401)
 f.deny(undefined);f.setPrincipal({kind:'user'})
 assert.equal((await f.request({action:'connection',id:'alice'})).status,403)
 f.setPrincipal({kind:'user',id:'alice'})
 assert.equal((await f.request({action:'connection'},{origin:'https://evil.invalid'})).status,403)
 assert.equal((await f.request({action:'connection'},{origin:'dsh-app://app.evil'})).status,403)
 assert.equal((await f.request({action:'connection'},{origin:'null'})).status,403)
 assert.equal((await f.request({action:'connection'},{'sec-fetch-site':'cross-site'})).status,403)
 assert.equal((await f.request({action:'connection'},{origin:'dsh-app://app'})).status,200)
 assert.equal((await f.request({action:'connection'},{origin:'dsh-app://app','sec-fetch-site':'cross-site'})).status,200)
 const draftRoute=f.routes.get(AUTH_DRAFT_ROUTE);assert.ok(draftRoute)
 const draftPost=(headers)=>draftRoute.fetch(new Request('https://dsh.example'+AUTH_DRAFT_ROUTE,{method:'POST',headers:{host:'dsh.example','content-type':'application/json',...headers},body:JSON.stringify({action:'models'})}))
 assert.equal((await draftPost({origin:'https://evil.invalid'})).status,403)
 assert.equal((await draftPost({origin:'dsh-app://app.evil'})).status,403)
 assert.equal((await draftPost({'sec-fetch-site':'cross-site'})).status,403)
 assert.equal((await draftPost({origin:'dsh-app://app'})).status,200)
 assert.equal((await draftPost({origin:'dsh-app://app','sec-fetch-site':'cross-site'})).status,200)
 await assert.rejects(f.tools.get('calendar_health').execute({},{}),/verified calendar identity/i,'multi-user tools need a verified driver identity')
})
test('person connection saves retain server-side read-only and collection policy',async t=>{
 const f=mount(t),caller=resolveCalendarCaller({kind:'user',id:'alice'})
 const face=createPersonSettingsFace(f.directory,caller)
 await face.replace({provider:'custom',username:'ALICE',password:'p',caldavUrl:'https://alice.invalid/calendar/',readOnly:true},0)
 const result=await f.request({action:'saveConnection',username:'ALICE-NEW',readOnly:false,test:false})
 assert.equal(result.status,200)
 assert.equal(result.body.value.connection.readOnly,true)
 assert.equal(face.read().readOnly,true)
 const write=await f.request({action:'delete',uid:'https://alice.invalid/calendar/x.ics'})
 assert.equal(write.status,400)
 assert.match(write.body.error.message,/read-only/)
})

test('verified identity drives model tools and missing identity never becomes owner',async t=>{
 const f=mount(t);let user={id:'alice'};f.setIdentity({current:()=>user});
 await f.request({action:'saveConnection',provider:'custom',username:'OIDC-ALICE',password:'p',caldavUrl:'https://alice.invalid/calendar/',test:false});
 const result=await f.tools.get('calendar_health').execute({},{});assert.equal(result.ok,true);
 user={id:'bob'};assert.equal((await f.tools.get('calendar_health').execute({},{})).ok,false);
 user=null;assert.equal((await f.request({action:'connection'})).status,403);
 await assert.rejects(f.tools.get('calendar_health').execute({},{}),/verified calendar identity/i);
});
