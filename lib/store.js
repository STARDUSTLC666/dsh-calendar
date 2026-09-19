/**
 * 连接配置的兜底存放地。
 *
 * 首选是宿主的 settings 命名空间（设置页可读、可导出、可诊断）；但社区插件没法保证
 * 宿主一定提供、也保证不了注册一定成功。所以再加一层：插件自己的 JSON 文件，位置与
 * dsh-email 的 oauth2-tokens.json 同源（$DSH_HOME/data/<插件>/），写入 0600。
 * 两条路都只存明文（settings.yaml 本身也是明文），差别只在「谁读得到」。
 */
import { chmodSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
/** $DSH_HOME/data/dsh-calendar/connection.json（DSH_HOME 缺省 ~/.dsh）。 */
export function connectionFile(env = process.env) {
    const home = env.DSH_HOME !== undefined && env.DSH_HOME !== '' ? env.DSH_HOME : join(homedir(), '.dsh');
    return join(home, 'data', 'dsh-calendar', 'connection.json');
}
/** 读兜底文件；不存在、坏了、被改成非对象都当「没有配置」处理（面板会显示引导态）。 */
export function readConnectionFile(file = connectionFile()) {
    try {
        if (!existsSync(file))
            return { revision: 0, value: {} };
        const parsed = JSON.parse(readFileSync(file, 'utf8'));
        const raw = parsed.value;
        const value = raw !== null && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
        const revision = typeof parsed.revision === 'number' && Number.isFinite(parsed.revision) ? Math.trunc(parsed.revision) : 0;
        return { revision, value };
    }
    catch (error) {
        return { revision: 0, value: {} };
    }
}
/** 先写临时文件再改名：中途失败不会留下半份配置。 */
export function writeConnectionFile(stored, file = connectionFile()) {
    mkdirSync(dirname(file), { recursive: true });
    const tmp = file + '.tmp';
    writeFileSync(tmp, JSON.stringify({ revision: stored.revision, value: stored.value }, null, 2) + '\n', { mode: 0o600 });
    try {
        chmodSync(tmp, 0o600);
    }
    catch (error) { /* Windows 上权限位无效，忽略 */ }
    renameSync(tmp, file);
}
