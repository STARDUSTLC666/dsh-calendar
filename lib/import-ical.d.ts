export declare const ICS_LIMIT: number;
export declare const importTimezones: () => string[];
export interface ImportRow {
    id: string;
    uid: string;
    summary: string;
    start?: string;
    end?: string;
    allDay?: boolean;
    timezones: string[];
    recurring: boolean;
    exceptions: number;
    warnings: string[];
    errors: string[];
    status: 'ready' | 'blocked' | 'duplicate';
    conflicts: number;
}
export interface ImportItem {
    row: ImportRow;
    data: string;
}
export interface ParsedImport {
    items: ImportItem[];
    ignored: number;
    suggestedTimezone: string;
}
/** Parse one file, retain each UID as one CalDAV resource, and never hydrate dates before installing its zones. */
export declare function parseImportICS(input: unknown, floatingTimezone?: string): ParsedImport;
