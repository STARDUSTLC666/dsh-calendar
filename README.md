[English](README.en.md)

# dsh-calendar

> **agent 从此会排期**：CalDAV 读写日历，重复日程自动展开。

![npm version](https://img.shields.io/npm/v/dsh-calendar?label=npm&color=blue) ![npm downloads](https://img.shields.io/npm/dm/dsh-calendar) ![license](https://img.shields.io/npm/l/dsh-calendar) ![stars](https://img.shields.io/github/stars/STARDUSTLC666/dsh-calendar?style=social)

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)


DSH 社区插件：通过 CalDAV 读写日历事件。提供 5 个日历操作工具（calendar_list / calendar_create / calendar_update / calendar_delete / calendar_search）和 `calendar_health` 配置自检。Google 使用 OAuth 2.0；iCloud / Nextcloud / 自定义服务器默认保留 Basic 认证。不含设置页 UI，配置全部走 profile 的 cordis.patch.yml。

## 兼容性

已在官方 `@deepseek-ai/dsh@0.1.5-rc.1`、Node `24.16.0` 上验证（2026-09-11）：18 个组件与 Modlens 同载，工具 schema、技能注册及离线只读调用检查通过。采用 `cordis.patch.yml` + `dsh.bundle.patch` 组合包模型。Node 要求与该版本 Harness 一致：22.19 及以上的 22.x，或 24 及以上。外部服务的实际业务操作需按各组件配置单独验证。

2026-09-10，npm `dsh-calendar@0.5.2` 已通过该 Harness 的官方 CLI 安装和 6 个工具注册；经宿主执行 `calendar_list`，真实 Google 令牌刷新返回 200、CalDAV REPORT 返回 207，并生成模型可读结果。验证仅含 Google 读取，未执行写入；本次补丁不修改运行时代码。

遵循官方[插件打包与安装要求](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)：ESM 入口、预构建 `lib/`、`dsh.bundle.patch` 和 `cordis.patch.yml` 配置层；显式注入 `tools`，提供 JSON Schema 参数、规范化输出和渲染函数，运行时不 import `@deepseek-ai/*` 内部模块。使用 Node 22.19 及以上的 22.x 或 Node 24 及以上版本；Harness 仍在快速迭代，上述版本是实测基线。

## 安装

```bash
dsh plugin --profile web add dsh-calendar
```

安装后重启 dsh。插件会向 profile 插入一行 id 为 `calendar` 的配置行（见本包的 cordis.patch.yml）。默认 provider 为 custom 且未填任何凭证，此时插件照常加载，但工具在调用时会抛出中文指引错误，提示你补全配置。

## 配置

**推荐：在面板里配（0.6.0+）**

打开面板右上角的「连接设置」，选服务商 → 填地址与账号 → 点**「测试连接」**（它会真的去列未来 30 天的日程）→ 通过后点「保存并启用」。工具的下一次调用立刻用上新配置，不用重启、不用编辑 YAML。

面板写下的值优先存在本机 `settings.yaml` 的 `dsh-calendar` 命名空间里（密码是 secret 字段：不进日志、不进导出）；若宿主没有 settings 服务（或命名空间注册失败），自动改存插件自己的文件 `$DSH_HOME/data/dsh-calendar/connection.json`（0600），面板里会明确显示当前存在哪。**YAML 仍然是基座**：面板没填过的字段由它兜底，所以已经用 `cordis.patch.yml` 配好的部署零迁移；纯 headless（没有设置页）的宿主依然只能走 YAML。

各服务商要点：

