import type { CalendarOAuthCredentials } from './config.js';
export declare class OAuthError extends Error {
    readonly status?: number | undefined;
    constructor(message: string, status?: number | undefined);
}
/** tsdav 管理 token/expiry；此层补上失败校验、取消、代理与不泄露凭据的错误。 */
export declare function createOAuthFetch(config: CalendarOAuthCredentials, transport: typeof fetch, calendarUrl: string): typeof fetch;
