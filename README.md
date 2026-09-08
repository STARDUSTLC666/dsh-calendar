[English](README.en.md)

# dsh-calendar

> **agent 从此会排期**：CalDAV 读写日历，重复日程自动展开。

![npm version](https://img.shields.io/npm/v/dsh-calendar?label=npm&color=blue) ![npm downloads](https://img.shields.io/npm/dm/dsh-calendar) ![license](https://img.shields.io/npm/l/dsh-calendar) ![stars](https://img.shields.io/github/stars/STARDUSTLC666/dsh-calendar?style=social)

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)


DSH 社区插件：通过 CalDAV 读写日历事件。提供 5 个日历操作工具（calendar_list / calendar_create / calendar_update / calendar_delete / calendar_search）和 `calendar_health` 配置自检。Google 使用 OAuth 2.0；iCloud / Nextcloud / 自定义服务器默认保留 Basic 认证。不含设置页 UI，配置全部走 profile 的 cordis.patch.yml。

## 兼容性

已在 `@deepseek-ai/dsh@0.1.3-alpha.1` 官方源码基线上验证插件接口与 Web profile 同载（2026-09-07）。OAuth 使用离线模拟的令牌端点和 DAV 响应测试，未使用真实 Google 账号验证。遵循 cordis 组合包补丁模型（`cordis.patch.yml` + `dsh.bundle.patch`），运行时不 import 任何 `@deepseek-ai/*` 内部模块。

## 安装

```bash
dsh plugin --profile web add dsh-calendar
```

安装后重启 dsh。插件会向 profile 插入一行 id 为 `calendar` 的配置行（见本包的 cordis.patch.yml）。默认 provider 为 custom 且未填任何凭证，此时插件照常加载，但工具在调用时会抛出中文指引错误，提示你补全配置。

## 配置

所有配置都在你的 profile 的 cordis.patch.yml 里，按 id 覆盖 `calendar` 行（覆盖整行的 config）。通用字段：

- `provider`：google | icloud | nextcloud | custom
- `caldavUrl`：完整日历集合 URL（custom / icloud 必填；google / nextcloud 也可手填覆盖预设）
- `authMethod`：`basic` | `oauth`；Google 默认且必须为 `oauth`，其他 provider 默认 `basic`。其他 OAuth 服务器需显式设置 `oauth`，不会因环境中存在 Google 凭据而自动切换。
- `username` / `password`：仅 Basic 认证必需。iCloud 请用应用专用密码；密码推荐用环境变量 `DSH_CALENDAR_PASSWORD`。**Google CalDAV 不接受任何 Basic 密码，包括应用专用密码。**
- `clientId` / `clientSecret` / `refreshToken`：OAuth 必需；分别支持 `DSH_CALENDAR_CLIENT_ID` / `DSH_CALENDAR_CLIENT_SECRET` / `DSH_CALENDAR_REFRESH_TOKEN`。非空配置值优先于环境变量。请勿把密钥或令牌提交到 Git。
- `tokenUrl`：可用 `DSH_CALENDAR_TOKEN_URL`；Google 默认 `https://oauth2.googleapis.com/token`，其他 OAuth 服务必填。OAuth 的 tokenUrl 与 caldavUrl 必须为不含内嵌账号密码、查询参数或片段的 HTTPS 地址。
- `proxyUrl`：可选 HTTP 代理地址（如 http://127.0.0.1:7890）；令牌刷新和 CalDAV 请求共用该代理。可直连时无需填写。
- `calendarId`：google 专用，日历 ID（通常是你的邮箱）
- `host` / `user` / `calendar`：nextcloud 专用


## 卸载

```bash
dsh plugin --profile web remove dsh-calendar
```

卸载后重启 Web 服务。如需彻底清理，可再手动删除自己 profile `cordis.patch.yml` 中的对应插件行。

## 中国用户：特殊代理配置（Google / iCloud）

若本机网络无法直连 Google / iCloud，插件内置的 `proxyUrl` 可把 OAuth 令牌请求和 CalDAV 请求路由到**你本机 HTTP 代理客户端的端口**，不影响其他插件，也无需改任何系统设置。

```yaml
- id: calendar
  config:
    provider: google
    calendarId: you@gmail.com
    # OAuth 凭据通过下文三个环境变量提供
    proxyUrl: http://127.0.0.1:7890   # 改成你代理客户端的本地端口
```

### 常见代理客户端本地端口

| 客户端 | 本地端口 |
|---|---|
| Clash / Clash Verge（HTTP） | 7890 / 7897 |
| v2rayN（HTTP / SOCKS） | 10808 / 10809 |
| Shadowsocks | 1080 |

在客户端界面确认你的实际端口，填进 `proxyUrl` 即可。国内可直连的 CalDAV 服务（如自建 Nextcloud）则无需填写。

### Google 示例

