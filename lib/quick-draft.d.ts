export interface DraftRoute {
    provider: string;
    model: string;
    label: string;
    image: boolean;
}
export interface DraftFields {
    summary: string;
    date: string;
    startTime: string;
    endTime: string;
    allDay: boolean;
    location: string;
    description: string;
}
export interface DraftModel {
    routes(signal?: AbortSignal): Promise<DraftRoute[]>;
    suggest(body: Record<string, unknown>, signal?: AbortSignal): Promise<DraftFields>;
}
export declare const DRAFT_BODY_LIMIT: number;
export declare function parseDraftResult(output: string): DraftFields;
export declare function nativeDraftModel(llm: any, attachments?: any): DraftModel;
