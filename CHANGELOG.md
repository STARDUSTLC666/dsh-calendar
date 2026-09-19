# Changelog

## 0.6.0（2026-09-19）

- **新增设置页日历面板**：月 / 周 / 议程三种视图；点日程开右侧详情（时间、时长、重复规则的人话、地点、备注、uid），可直接改标题时间、加重复、删除（二次确认）；新建支持全天 / 地点 / 备注 / RRULE；保存前做冲突检测。
- **新增对话页悬浮入口**：右下角 📅 小按钮点开同一个面板（非模态、Esc 关闭）。自绘 root 使用平台 seed 模块表里的 `react-dom/client`，控件优先用官方 `ui-primitives`（Button / Input / Checkbox / Modal / writeClipboard），老宿主缺这些时自动退回自绘控件，面板不会整块消失。
- **新增网页端后端** `/_dsh/dsh-calendar/settings`（status / list / create / update / delete）：与 dsh-email 设置路由同一套安全模型 —— 仅回环地址可达、Host 必须是 localhost 名（挡 DNS rebinding）、写操作要求 `application/json` 且校验 Origin / Sec-Fetch-Site、响应永不回显凭据。
- 参数校验复用工具层同一套断言（`assertIsoTime` / `assertTimeRange`），校验失败不打扰 CalDAV 服务器；为此把 `asRecord` / `optionalString` / `assertIsoTime` / `assertTimeRange` / `isoNoMillis` / `sortEvents` 变成共享导出，避免两处语义漂移。
- 未配置 CalDAV 时面板显示引导态与「查看示例」，不再只丢一条报错。
- **新增面板内连接配置**：面板工具栏的「连接设置」支持 Google / iCloud / Nextcloud / 自建四种服务商。填完先「测试连接」（真去列未来 30 天日程），通过才允许保存；保存时服务端还会再测一次 —— 因此「保存成功」等价于「这套凭据刚才真的连上了」，一个连不上的地址不会被写进配置。密码 / clientSecret / refreshToken 不回填到前端（placeholder 显示「已保存，留空不改」），留空即沿用已存值。
- 面板配置写入宿主 settings 命名空间 `dsh-calendar`（`src/settings.ts`）：**面板没填过的字段仍由 profile 的 `cordis.patch.yml` 兜底**，两份配置共存、老部署零迁移；宿主没有 settings 服务时面板自动退化为只读并说明原因。工具层改为「每次调用现取配置」（`CalendarConfigSource`），所以面板保存后无需重启。
- 后端新增 `connection` / `testConnection` / `saveConnection` 三个动作；新增依赖 `schemastery`。测试 88 → 98 项。
- CI 增加 `node --check lib/client.js`（网页端源码不走 tsc，只能语法自检）。测试 79 → 88 项。

> 完整历史（含详细改动说明）。README 只保留最近几个版本的一句话摘要。

## 中文版

