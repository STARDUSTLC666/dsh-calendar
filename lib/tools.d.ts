/**
 * 五个面向模型的日历工具：list / create / update / delete / search。
 * 直接调用 ctx.tools.register 注册【编译好的 JSON Schema】参数与 canonical 输出。
 *
 * @module dsh-calendar/tools
 */
import { type CalendarConfig } from './config.js';
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
/** 构建五个工具定义；每个 execute 惰性解析配置，缺失时抛出中文指引。 */
export declare function buildCalendarTools(config: CalendarConfig | undefined): CalendarToolDefinition[];
