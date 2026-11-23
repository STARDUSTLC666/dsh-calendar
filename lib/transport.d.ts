import { CalendarSettingsBackend } from './web.js';
import { CalendarImportBackend } from './import-web.js';
export declare const AUTH_SETTINGS_ROUTE = "/api/dsh-calendar/settings";
export declare const AUTH_DRAFT_ROUTE = "/api/dsh-calendar/draft";
/** Register only on the Host's authenticated Fetch carrier; never trust proxy identity headers. */
export declare function installAuthenticatedCalendar(ctx: any, resolve: (principal: unknown) => {
    settings: CalendarSettingsBackend;
    imports: CalendarImportBackend;
}, perUser?: boolean): void;