```yaml
- id: calendar
  name: dsh-calendar
  config:
    provider: google
    calendarId: you@gmail.com
    # authMethod: oauth  # Google 默认即为 oauth
    # clientId / clientSecret / refreshToken 推荐用环境变量
```

Google 的 CalDAV 集合 URL 由插件拼成：`https://apidata.googleusercontent.com/caldav/v2/<calendarId>/events`。

在启动源码版 `pnpm dsh` 或普通 `dsh` 的同一个终端中设置（以下均为占位值）：

```bash
export DSH_CALENDAR_CLIENT_ID='你的 OAuth 客户端 ID'
export DSH_CALENDAR_CLIENT_SECRET='你的 OAuth 客户端密钥'
export DSH_CALENDAR_REFRESH_TOKEN='你授权后取得的 refresh token'
```

凭据必须来自你自己的 Google Cloud OAuth 客户端和一次用户授权，而不是邮箱应用专用密码。按 [Google CalDAV 官方设置说明](https://developers.google.com/workspace/calendar/caldav/v2/guide) 启用 API、配置 OAuth；申请日历读写范围 `https://www.googleapis.com/auth/calendar`，并请求离线访问（`access_type=offline`）以取得刷新令牌，参见 [Google 离线授权说明](https://developers.google.com/identity/protocols/oauth2/web-server#offline)。尚未提供浏览器一键登录或独立登录 CLI；已有 OAuth 配置的用户可直接填入刷新令牌。

**Google CalDAV 范围实测（2026-09-08）**：同一账号与日历使用 `calendar.readonly` 时，令牌刷新返回 200、集合探测 PROPFIND 返回 207，但读取日程 REPORT 返回 403；改为上述 `calendar` 范围后，REPORT 返回 207，重启验证进程后再次刷新和读取也通过。因此，请按这里的 CalDAV 配置申请范围，并用 `calendar_list` 验证真实读取，不能只凭令牌获取成功或集合探测成功判断日程可读。本次真实测试仅执行读取，没有验证 Google 的写入操作。

`calendar` 范围允许查看、修改、分享及删除可访问的日历，申请前请确认接受该权限范围，详见 [Google 权限定义](https://developers.google.com/workspace/calendar/api/auth)。外部 OAuth 应用处于 **Testing** 状态时，包含日历权限的刷新令牌会在 7 天后过期；长期使用需处理重新授权或按 Google 要求配置生产状态，详见 [刷新令牌到期规则](https://developers.google.com/identity/protocols/oauth2#expiration)。

插件在内存中缓存访问令牌，并在每次 DAV 请求前检查有效期、提前刷新；令牌请求与 DAV 请求都会透传调用的取消信号。401 会使缓存失效，下一次调用重新刷新，**不会自动重放写请求**。OAuth 请求不跟随重定向、不向其它源的对象 href 发送 Bearer token，请填写最终日历集合地址。运行时令牌不会写入配置或日志；若其他 OAuth 提供方轮换 refresh token，重启时需要重新提供有效凭据。

### iCloud 示例

```yaml
- id: calendar
  name: dsh-calendar
  config:
    provider: icloud
    username: you@icloud.com
    caldavUrl: https://caldav.icloud.com/123456789/calendars/<日历ID>/
    # password 推荐用环境变量 DSH_CALENDAR_PASSWORD
```

iCloud 需要完整日历集合 URL（含你的用户 ID 与日历 ID），在 icloud.com 的日历 CalDAV 设置里可找到具体日历地址。

### Nextcloud 示例

```yaml
- id: calendar
  name: dsh-calendar
  config:
    provider: nextcloud
    username: alice
    host: https://cloud.example.com
    user: alice
    calendar: personal
    # password 推荐用环境变量 DSH_CALENDAR_PASSWORD
```

插件会拼成：`https://cloud.example.com/remote.php/dav/calendars/alice/personal/`。

### 自定义 CalDAV 示例

```yaml
- id: calendar
  name: dsh-calendar
  config:
    provider: custom
    caldavUrl: https://dav.example.com/calendars/me/work/
    username: me
    # password 推荐用环境变量 DSH_CALENDAR_PASSWORD
```

## 认证失败排查

Google：仅支持 OAuth 2.0。401/403 时检查 OAuth 授权、日历范围与日历访问权限；如果令牌刷新和 PROPFIND 成功而 REPORT 返回 403，核对实际授予的范围是否为上述 `calendar`，不要将 `calendar.readonly` 的集合探测成功当作日程读取成功。令牌刷新失败时核对 clientId/clientSecret/refreshToken，授权被撤销或过期时重新授权，并检查是否仍处于 Testing 的 7 天期限内。**重新生成应用专用密码不能解决 Google CalDAV 认证失败。**

iCloud：登录 appleid.apple.com → 登录与安全 → App 专用密码，生成后填到 `password` 或 `DSH_CALENDAR_PASSWORD`。不能用你的 Apple ID 密码。

Nextcloud / 自定义 Basic 服务：检查账号、密码或服务要求的应用令牌及日历权限。`calendar_health` 只检查配置完整性，不联网、不证明授权成功；请再用 `calendar_list` 验证真实连接。

## 工具清单

- `calendar_health`：离线检查服务商、日历集合地址与 Basic/OAuth 凭据完整性，不回显密钥、不发起网络连接。
- `calendar_list`：列出某时间段事件（start/end，ISO 8601，缺省未来 7 天）。默认展开重复事件（`expand` 默认 true，`maxOccurrences` 默认 30、clamp 1-200）：每个实例独立成行，带 `isOccurrence: true` 与 `seriesStart`；非重复事件保持 `isOccurrence: false`。`expand=false` 时重复事件按原始单条返回并带 `rrule`。结果按开始时间稳定排序
- `calendar_create`：新建事件（summary/start/end 必填，description/location/allDay/rrule 可选）。严格校验真实日历日期与 `end >= start`
- `calendar_update`：按 uid 改事件（summary/start/end/description/location/allDay/rrule 可选，未提供保留原值，重复规则不再丢失）
- `calendar_delete`：按 uid 删事件
- `calendar_search`：按关键词搜事件（客户端过滤标题/描述/地点/UID，不区分大小写；`limit` 默认 50、clamp 1-200，结果按开始时间排序）

事件稳定标识 `uid` 为 CalDAV href（完整对象 URL），`calendar_update` / `calendar_delete` 使用它。

## 时间与时区

输入输出统一 ISO 8601。定时事件输出为 UTC（如 `2025-01-15T01:00:00Z`），全天事件输出 `YYYY-MM-DD`。输入可带时区偏移（如 `2025-01-15T09:00:00+08:00`），插件内部转 UTC 存储。

## 版本记录

- **0.5.1（2026-09-08）**：补充真实 Google OAuth/CalDAV 读取验证、`calendar.readonly` 与 `calendar` 范围对比及 Testing 刷新令牌到期说明；运行时代码与 0.5.0 相同。
- **0.5.0（2026-09-07）**：修复 Google CalDAV #2：新增 OAuth 凭据与环境变量配置、请求时刷新、取消与代理透传；健康检查区分 Basic/OAuth，修正误导的应用专用密码说明。保留其他服务的 Basic 认证。
- **0.4.0**：新增 `calendar_health` 自检（离线检查 CalDAV 端点与凭据配置，不验证连接）。
- **0.3.2**：
  - 修复 `calendar_update` 更新其他字段时丢失 `rrule` 的问题。
  - 更新与新建都会校验 `end >= start`，并拒绝 `2025-02-30` 这类不存在的日期。
  - `calendar_list` / `calendar_search` 输出按开始时间稳定排序；搜索 `limit` clamp 到 1-200。
  - CalDAV 客户端创建失败后清空缓存，下一次调用可自动重试，不再永久复用 rejected promise。


## 已知限制

- **网络可达性**：若无法直连，可用 `proxyUrl` 指定本机 HTTP 代理，或改用可直连的 CalDAV 端点。


- 重复事件展开：calendar_list 默认用 ICAL.RecurExpansion 展开 RRULE（`expand=true`），受 `maxOccurrences` 封顶；calendar_search 仍返回原始系列（不展开）。
- 不支持单次实例的改/删：calendar_update / calendar_delete 针对整个重复系列（按 uid 操作），无法只修改或删除某一次发生（不支持 RECURRENCE-ID 实例级操作）。
- OAuth 凭据需要事先取得：支持刷新令牌认证，但不提供浏览器登录 UI / 登录 CLI，也不把运行时令牌写回配置文件。
- 时区规则：带 TZID（命名时区）的事件输出会转成 UTC（Z）；全天边界、夏令时等复杂时区规则不做精细化处理。
- 无设置页 UI：本轮为 node 半身，配置只走 cordis.patch.yml，不提供 Web 设置页。
- 日历发现：iCloud 需手动填完整日历集合 URL；不做 principal 自动发现与多日历选择。
- 取消/超时：工具使用 timeoutMs（60 秒），并向令牌刷新与 DAV 网络请求透传宿主 AbortSignal；并发调用独立取消。

## 开发

```bash
pnpm install
pnpm test   # 构建 + node --test
```

构建产物在 `lib/`，测试在 `test/*.test.mjs`（不依赖真实账号）。

## 相关插件

- [dsh-calendar](https://github.com/STARDUSTLC666/dsh-calendar) — CalDAV 日历五件套
- [dsh-slack](https://github.com/STARDUSTLC666/dsh-slack) — Slack 通知/收件箱
- [dsh-dingtalk](https://github.com/STARDUSTLC666/dsh-dingtalk) — 钉钉群通知（零依赖）
