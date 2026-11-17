import { type CalendarConfig } from './config.js';
export interface ICloudCalendar {
    url: string;
    name: string;
}
/** iCloud discovery is read-only. Follow the authenticated account to its Apple CalDAV shard. */
export declare function discoverICloud(config: CalendarConfig, env: NodeJS.ProcessEnv, signal?: AbortSignal): Promise<ICloudCalendar[]>;
