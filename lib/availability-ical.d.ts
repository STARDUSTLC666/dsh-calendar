import { type CalendarEvent } from './ical.js';
/** Isolate floating times to the selected viewer zone before the existing expander hydrates them. */
export declare function busyResource(data: string, href: string, start: string, end: string, timeZone: string, deadline?: number): CalendarEvent[];
