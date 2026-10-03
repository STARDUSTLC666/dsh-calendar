import { type CalendarConfig, type ResolvedConfig } from './config.js';
import type { CalendarEvent } from './ical.js';
export declare const CALENDAR_IMPORT_ROUTE = "/api/dsh-calendar/import";
interface ImportService {
    importSnapshot(signal?: AbortSignal): Promise<{
        uids: Set<string>;
        events: CalendarEvent[];
    }>;
    importRaw(uid: string, data: string, signal?: AbortSignal): Promise<void>;
}
interface Options {
    config: () => CalendarConfig;
    env?: NodeJS.ProcessEnv;
    serviceFactory?: (config: ResolvedConfig) => ImportService;
    now?: () => number;
}
export declare class CalendarImportBackend {
    private readonly options;
    private readonly plans;
    private committing;
    constructor(options: Options);
    private now;
    private current;
    private service;
    private prune;
    private safeMessage;
    action(body: Record<string, unknown>, signal?: AbortSignal): Promise<unknown>;
    fetch(request: Request): Promise<Response>;
}
export declare function installCalendarImport(ctx: any, backend: CalendarImportBackend): void;
export {};
