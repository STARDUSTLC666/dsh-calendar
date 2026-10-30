import type { CalendarEvent } from './ical.js';
export interface AvailabilityInput {
    start: string;
    end: string;
    timeZone: string;
    durationMinutes?: number;
    workStart?: string;
    workEnd?: string;
    weekdays?: number[];
    bufferMinutes?: number;
    stepMinutes?: number;
    limit?: number;
}
export interface AvailabilityResult {
    start: string;
    end: string;
    timeZone: string;
    durationMinutes: number;
    workStart: string;
    workEnd: string;
    weekdays: number[];
    bufferMinutes: number;
    stepMinutes: number;
    checkedAt: string;
    busyEventCount: number;
    count: number;
    hasMore: boolean;
    slots: Array<{
        start: string;
        end: string;
    }>;
    scope: 'connected-calendar';
    complete: true;
}
export declare function availabilityRequest(input: AvailabilityInput): {
    startMs: number;
    endMs: number;
    formatter: Intl.DateTimeFormat;
    timeZone: string;
    durationMinutes: number;
    workStart: {
        text: string;
        minute: number;
    };
    workEnd: {
        text: string;
        minute: number;
    };
    weekdays: number[];
    bufferMinutes: number;
    stepMinutes: number;
    limit: number;
};
/** Only use with a complete, expanded collection; titles never leave this calculation. */
export declare function findAvailableTimes(events: CalendarEvent[], input: AvailabilityInput): AvailabilityResult;
