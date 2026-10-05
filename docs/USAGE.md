# dsh-calendar 使用说明

[返回简介](../README.md) · [更新记录](../CHANGELOG.md) · [验证记录](VALIDATION.md)

## 本次改进

日期使用 YYYY-MM-DD；带时间使用带 Z 或 UTC 偏移的 ISO 格式。错误日期会在创建或更新远端日程前报错，原日程保留。

## 安装

```bash
dsh plugin --profile web add dsh-calendar
```

安装后重启 dsh。插件会向 profile 插入一行 id 为 `calendar` 的配置行（见本包的 cordis.patch.yml）。默认 provider 为 custom 且未填任何凭证，此时插件照常加载，但工具在调用时会抛出中文指引错误，提示你补全配置。

## 配置

**推荐：在面板里配（0.6.0+）**

打开面板右上角的「连接设置」，选服务商 → 填地址与账号 → 点**「测试连接」**（它会真的去列未来 30 天的日程）→ 通过后点「保存并启用」。工具的下一次调用立刻用上新配置，不用重启、不用编辑 YAML。

Harness 0.1.7 及以上通过宿主设置服务写入 profile 中的 `calendar` 配置行，修改立即生效；更早版本使用 `settings.yaml` 的 `dsh-calendar` 命名空间。密码、client secret 和 refresh token 只显示是否已配置，不回填到浏览器。若宿主设置服务不可用，则存入 `$DSH_HOME/data/dsh-calendar/connection.json`，面板会说明存储位置。已有配置与环境变量继续作为缺省值；无需重新填写原来的凭据。

这里需要的是日历服务凭据，DSH 的模型 API 密钥不能用于日历登录。Google 使用 OAuth，iCloud 使用应用专用密码；查看面板和导入文件本身不依赖模型调用。

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

## 导入 ICS 日程

1. 在「设置 → 日历」连接好目标日历，点击「导入 ICS」。
2. 选择 `.ics` 文件，或粘贴完整 `VCALENDAR` 内容。如果时间没有 `TZID` 或 UTC 标记，主动选择解释时区（中国常用 `Asia/Shanghai`）。文件已有时区会保留，不会被这个选项覆盖。
3. 点击「预览与检查」。核对标题、时间、重复例外、已有 UID 与首场重叠提示；此步骤只读取目标日历，不写入。
4. 勾选需要的日程，或选择下一批，再点击「确认导入」。每批最多 20 个日程系列。失败项保留重试入口，已成功的项目不会重复写入。

同一 UID 的主日程与 `RECURRENCE-ID` 例外作为一个资源导入，保留 `RRULE`、`EXDATE`、日期形式的 `RDATE` 和 `VTIMEZONE`。目标日历中已经存在的 UID 会跳过，不覆盖其内容。预览保留 15 分钟；切换账号、日历地址或凭据后必须重新预览。停止本批时，请重新预览核对已完成的写入。

导入的是私人副本：不导入 `ATTENDEE`、`ORGANIZER`，不会发送会议邀请；仅保留 `DISPLAY` 屏幕提醒。VTODO、VJOURNAL 等非日程组件会标明并跳过。重叠提示仅检查系列首场，不能证明所有重复实例都没有冲突。

单个文件最多 256 KiB、100 个 UID 系列（含例外最多 1000 个 VEVENT）；目标日历最多 5000 个对象、16 MiB。超限或服务器存在无法解析的日程时，导入会停止并说明原因。暂不支持 `PERIOD` 类型的 `RDATE`、缺少主记录的重复例外、缺少 DTSTART 的取消例外及 `METHOD:CANCEL` 文件；请在原日历应用整理或重新导出。未知 TZID 需要原文件提供完整、有效的 VTIMEZONE，不能默认为北京时间。

## 卸载

```bash
dsh plugin --profile web remove dsh-calendar
```

卸载后重启 Web 服务。如需彻底清理，可再手动删除自己 profile `cordis.patch.yml` 中的对应插件行。

## 代理与网络

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

> 外部 OAuth 应用处于 Testing 时，日历权限的刷新令牌通常在 7 天后过期。生产配置应按 Google 的要求处理；改成生产状态也不保证令牌永久有效，撤销授权、长期未使用或管理员策略等仍可能使其失效。见下文官方规则。

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

Google：仅支持 OAuth 2.0。401/403 时检查 OAuth 授权、日历范围与日历访问权限；如果令牌刷新和 PROPFIND 成功而 REPORT 返回 403，核对实际授予的范围是否为上述 `calendar`，不要将 `calendar.readonly` 的集合探测成功当作日程读取成功。刷新失败提示会按 Google 返回的 OAuth 错误代码区分下一步：`invalid_grant` 表示授权可能已失效或与当前应用不匹配，可从连接设置重新授权；`invalid_client` / `deleted_client` 指向 OAuth 应用配置；`invalid_scope` 指向授权权限范围；HTTP 429/5xx 指向服务暂时不可用，应稍后重试。其他错误保留 HTTP 状态码和安全的错误代码供排查，不会仅因 HTTP 400 就判断授权过期，也不会显示服务端自由文本。外部 OAuth 应用处于 Testing 状态时，包含日历权限的刷新令牌会在 7 天后过期；长期使用需处理重新授权或按 Google 要求配置生产状态，详见 [刷新令牌到期规则](https://developers.google.com/identity/protocols/oauth2#expiration)。**重新生成应用专用密码不能解决 Google CalDAV 认证失败。**

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

## 已知限制

- **网络可达性**：若无法直连，可用 `proxyUrl` 指定本机 HTTP 代理，或改用可直连的 CalDAV 端点。

- 重复事件展开：calendar_list 默认用 ICAL.RecurExpansion 展开 RRULE（`expand=true`），受 `maxOccurrences` 封顶，展开超出迭代预算时显式报错；calendar_search 只查 start~end 窗口（默认当前前后各 1 年），仍返回原始系列（不展开）。
- 单次实例的读取与改/删：calendar_list 展开时识别 RECURRENCE-ID 覆盖实例（单独改期/改标题的实例按覆盖后的时间与字段返回，被 EXDATE 排除原时间的覆盖实例仍会返回）；calendar_update / calendar_delete 仍针对整个重复系列（按 uid 操作），无法只修改或删除某一次发生。
- OAuth 凭据需要事先取得：支持刷新令牌认证，但不提供浏览器登录 UI / 登录 CLI，也不把运行时令牌写回配置文件。
- 时区规则：带 TZID（命名时区）的事件输出会转成 UTC（Z）；全天边界、夏令时等复杂时区规则不做精细化处理。
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
