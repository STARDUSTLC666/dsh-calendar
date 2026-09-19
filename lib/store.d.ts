/** $DSH_HOME/data/dsh-calendar/connection.json（DSH_HOME 缺省 ~/.dsh）。 */
export declare function connectionFile(env?: NodeJS.ProcessEnv): string;
export interface StoredConnection {
    revision: number;
    value: Record<string, unknown>;
}
/** 读兜底文件；不存在、坏了、被改成非对象都当「没有配置」处理（面板会显示引导态）。 */
export declare function readConnectionFile(file?: string): StoredConnection;
/** 先写临时文件再改名：中途失败不会留下半份配置。 */
export declare function writeConnectionFile(stored: StoredConnection, file?: string): void;
