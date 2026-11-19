/**
 * Trusted caller resolution and private per-person calendar settings storage.
 *
 * DSH currently exposes only the shared owner Principal. A separately injected
 * requestIdentity provider may identify a verified person; when absent, the
 * authenticated DSH principal is the only identity source accepted here.
 */
import { createHash, randomUUID } from 'node:crypto';
import { chmod, mkdir, open, readFile, rename, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
export class CalendarIdentityError extends Error {
    constructor() {
        super('A verified calendar identity is required; configure the request identity provider or use the owner connection.');
        this.name = 'CalendarIdentityError';
    }
}
function record(value) {
    if (value === null || typeof value !== 'object' || Array.isArray(value))
        return undefined;
    return value;
}
function nonEmptyExactId(value) {
    return typeof value === 'string' && value.length > 0 && value.trim().length > 0;
}
/**
 * Resolve only identities supplied by trusted Host services. The owner keeps the
 * existing single connection; an authenticated OIDC identity or a trusted
 * non-owner Principal gets its own exact, namespaced subject. An unavailable or
 * malformed configured identity service is an error, never an owner fallback.
 */
export function resolveCalendarCaller(principal, requestIdentity) {
    if (requestIdentity !== undefined) {
        if (typeof requestIdentity !== 'object' || requestIdentity === null || typeof requestIdentity.current !== 'function') {
            throw new CalendarIdentityError();
        }
        let current;
        try {
            current = requestIdentity.current();
        }
        catch {
            throw new CalendarIdentityError();
        }
        const identity = record(current);
        if (!identity || !nonEmptyExactId(identity.id))
            throw new CalendarIdentityError();
        return { kind: 'person', subject: `oidc:${identity.id}` };
    }
    const trustedPrincipal = record(principal);
    if (!trustedPrincipal || typeof trustedPrincipal.kind !== 'string' || trustedPrincipal.kind.length === 0 || trustedPrincipal.kind.trim() === '') {
        throw new CalendarIdentityError();
    }
    if (trustedPrincipal.kind === 'owner')
        return { kind: 'owner' };
    if (!nonEmptyExactId(trustedPrincipal.id))
        throw new CalendarIdentityError();
    return { kind: 'person', subject: `principal:${JSON.stringify([trustedPrincipal.kind, trustedPrincipal.id])}` };
}
/** Stable opaque filename key; the original subject's case and code points matter. */
export function personStorageKey(subject) {
    if (!nonEmptyExactId(subject))
        throw new CalendarIdentityError();
    return createHash('sha256').update('dsh-calendar-person-v1\0').update(subject, 'utf8').digest('hex');
}
/** The file path contains only a SHA-256 digest, never a user-supplied ID. */
export function personConnectionFile(connectionsDir, caller) {
    if (!caller || caller.kind !== 'person')
        throw new CalendarIdentityError();
    return join(connectionsDir, personStorageKey(caller.subject) + '.json');
}
function emptyDocument() {
    return { schemaVersion: 1, revision: 0, value: {} };
}
function decodeDocument(text) {
    let raw;
    try {
        raw = JSON.parse(text);
    }
    catch {
        throw new Error('Person calendar settings file is invalid JSON.');
    }
    const value = record(raw);
    if (!value || value.schemaVersion !== 1 || !Number.isSafeInteger(value.revision) || value.revision < 0 || !record(value.value)) {
        throw new Error('Person calendar settings file has an invalid format.');
    }
    return { schemaVersion: 1, revision: value.revision, value: value.value };
}
function readDocumentSync(file) {
    try {
        return decodeDocument(readFileSync(file, 'utf8'));
    }
    catch (error) {
        if (record(error)?.code === 'ENOENT')
            return emptyDocument();
        throw error;
    }
}
const pathTails = new Map();
async function withPathLock(file, action) {
    const previous = pathTails.get(file) ?? Promise.resolve();
    let release;
    const current = new Promise(resolve => { release = resolve; });
    const tail = previous.then(() => current);
    pathTails.set(file, tail);
    await previous;
    try {
        return await action();
    }
    finally {
        release();
        if (pathTails.get(file) === tail)
            pathTails.delete(file);
    }
}
async function writeAtomic(file, document) {
    const directory = dirname(file);
    await mkdir(directory, { recursive: true, mode: 0o700 });
    if (process.platform !== 'win32')
        await chmod(directory, 0o700);
    const temporary = `${file}.${randomUUID()}.tmp`;
    let handle;
    try {
        handle = await open(temporary, 'wx', 0o600);
        await handle.writeFile(JSON.stringify(document) + '\n', 'utf8');
        await handle.sync();
        await handle.close();
        handle = undefined;
        if (process.platform !== 'win32')
            await chmod(temporary, 0o600);
        await rename(temporary, file);
        if (process.platform !== 'win32')
            await chmod(file, 0o600);
    }
    catch (error) {
        await handle?.close().catch(() => { });
        await rm(temporary, { force: true }).catch(() => { });
        throw error;
    }
}
/**
 * Create a CalendarSettingsFace backed by this person's independent server-side
 * JSON file. A missing file is an empty revision-0 store; corrupt files and IO
 * errors fail closed. replace() uses per-file serialization + revision CAS and
 * an fsync'ed same-directory temporary file followed by atomic rename.
 */
export function createPersonSettingsFace(connectionsDir, caller) {
    const file = personConnectionFile(connectionsDir, caller);
    return {
        kind: 'file',
        read: () => readDocumentSync(file).value,
        descriptor: () => {
            const document = readDocumentSync(file);
            return { revision: document.revision, user: document.value };
        },
        replace: async (value, revision) => {
            if (!record(value) || !Number.isSafeInteger(revision) || revision < 0)
                throw new Error('Invalid person calendar settings update.');
            const cloned = JSON.parse(JSON.stringify(value));
            const safeValue = record(cloned);
            if (!safeValue)
                throw new Error('Person calendar settings must be a JSON object.');
            await withPathLock(file, async () => {
                const current = readDocumentSync(file);
                if (current.revision !== revision)
                    throw new Error('Person calendar settings changed; reload before saving.');
                await writeAtomic(file, { schemaVersion: 1, revision: current.revision + 1, value: safeValue });
            });
        },
    };
}
/** Async convenience for integrations that need to read the isolated record. */
export async function readPersonSettings(connectionsDir, caller) {
    const file = personConnectionFile(connectionsDir, caller);
    try {
        return decodeDocument(await readFile(file, 'utf8')).value;
    }
    catch (error) {
        if (record(error)?.code === 'ENOENT')
            return {};
        throw error;
    }
}
