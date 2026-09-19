/**
 * 面板里的「连接设置」写进哪儿：宿主的 settings 命名空间（settings.yaml）。
 *
 * 与 dsh-email 同一套契约，理由也相同：
 *   - 面板是唯一的常规入口，用户不该为了填四个格子去编辑 cordis.patch.yml；
 *   - 但 cordis.patch.yml 仍是基座：settings 里没碰过的字段由它兜底，所以老用户的
 *     YAML 配置不会因为装上这个面板就失效（toCalendarConfig 只投影「用户真的设过」
 *     的字段，schema 默认值绝不覆盖 YAML 与预设）；
 *   - 密码走 role(secret)，与邮箱授权码同等对待：不进日志、不进导出、不进诊断。
 */
import z from 'schemastery';
import { type CalendarAuthMethod, type CalendarConfig, type CalendarProvider } from './config.js';
/** 本插件独占的 settings 命名空间。 */
export declare const SETTINGS_NAMESPACE = "dsh-calendar";
/**
 * 面板表单的形状。空串一律表示「没设置」：一行 patch 里的 YAML 配置与面板写下的值
 * 因此可以共存 —— 谁设过谁说了算。
 */
export declare const CalendarSettingsSchema: z<Schemastery.ObjectS<{
    provider: z<string, string>;
    caldavUrl: z<string, string>;
    username: z<string, string>;
    password: z<string, string>;
    host: z<string, string>;
    user: z<string, string>;
    calendar: z<string, string>;
    calendarId: z<string, string>;
    authMethod: z<string, string>;
    clientId: z<string, string>;
    clientSecret: z<string, string>;
    refreshToken: z<string, string>;
    tokenUrl: z<string, string>;
    proxyUrl: z<string, string>;
}>, Schemastery.ObjectT<{
    provider: z<string, string>;
    caldavUrl: z<string, string>;
    username: z<string, string>;
    password: z<string, string>;
    host: z<string, string>;
    user: z<string, string>;
    calendar: z<string, string>;
    calendarId: z<string, string>;
    authMethod: z<string, string>;
    clientId: z<string, string>;
    clientSecret: z<string, string>;
    refreshToken: z<string, string>;
    tokenUrl: z<string, string>;
    proxyUrl: z<string, string>;
}>>;
export interface CalendarSettingsValue {
    provider: string;
    caldavUrl: string;
    username: string;
    password: string;
    host: string;
    user: string;
    calendar: string;
    calendarId: string;
    authMethod: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    tokenUrl: string;
    proxyUrl: string;
}
/** 把一行 cordis.patch.yml 的配置投影成 schema 的 base（只带有值的字段）。 */
export declare function toSettingsBase(config: CalendarConfig | undefined): Partial<CalendarSettingsValue>;
/**
 * settings 值 → CalendarConfig。
 *
 * user 是「用户真的改过哪些键」的投影：只有它列出的字段才会被投影出去，因此 schema
 * 的默认值（空串）不会擦掉 cordis.patch.yml 里的配置。传 null 表示按草稿全量投影
 * （保存与测试连接的路径）。
 */
export declare function toCalendarConfig(value: Partial<CalendarSettingsValue> | undefined, user?: Partial<CalendarSettingsValue> | null): CalendarConfig;
/** 连接测试用的「拟议配置」：草稿全量投影，不经过已存值。 */
export declare function draftToConfig(draft: Partial<CalendarSettingsValue> | undefined): CalendarConfig;
/**
 * 写入前的温和校验：结构错误立刻报（中文，面板直接显示），不完整的配置放行 ——
 * 具体地址拼装留给 resolveConfig，它会在工具调用时给出带指引的错误。
 */
export declare function validateSettingsValue(value: Partial<CalendarSettingsValue> | undefined): void;
export type { CalendarAuthMethod, CalendarProvider };
