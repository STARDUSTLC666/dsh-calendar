import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  CalendarIdentityError,
  createPersonSettingsFace,
  personConnectionFile,
  personStorageKey,
  resolveCalendarCaller,
} from '../src/people.ts'

function rejectsIdentity(action) {
  assert.throws(action, CalendarIdentityError)
}

test('resolves only trusted identity sources with owner-only legacy fallback', () => {
  assert.deepEqual(resolveCalendarCaller({ kind: 'owner' }), { kind: 'owner' })
  assert.deepEqual(resolveCalendarCaller({ kind: 'oidc-user', id: 'Subject/A' }), {
    kind: 'person', subject: 'principal:["oidc-user","Subject/A"]',
  })
  assert.deepEqual(resolveCalendarCaller({ kind: 'owner' }, { current: () => ({ id: 'Alice' }) }), {
    kind: 'person', subject: 'oidc:Alice',
  })
  assert.deepEqual(resolveCalendarCaller({ kind: 'owner' }, { current: () => ({ id: ' alice ' }) }), {
    kind: 'person', subject: 'oidc: alice ',
  })
  rejectsIdentity(() => resolveCalendarCaller({ kind: 'owner' }, { current: () => null }))
  rejectsIdentity(() => resolveCalendarCaller({ kind: 'owner' }, { current: () => ({ id: '' }) }))
  rejectsIdentity(() => resolveCalendarCaller({ kind: 'owner' }, { current: () => ({ id: '   ' }) }))
  rejectsIdentity(() => resolveCalendarCaller({ kind: 'owner' }, { current: () => { throw new Error('not ready') } }))
  rejectsIdentity(() => resolveCalendarCaller({ kind: 'oidc-user' }))
  rejectsIdentity(() => resolveCalendarCaller({ kind: 'oidc-user', id: 42 }))
  rejectsIdentity(() => resolveCalendarCaller(undefined))
  rejectsIdentity(() => resolveCalendarCaller({ kind: '', id: 'x' }))
  assert.notEqual(resolveCalendarCaller({kind:'a:b',id:'c'}).subject,resolveCalendarCaller({kind:'a',id:'b:c'}).subject,'principal kind/id boundaries must remain distinct')
})

test('hashes exact namespaced subjects without normalization or path disclosure', () => {
  const one = personStorageKey('oidc:User-Ä')
  assert.match(one, /^[a-f0-9]{64}$/)
  assert.notEqual(one, personStorageKey('oidc:user-ä'))
  assert.notEqual(personStorageKey('oidc:alice'), personStorageKey('principal:oidc:alice'))
  const file = personConnectionFile('/private/calendar-connections', { kind: 'person', subject: 'oidc:alice@example.test' })
  assert.equal(file, join('/private/calendar-connections', personStorageKey('oidc:alice@example.test') + '.json'))
  assert.doesNotMatch(file, /alice@example\.test/)
  rejectsIdentity(() => personStorageKey(''))
})

test('person settings start empty, persist atomically, and never share another person file', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-calendar-people-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const alice = createPersonSettingsFace(directory, { kind: 'person', subject: 'oidc:Alice' })
  const bob = createPersonSettingsFace(directory, { kind: 'person', subject: 'oidc:Bob' })

  assert.deepEqual(alice.read(), {})
  assert.deepEqual(alice.descriptor(), { revision: 0, user: {} })
  assert.deepEqual(bob.read(), {})
  await alice.replace({ provider: 'custom', username: 'alice', password: 'alice-secret' }, 0)
  assert.deepEqual(alice.read(), { provider: 'custom', username: 'alice', password: 'alice-secret' })
  assert.equal(alice.descriptor()?.revision, 1)
  assert.deepEqual(bob.read(), {})
  await assert.rejects(alice.replace({ username: 'stale' }, 0), /changed/)

  const aliceFile = personConnectionFile(directory, { kind: 'person', subject: 'oidc:Alice' })
  const fileText = await readFile(aliceFile, 'utf8')
  assert.match(fileText, /alice-secret/)
  assert.doesNotMatch(fileText, /oidc:Alice/)
  assert.equal((await readdir(directory)).length, 1)
  if (process.platform !== 'win32') {
    assert.equal((await stat(directory)).mode & 0o777, 0o700)
    assert.equal((await stat(aliceFile)).mode & 0o777, 0o600)
  }
  assert.equal((await readdir(directory)).some(name => name.endsWith('.tmp')), false)
})

test('same-revision concurrent updates use compare-and-swap within one process', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-calendar-people-cas-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const face = createPersonSettingsFace(directory, { kind: 'person', subject: 'principal:oidc:user-1' })
  const results = await Promise.allSettled([
    face.replace({ username: 'first' }, 0),
    face.replace({ username: 'second' }, 0),
  ])
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1)
  assert.equal(results.filter(result => result.status === 'rejected').length, 1)
  assert.equal(face.descriptor()?.revision, 1)
  assert.ok(['first', 'second'].includes(face.read().username))
})

test('corrupt person settings fail closed rather than becoming an empty/global config', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-calendar-people-corrupt-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const caller = { kind: 'person', subject: 'oidc:corrupt' }
  const face = createPersonSettingsFace(directory, caller)
  await writeFile(personConnectionFile(directory, caller), '{broken')
  assert.throws(() => face.read(), /invalid JSON/)
  await assert.rejects(face.replace({ username: 'unsafe-overwrite' }, 0), /invalid JSON/)
})
