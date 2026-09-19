/**
 * 五个面向模型的日历工具：list / create / update / delete / search。
 * 直接调用 ctx.tools.register 注册【编译好的 JSON Schema】参数与 canonical 输出。
 *
 * @module dsh-calendar/tools
 */
import { type CalendarConfig } from './config.js';
import { type CalendarEvent } from './ical.js';
/** 模型可见的内容块。 */
export interface ContentBlock {
    type: 'text';
    text: string;
}
/** 注册给 ctx.tools.register 的原始工具定义（parameters 为编译好的 JSON Schema）。 */
export interface CalendarToolDefinition {
    name: string;
    description: string;
    parameters: {
        type: 'object';
        properties: Record<string, unknown>;
        required?: string[];
    };
    output: {
        schema: Record<string, unknown>;
        render(args: unknown, value: unknown): ContentBlock[];
    };
    execute(args: unknown, exec: unknown): Promise<unknown>;
    timeoutMs?: number;
}
export declare function asRecord(args: unknown): Record<string, unknown>;
export declare function optionalString(args: Record<string, unknown>, key: string): string | undefined;
export declare function assertIsoTime(value: string, label: string): void;
export declare function assertTimeRange(start: string, end: string): void;
export declare function isoNoMillis(value: string): string;
/** 按开始时间升序稳定排序（CalDAV 服务端返回顺序不保证稳定）。 */
export declare function sortEvents(events: CalendarEvent[]): CalendarEvent[];
/** 构建六个工具定义；每个 execute 惰性解析配置，缺失时抛出中文指引。 */
/** 配置来源：静态对象，或一个 getter（面板把新配置写进 settings 后，工具下一次调用就该用新的）。 */
export type CalendarConfigSource = CalendarConfig | undefined | (() => CalendarConfig | undefined);
export declare function buildCalendarTools(config: CalendarConfigSource, env?: NodeJS.ProcessEnv): CalendarToolDefinition[];