- **0.5.4（2026-09-18）**：**修复**：①`calendar_update` 重建 VEVENT 会静默丢掉原事件的 ATTENDEE / ORGANIZER / EXDATE / STATUS / CATEGORIES / VALARM（改一次标题就删掉邀请人和提醒），现在改为在原始 VCALENDAR 上做字段级覆盖，并补齐 RFC 5545 必需的 VERSION / PRODID / UID / DTSTAMP；②RECURRENCE-ID 覆盖实例被忽略（被单独改期的实例按原时间+旧标题返回，或被 EXDATE 排掉后整条消失），现在建覆盖映射并在展开时替换对应实例；③`calendar_create` 返回本地拼的 uid 而忽略服务器 `Location`，导致 create 后 update 找不到事件（现在优先取 Location，缺失时回读确认），且 create 的 PUT body 补上 VERSION / PRODID / DTSTAMP。**优化**：重复事件展开预算耗尽时不再静默返回 0 条（DTSTART 在 2010 的每小时系列实测 680ms 且返回空），改为显式报错并提示缩小时间范围或补 COUNT/UNTIL；`calendar_search` 支持 `start` / `end` 并走 timeRange 查询（缺省用有界窗口），不再先整本下载再过滤。测试 68 → 79 项。
- **0.5.3（2026-09-11）**：复验官方 Harness 0.1.5-rc.1，更新整套同载与真实服务验证记录；运行时代码未变。
- **0.5.2（2026-09-08）**：补充官方 Harness 0.1.3-alpha.2 的安装、加载与真实 Google 工具调用验证，更新兼容性和 Node 版本要求；运行时代码与 0.5.0 相同。
- **0.5.1（2026-09-08）**：补充真实 Google OAuth/CalDAV 读取验证、`calendar.readonly` 与 `calendar` 范围对比及 Testing 刷新令牌到期说明；运行时代码与 0.5.0 相同。
- **0.5.0（2026-09-07）**：修复 Google CalDAV #2：新增 OAuth 凭据与环境变量配置、请求时刷新、取消与代理透传；健康检查区分 Basic/OAuth，修正误导的应用专用密码说明。保留其他服务的 Basic 认证。
- **0.4.0**：新增 `calendar_health` 自检（离线检查 CalDAV 端点与凭据配置，不验证连接）。
- **0.3.2**：
  - 修复 `calendar_update` 更新其他字段时丢失 `rrule` 的问题。
  - 更新与新建都会校验 `end >= start`，并拒绝 `2025-02-30` 这类不存在的日期。
  - `calendar_list` / `calendar_search` 输出按开始时间稳定排序；搜索 `limit` clamp 到 1-200。
  - CalDAV 客户端创建失败后清空缓存，下一次调用可自动重试，不再永久复用 rejected promise。

## English

- **0.5.4 (2026-09-18)**: **Fixes**: (1) `calendar_update` rebuilt the VEVENT and silently dropped ATTENDEE / ORGANIZER / EXDATE / STATUS / CATEGORIES / VALARM — renaming an event deleted its guests and reminders; the update now does field-level replacement on the original VCALENDAR and fills in the RFC 5545 essentials (VERSION / PRODID / UID / DTSTAMP). (2) RECURRENCE-ID overrides were ignored: a moved instance came back with its old time and title, or disappeared entirely when an EXDATE removed the original slot; overrides are now mapped and substituted during expansion. (3) `calendar_create` returned a locally invented uid instead of the server `Location`, so a follow-up update could not find the event (Location is now preferred, with a read-back check when absent), and the create body now carries VERSION / PRODID / DTSTAMP. **Improvements**: an exhausted expansion budget no longer returns an empty result silently (an hourly series starting in 2010 took 680ms and returned nothing) but raises a clear error suggesting a narrower range or COUNT/UNTIL; `calendar_search` accepts `start`/`end` and queries by timeRange instead of downloading the whole calendar first. Tests 68 → 79.
- **0.5.3 (2026-09-11)**: revalidate official Harness 0.1.5-rc.1 and refresh suite co-load and live-service evidence; runtime code is unchanged.
- **0.5.2 (2026-09-08)**: document installation, loading and real Google tool execution in official Harness 0.1.3-alpha.2; update compatibility and Node requirements. Runtime code is unchanged from 0.5.0.
- **0.5.1 (2026-09-08)**: document live Google OAuth/CalDAV read validation, the `calendar.readonly` versus `calendar` scope results and Testing refresh-token expiration. Runtime code is unchanged from 0.5.0.
- **0.5.0 (2026-09-07)**: fix Google CalDAV #2 with OAuth configuration/environment credentials, request-time refresh, cancellation and proxy forwarding. Make health checks and error guidance authentication-aware; retain Basic authentication for other servers.
- **0.4.0**: new `calendar_health` self-check (offline endpoint and credential configuration checks, not a connection test).
- **0.3.2**:
  - Fix `calendar_update` dropping `rrule` while updating other fields.
  - Validate `end >= start` and reject impossible dates such as `2025-02-30`.
  - Sort `calendar_list` / `calendar_search` output by start time and clamp search `limit` to 1-200.
  - Reset the cached CalDAV client after creation failure so the next tool call can retry.
