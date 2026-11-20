import type { CalendarOAuthCredentials } from './config.js';
export declare class OAuthError extends Error {
    readonly status?: number | undefined;
    constructor(message: string, status?: number | undefined);
}
/** One connection owns credentials and refresh serialization for all its collections. */
export declare function createOAuthConnection(config: CalendarOAuthCredentials, transport: typeof fetch): (calendarUrl: string) => typeof fetch;
/** Standalone collections own an independent OAuth connection by default. */
export declare function createOAuthFetch(config: CalendarOAuthCredentials, transport: typeof fetch, calendarUrl: string): typeof fetch;
