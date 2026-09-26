/**
 * 取宿主 settings 服务：优先 `ctx.get`（不必声明 inject），退回属性访问。
 * 两边都拿不到就返回 undefined —— 调用方据此退化，而不是抛。
 */
export declare function settingsProviderOf(ctx: any): any | undefined;
/** 0.1.6 及更早：插件在加载阶段注册自己的命名空间。 */
export declare function isLegacyProvider(provider: any): boolean;
/**
 * 0.1.7 起：宿主把 entry 的 Config 投影成表单，插件不再注册，
 * 读写都按 entry id 走（describe / update / replace）。
 */
export declare function isFormsProvider(provider: any): boolean;
/** 本实例在 profile 里的 entry id；拿不到时用组合包补丁里的行 id。 */
export declare function entryIdOf(ctx: any, fallback: string): string;
/** 解析 DSH_HOME（与官方 dsh-home-paths 同规则：DSH_HOME 优先，否则 ~/.dsh）。 */
export declare function dshHome(home?: string): string;
/**
 * 把老 settings.yaml 里属于本插件的那一段搬进当前 entry 的配置。
 * @returns 真的写了一次才回 true（调用方据此提示用户重启或直接热生效）。
 */
export declare function importLegacySettings(ctx: any, config: Record<string, any>, namespace: string, entryId: string, fields: readonly string[], home?: string): Promise<boolean>;
/** 推迟到应用就绪后再搬：那时 entry 与 settings 服务都已挂载。 */
export declare function installLegacySettingsImport(ctx: any, config: Record<string, any>, namespace: string, entryId: string, fields: readonly string[]): void;