- **iCloud**：`caldavUrl` 形如 `https://caldav.icloud.com/<数字ID>/calendars/<日历ID>/`，密码用 [App 专用密码](https://appleid.apple.com/)
- **Nextcloud / 自建**：服务器地址 + 用户名 + 日历名（自建则给完整集合 URL，结尾的 `/` 别丢），密码用 App 密码
- **Google**：必须 OAuth，Google 不接受任何 Basic 密码；需要 `clientId` / `clientSecret` / `refreshToken` / `calendarId`

### 或者：写 YAML（高级 / headless）

下面的字段与面板表单一一对应；面板没设过的字段以这里为准。
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

凭据必须来自你自己的 Google Cloud OAuth 客户端和一次用户授权，而不是邮箱应用专用密码。按 [Google CalDAV 官方设置说明](https://developers.google.com/workspace/calendar/caldav/v2/guide) 启用 API、配置 OAuth；申请日历读写范围 `https://www.googleapis.com/auth/calendar`，并请求离线访问（`access_type=offline`）以取得刷新令牌，参见 [Google 离线授权说明](https://developers.google.com/identity/protocols/oauth2/web-server#offline)。已有 OAuth 配置的用户可直接填入刷新令牌。

**换 refresh token（一条命令）**：客户端类型选「桌面应用」，然后：

```bash
cd <插件目录>          # 源码仓库，或 node_modules/dsh-calendar
node scripts/google-oauth.mjs --client-id 你的clientId --client-secret 你的clientSecret
```

脚本会起一个**一次性本地回调**（`http://127.0.0.1:<随机端口>/`）、打开浏览器让你授权、收到 code 后换成 refresh token 并打印出来 —— 不用手工拼 URL，也不用第三方 Playground。

拿到后填进面板「连接设置」（provider 选 Google，calendarId 填你的 Gmail 地址）；想走 YAML 的话就用环境变量 `DSH_CALENDAR_CLIENT_ID` / `DSH_CALENDAR_CLIENT_SECRET` / `DSH_CALENDAR_REFRESH_TOKEN`。

> 同意屏仍停在「测试」状态时 refresh token 只有 7 天有效：到「OAuth 同意屏幕」点一下「发布应用」即可长期有效（个人自用无需审核）。


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
- `calendar_update`：按 uid 改事件（summary/start/end/description/location/allDay/rrule 可选，未提供保留原值；ATTENDEE、ORGANIZER、VALARM 等原始属性一并保留，重复规则不再丢失）
- `calendar_delete`：按 uid 删事件
- `calendar_search`：按关键词搜事件（只查询 start~end 窗口内的事件，缺省为当前时间前后各 1 年；客户端过滤标题/描述/地点/UID，不区分大小写；`limit` 默认 50、clamp 1-200，结果按开始时间排序）

事件稳定标识 `uid` 为 CalDAV href（完整对象 URL），`calendar_update` / `calendar_delete` 使用它。

## 设置页里的日历面板（0.6.0+）

装好后，DSH 的「设置 → 日历」里会多出一节面板；对话页右下角还有一个 📅 小按钮，点开是同一个面板（非模态，Esc 关闭）。

- **三种视图**：月（6×7 网格，今天高亮，点格子直接新建）、周（24 小时时间网格，重叠日程并排显示，默认落在 07:00）、议程（按天分组，最像「接下来要干什么」）。面板会**记住你上次用的视图**。
- **直接拖就能改期**：周视图里拖动日程上下改时间、左右换天（15 分钟吸附），拖块底部改时长；拖动中会显示落点，与已有日程重叠时描成黄色（允许重叠，只是提醒）。键盘也能改：`↑/↓` 挪 15 分钟、`Shift+↑/↓` 挪 1 小时、`←/→` 挪一天，拖动中 `Esc` 取消。改完有 5 秒可撤销，落盘失败会自动回滚并重新对账。**重复日程与超过 24 小时的日程暂不支持拖动改期**（请在详情里编辑）。
- **点开就能改**：点任意日程打开右侧详情 —— 时间、时长、重复规则的人话（`FREQ=WEEKLY;COUNT=6` → 「每周（共 6 次）」）、地点、备注、uid 一键复制；接着「编辑」或「删除」（删除要二次确认）。
- **新建**：标题、日期、开始/结束、全天、地点、备注、重复（每天/每周/每月/每年，或直接写 RRULE）。
- **冲突提醒**：保存前若与已有日程重叠，会把重叠的几条列出来问你是否继续。
- **没配置也能配**：未填 CalDAV 账号时显示引导，点「连接设置」就在面板里把账号填好（先测后存）；也可以点「查看示例」先看面板长什么样，示例数据有明确标注，不会冒充你的真实日历。
- **跟随主题与语言**：配色全部走宿主设计令牌（`--dsw-*`），深浅色主题自动适配；文案跟随 Settings → General 的语言。
- **安全**：面板只与插件自己的 `/_dsh/dsh-calendar/settings` 通信；该路由仅回环地址可达，写操作还要过 Host / Origin / Content-Type 三道校验，响应里永不回显账号密码。
## 时间与时区

输入输出统一 ISO 8601。定时事件输出为 UTC（如 `2025-01-15T01:00:00Z`），全天事件输出 `YYYY-MM-DD`。输入可带时区偏移（如 `2025-01-15T09:00:00+08:00`），插件内部转 UTC 存储。

## 版本记录

- **0.5.4（2026-09-18）**：修复 `calendar_update` 丢 ATTENDEE/VALARM 等原始属性、RECURRENCE-ID 覆盖实例被忽略、`calendar_create` 的 uid 不用服务器 Location、展开超限静默返回空；`calendar_search` 支持时间窗。测试 79 项。
- **0.5.3（2026-09-11）**：复验官方 Harness 0.1.5-rc.1，更新同载与真实服务验证记录；运行时代码未变。
- **0.5.2 及更早**：见 [CHANGELOG.md](CHANGELOG.md)。

## 已知限制

- **网络可达性**：若无法直连，可用 `proxyUrl` 指定本机 HTTP 代理，或改用可直连的 CalDAV 端点。


- 重复事件展开：calendar_list 默认用 ICAL.RecurExpansion 展开 RRULE（`expand=true`），受 `maxOccurrences` 封顶，展开超出迭代预算时显式报错；calendar_search 只查 start~end 窗口（默认当前前后各 1 年），仍返回原始系列（不展开）。
- 单次实例的读取与改/删：calendar_list 展开时识别 RECURRENCE-ID 覆盖实例（单独改期/改标题的实例按覆盖后的时间与字段返回，被 EXDATE 排除原时间的覆盖实例仍会返回）；calendar_update / calendar_delete 仍针对整个重复系列（按 uid 操作），无法只修改或删除某一次发生。
- OAuth 凭据需要事先取得：支持刷新令牌认证，但不提供浏览器登录 UI / 登录 CLI，也不把运行时令牌写回配置文件。
- 时区规则：带 TZID（命名时区）的事件输出会转成 UTC（Z）；全天边界、夏令时等复杂时区规则不做精细化处理。
- 无设置页 UI：本轮为 node 半身，配置只走 cordis.patch.yml，不提供 Web 设置页。
- 日历发现：iCloud 需手动填完整日历集合 URL；不做 principal 自动发现与多日历选择。
- 取消/超时：工具使用 timeoutMs（60 秒），并向令牌刷新与 DAV 网络请求透传宿主 AbortSignal；并发调用独立取消。

## 开发

- **UI 行为测试**：`test/render.test.mjs` 用 jsdom + 真 React 渲染周视图并派发真实事件（点击 / 拖动 / Esc / 卸载 / 边缘滚动）。改前端交互时它会替你点一遍；`pnpm test` 会一起跑。

```bash
pnpm install
pnpm test   # 构建 + node --test
```

构建产物在 `lib/`，测试在 `test/*.test.mjs`（不依赖真实账号）。

## 相关插件

- [dsh-calendar](https://github.com/STARDUSTLC666/dsh-calendar) — CalDAV 日历五件套
- [dsh-slack](https://github.com/STARDUSTLC666/dsh-slack) — Slack 通知/收件箱
- [dsh-dingtalk](https://github.com/STARDUSTLC666/dsh-dingtalk) — 钉钉群通知（零依赖）
