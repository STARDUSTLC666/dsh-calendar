import { type CalendarConfig, type ResolvedConfig } from './config.js';
import type { CalendarEvent, EventFields } from './ical.js';
import { type AvailabilityInput, type AvailabilityResult } from './availability.js';
export interface CalendarCollection {
    id: string;
    name?: string;
    url: string;
    readOnly?: boolean;
}
export interface ConnectedCalendarService {
    list(start: string, end: string, options?: any, signal?: AbortSignal): Promise<CalendarEvent[]>;
    all(signal?: AbortSignal, timeRange?: {
        start: string;
        end: string;
    }): Promise<CalendarEvent[]>;
    create(fields: EventFields, signal?: AbortSignal): Promise<CalendarEvent>;
    get(uid: string, signal?: AbortSignal): Promise<CalendarEvent>;
    update(uid: string, changes: Partial<EventFields>, signal?: AbortSignal, scope?: 'series'): Promise<CalendarEvent>;
    delete(uid: string, signal?: AbortSignal, scope?: 'series'): Promise<{
        uid: string;
        href: string;
    }>;
    availability(input: AvailabilityInput, signal?: AbortSignal): Promise<AvailabilityResult>;
    availabilityEvents?(input: AvailabilityInput, signal?: AbortSignal): Promise<CalendarEvent[]>;
    importSnapshot(signal?: AbortSignal): Promise<{
        uids: Set<string>;
        events: CalendarEvent[];
    }>;
    importRaw(uid: string, data: string, signal?: AbortSignal): Promise<void>;
}
/** A configured connection owns every collection; inputs cannot choose arbitrary URLs. */
export declare function connectionCollections(config: CalendarConfig): CalendarCollection[];
/** Explicit write destination is required when more than one collection is configured. */
export declare function writableCollection(config: CalendarConfig): CalendarCollection | undefined;
export declare function createConnectionService(config: CalendarConfig, env?: NodeJS.ProcessEnv, make?: (resolved: ResolvedConfig, oauthFetch?: typeof fetch) => ConnectedCalendarService): ConnectedCalendarService;
