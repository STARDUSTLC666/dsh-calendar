import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { CalendarService, resolveConfig } from '../lib/index.js'

test('Chinese account and password reach a real CalDAV request as UTF-8 Basic credentials', async t => {
  const received=[]
  const server=createServer(async(req,res)=>{
    for await (const chunk of req) { /* consume the REPORT body */ }
    received.push(req.headers.authorization)
    res.writeHead(207,{'content-type':'application/xml'}).end('<D:multistatus xmlns:D="DAV:"/>')
  })
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
  t.after(()=>{server.closeAllConnections();server.close()})
  const username='鲸鱼娘',password='测试密码:🦋'
  const config=resolveConfig({provider:'custom',caldavUrl:'http://127.0.0.1:'+server.address().port+'/calendar/',username,password},{})
  assert.deepEqual(await new CalendarService(config).list('2026-11-04T00:00:00Z','2026-11-05T00:00:00Z'),[])
  assert.ok(received.length)
  for(const header of received)assert.equal(Buffer.from(header.slice(6),'base64').toString('utf8'),username+':'+password)
})
