/**
 * 日历插件配置解析：provider 预设 + 手填 URL，全部在调用时惰性解析。
 * 配置缺失绝不阻止插件加载，只在工具 execute 时抛出带中文指引的错误。
 *
 * @module dsh-calendar/config
 */
/** 支持的 provider 预设。 */
export type CalendarProvider = 'google' | 'icloud' | 'nextcloud' | 'custom';
export type CalendarAuthMethod = 'basic' | 'oauth';
/** 长期 OAuth 凭据；短期 access token 只保留在运行时内存中。 */
export interface CalendarOAuthCredentials {
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}
/** 插件配置：可在 profile 的 cordis.patch.yml 覆盖 calendar 行的整个 config。 */
export interface CalendarConfig {
    /** provider 预设；默认 custom。 */
    provider?: CalendarProvider;
    /** 完整日历集合 URL；custom / icloud 必填，google / nextcloud 可由此手填覆盖预设。 */
    caldavUrl?: string;
    /** Basic 认证账号；OAuth 不要求此字段。 */
    username?: string;
    /** Basic 密码；支持 DSH_CALENDAR_PASSWORD。iCloud 请用应用专用密码；Google 不支持 Basic。 */
    password?: string;
    /** google 默认 oauth，其他 provider 默认 basic；Google 不允许 basic。 */
    authMethod?: CalendarAuthMethod;
    /** OAuth 客户端 ID；也可用 DSH_CALENDAR_CLIENT_ID。 */
    clientId?: string;
    /** OAuth 客户端密钥；推荐用 DSH_CALENDAR_CLIENT_SECRET。 */
    clientSecret?: string;
    /** OAuth 离线授权的刷新令牌；推荐用 DSH_CALENDAR_REFRESH_TOKEN。 */
    refreshToken?: string;
    /** OAuth 令牌端点；Google 自动使用官方端点，其他 provider 的 OAuth 必填。 */
    tokenUrl?: string;
    /** google：日历 ID（通常是你的邮箱地址）。 */
    calendarId?: string;
    /** nextcloud：主机，如 https://cloud.example.com。 */
    host?: string;
    /** nextcloud：用户名。 */
    user?: string;
    /** nextcloud：日历名。 */
    calendar?: string;
    /**
     * HTTP 代理地址，如 http://127.0.0.1:7890。
     * 中国用户访问 Google / iCloud 需经代理：填你本地代理客户端的端口即可，
     * 插件会把所有 CalDAV 请求路由到该代理，不影响其他插件。
     */
    proxyUrl?: string;
}
/** 解析完成、可直接建客户端的配置。 */
export interface ResolvedConfig {
    provider: CalendarProvider;
    caldavUrl: string;
    username: string;
    password: string;
    oauth?: CalendarOAuthCredentials;
    proxyUrl: string;
}
/** 预设端点常量。 */
export declare const GOOGLE_CALDAV_PREFIX = "https://apidata.googleusercontent.com/caldav/v2/";
export declare const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export declare const ICLOUD_CALDAV_URL = "https://caldav.icloud.com";
export declare const NEXTCLOUD_PATH = "/remote.php/dav/calendars/";
/** 配置错误：带中文指引，模型和用户都能读。 */
export declare class ConfigError extends Error {
    constructor(message: string);
}
export declare const CALENDAR_PROVIDERS: readonly CalendarProvider[];
/**
 * 解析配置为可用的 caldavUrl + 凭证。配置缺失抛出 ConfigError（中文指引）。
 * @param config - 插件 config（可能 undefined）。
 * @param env - 环境变量来源（测试可注入）。
 */
export declare function resolveConfig(config: CalendarConfig | undefined, env?: NodeJS.ProcessEnv): ResolvedConfig;
/** Google 必须使用 OAuth；其他 provider 不会被环境中的 Google 凭据切换认证方式。 */
export declare function resolveAuthMethod(config: CalendarConfig | undefined): CalendarAuthMethod;
/** OAuth 凭据与 Bearer token 仅允许发往无 URL 内嵌凭据的 HTTPS 端点。 */
export declare function validateOAuthUrl(value: string, field: string): void;
/** 独立解析认证，供离线健康检查复用；不会发起网络请求或回显凭据。 */
export declare function resolveCredentials(config: CalendarConfig | undefined, env?: NodeJS.ProcessEnv): Pick<ResolvedConfig, 'username' | 'password' | 'oauth'>;
/** 依据 provider 预设或手填字段拼出日历集合 URL。 */
export declare function buildCaldavUrl(config: CalendarConfig, provider: CalendarProvider): string;
