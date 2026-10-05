/** Validate calendar dates before Date/ical.js can silently normalize them. */
export declare const DATE_ONLY_PATTERN: RegExp;
export declare function assertIsoTime(value: string, label: string): void;
