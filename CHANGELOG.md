# Changelog

## 0.9.0（2026-09-27）

- 适配 Harness 0.1.7 设置表单与旧配置导入，正确声明设置服务依赖。示例日历改为只读，保留视图切换和详情查看，避免示例操作写入真实日历。

- **适配 Harness 0.1.7 的设置接口**：宿主删掉了 `ctx.settings.register(...)`，改成「entry 的 `Config` 就是设置项」（`.volatile()` 字段由宿主投影成表单）。0.8.x 在 0.1.7 上会直接挂载失败（`ctx.settings.register is not a function`）；即使不失败，连接设置也只剩插件自己的 JSON 兜底文件，老用户在 `settings.yaml` 里存过的账号一律读不到（启动告警「日历账号未填写」）。
- **新增 `src/host-config.ts`**：导出 entry 的 `Config` —— 14 个连接字段全部 `.volatile()`（设置页改完即生效，不必重启），`password` / `clientSecret` / `refreshToken` 标 `role('secret')`（不经设置接口回传，只回「有没有」），且**一律不给默认值**：表单默认值会盖掉 `cordis.patch.yml` 与 provider 预设。`liveConfig` 把宿主的活引用摊平成普通值，0.1.6 及更早的字面量配置走同一条路。
- **新增 `src/host-settings.ts`**：两代宿主接口判定，加上老 `settings.yaml` 里 `dsh-calendar` 段的一次性搬迁。宿主自己也会导入老文件，但它按 **entry id** 找目标，而本插件的行 id 是 `calendar`，对不上就只留一条 warn、值搁在改名后的文件里 —— 所以由插件补这一步：只补当前配置里空缺的键（profile 已写过的值优先）、只搬一次（标记 `legacySettingsImported` 与值写在同一处）、不复制进同插件的自定义实例、读不到或写不进都不抛（原文件原样保留）。
- **写入语义**：面板保存改用 `mutate` 的逐字段 set/unset。`replace` 会把「本次没提交」的 live 字段重置成下层继承值，顺手抹掉面板不认识的字段（例如上面那个搬迁标记），下次启动就会重搬一遍，用户明确删掉的凭据又回来了。宿主没有 `mutate` 时才退回 `replace`，并显式把标记带上。
- 自带设置页向宿主登记 `configure({ auto: false })`，并声明 `tools` 与 `settings` 服务依赖，保证设置面板接入宿主存储。
- **测试 163 → 172**：Config 形状（volatile / secret / 无默认值）、活引用摊平、两代宿主判定、mutate 与 replace 两条写路径、搬迁的一次性与「不串实例」、apply 在 0.1.7 宿主上不再抛错且面板路由照常挂载、面板保存全链路。

## 0.8.4（2026-09-23）

- **适配 Harness 0.1.7 的 Web 子路径部署**：面板请求改为跟随应用挂载路径。此前宿主被反向代理挂在子路径下时，设置与事件操作会打到站点根，一律 404。
- 未配置账号/密码时的提示改为指向面板「连接设置」（不再要求用户去改 `cordis.patch.yml` 并重启）。
- 新增子路径部署下的请求路径回归（`test/public-mount.test.mjs`）。

## 0.8.3（2026-09-21）

- 已知事件的修改、删除及创建后回读改为直接 CalDAV multiget，省掉整集合索引查询；每次仍读取最新 ETag，保留条件写入。
- 限定事件地址属于当前日历；无 calendar-data 的响应不会触发写入或删除。
- 新增真实 tsdav 请求回归，覆盖请求次数、ETag、取消与缺失事件；全量 161 项测试通过。更新中英文介绍，补齐已有的可视化面板与连接设置说明。

## 0.8.2（2026-09-20）

- **修主题色误用**：此前把宿主遮罩 token `--dsw-alias-bg-mask-3` 当淡色 hover/底纹用；DSH 0.1.6-alpha.2 里它实测亮/暗主题都是 `rgba(0,0,0,.48)`，导致周视图「今天」整列、月视图格子 hover、加载骨架屏、详情 tag 全部发深灰（浏览器视觉验收抓到，视觉上像一块无字灰板）。现改为 `color-mix`（label-primary 5%~7% / business-primary 7%），mask-3 只保留在 `.dshc-overlay` / `.dshc-modalwrap` 两处真正的遮罩上。
- **修 Esc 关错层**：详情抽屉/新建表单打开时按 Esc 会连整个日历浮层面板一起关掉。现在 Esc 只关最上面一层，第二次才关面板；焦点在上层宿主 `PRIM.Modal` 里时让行给宿主；输入法组合状态（`isComposing`）不误关；设置页与对话页两个面板并存时一次也只关一层，并按实际打开顺序关。
- **测试**：render 测试 7 → 15 条（新增抽屉/宿主 Modal 真假路径/宿主高层浮层让行/普通宿主元素兜底/层序/IME 等用例），全量 154 pass。该版经两位独立评审：首轮抓到「宿主 Portal 抢 Esc」「双面板一次连关两层」「IME 误关」，二轮抓到「宿主高层 Modal 盖上来时关错下面那层」，均已修。

## 0.8.1（2026-09-19）

- **新增真 DOM 行为测试层**（`test/render.test.mjs`，devDependencies 里加 `react` / `react-dom` / `jsdom`，不进发布包）：用 jsdom + 真 React 渲染周视图，然后真派发 `pointerdown/move/up`、`click`、`keydown`。7 条覆盖：渲染不抛、点事件不会顺手弹「新建」、拖动只提交一次且按视口坐标换算、拖动中 Esc 零请求、卸载后不留监听器且之后的 pointerup 不提交、拖到边缘 rAF 持续滚动、重复日程被面板挡住。
- **它的第一批产出就是三个真问题**：
  ① **同一批次内拖动不提交**：提交前的「有没有落点」判断读的是 React state（`ghost`），而 `pointermove` 与 `pointerup` 落在同一批次时 state 还没刷新 → 明明拖了却不落盘。改为在 `dragRef` 上记同步标记。
  ② `requestAnimationFrame` / `cancelAnimationFrame` 按全局调用：浏览器里有，但模块作用域下应当显式走 `window.*`。
  ③ 三处 React key 警告（日期头、事件块、幽灵块、日列的子节点用了数组却没给 key）——dev 模式控制台一直在吵。

## 0.8.0（2026-09-19）

- **新增：周视图拖拽改期**。拖动事件块上下改时间、左右换天（15 分钟吸附）；拖块底部 6px 改时长；拖动中显示幽灵落点，与已有日程重叠时描成黄色（允许重叠，只是提醒）；拖到容器上下边缘自动滚动，长会议不用先滚再拖。
- **新增：键盘改期**。Tab 聚焦后 ↑/↓ 挪 15 分钟、Shift+↑/↓ 挪 1 小时、←/→ 挪一天、Enter 打开详情、拖动中 Esc 取消 —— 没有鼠标也能完成一次改期。
- **新增：乐观更新 + 失败回滚 + 5 秒撤销**。本地先动画面再落盘，失败自动回滚并把服务器原话弹出来；成功后提示「已改期 · 撤销」。
- **重复日程与超过 24 小时的日程暂不支持拖动改期**（提示去详情里编辑）：CalDAV 里整个系列是一个对象，而 update 只能改 master 的 DTSTART —— 独立评审实测「把某次实例的目标时间发过去」等于**重锚系列起点**（早于它的实例全丢、COUNT/UNTIL 语义被改、撤销也回不到原系列）。宁可不做，也不做半个数据事故。
- 几何算法全部抽成纯函数（`snapMinutes` / `slotFromEvent` / `moveSlot` / `slotFromDrag` / `resizeSlot` / `rangeOfSlot` / `conflictsForSlot` / `isRecurring`），新增 12 条单测**直接测发布文件里的实现**（跨天、跨月、越午夜、吸附、钳制、冲突判定、拖拽接线契约）。
- 交互细节（两轮独立评审后补的洞）：5px 阈值区分点击与拖动；**点事件不再冒泡去触发「新建日程」**（slot 是日列的子节点，此前点一下会同时弹详情与新建表单，拖完松手也会弹）；只认发起拖动的 `pointerId`；window 监听器**只在挂载时注册一次**并通过 ref 调最新实现（此前按渲染闭包挂/摘，卸载后残留的 `pointerup` 会替用户提交一次改期）；`buttons === 0` / 窗口失焦 / `Esc`（捕获阶段，不顺手关掉浮层面板）都回到原位；边缘自动滚动改用 **rAF 持续滚**并在滚动后重算落点。
- 落盘：改期请求**按 uid 串行 + 合并**（连按方向键只落最后一次）、跳过无效位移、带 15 秒超时；失败回滚后还会 reload 对账（超时可能已经写进去了）。
- 位移改成**日历日 + 墙钟分钟**运算：此前按毫秒加，DST 切换日会偏一小时（评审用 `TZ=America/New_York` 复现，中国时区看不见）；日末钳制也吸附到 15 分钟网格。
- **修一个渲染即崩的 P0**：焦点恢复的 `useEffect` 依赖数组引用了声明在后面的 `data`，TDZ 直接抛错、整个面板打不开（纯函数测试测不到，评审渲染才发现）。
- 明确取舍：拖动越过午夜**滚到次日**（与 Google 日历一致，也让幽灵块按 `slot.dayKey` 的日列渲染自洽），而不是硬钳在当天最后一刻。

## 0.7.0（2026-09-19）

- **新增**：面板**记住上次用的视图**（月/周/议程，存 localStorage；隐私模式写不进去就退回「月」），下次打开不再固定跳回月视图。
- **新增**：周视图**默认落在 07:00**（半夜那几格基本没人看，但需要时还能往上滚，不裁剪任何事件）。
- **适配窄容器**：面板在设置页里比对话页浮层窄得多，现在用容器查询自适应 —— 窄的时候隐藏芯片里的时间前缀（让日程标题露出来）、隐藏重复的面板标题、收紧工具栏间距。
- **修复**：月视图的格子由 `<button>` 改为 `<div role="button" tabIndex=0>`。按钮不能嵌套按钮（芯片本身是按钮），一旦同格有多条日程，浏览器会把外层按钮提前闭合、把芯片挤成网格的兄弟节点；现在结构合法，键盘 Enter/空格仍可新建，并加了回归测试（月视图里不允许出现 `button`）。

## 0.6.0（2026-09-19）

- **新增设置页日历面板**：月 / 周 / 议程三种视图；点日程开右侧详情（时间、时长、重复规则的人话、地点、备注、uid），可直接改标题时间、加重复、删除（二次确认）；新建支持全天 / 地点 / 备注 / RRULE；保存前做冲突检测。
- **新增对话页悬浮入口**：右下角 📅 小按钮点开同一个面板（非模态、Esc 关闭）。自绘 root 使用平台 seed 模块表里的 `react-dom/client`，控件优先用官方 `ui-primitives`（Button / Input / Checkbox / Modal / writeClipboard），老宿主缺这些时自动退回自绘控件，面板不会整块消失。
- **新增网页端后端** `/_dsh/dsh-calendar/settings`（status / list / create / update / delete）：与 dsh-email 设置路由同一套安全模型 —— 仅回环地址可达、Host 必须是 localhost 名（挡 DNS rebinding）、写操作要求 `application/json` 且校验 Origin / Sec-Fetch-Site、响应永不回显凭据。
- 参数校验复用工具层同一套断言（`assertIsoTime` / `assertTimeRange`），校验失败不打扰 CalDAV 服务器；为此把 `asRecord` / `optionalString` / `assertIsoTime` / `assertTimeRange` / `isoNoMillis` / `sortEvents` 变成共享导出，避免两处语义漂移。
- 未配置 CalDAV 时面板显示引导态与「查看示例」，不再只丢一条报错。
- **新增面板内连接配置**：面板工具栏的「连接设置」支持 Google / iCloud / Nextcloud / 自建四种服务商。填完先「测试连接」（真去列未来 30 天日程），通过才允许保存；保存时服务端还会再测一次 —— 因此「保存成功」等价于「这套凭据刚才真的连上了」，一个连不上的地址不会被写进配置。密码 / clientSecret / refreshToken 不回填到前端（placeholder 显示「已保存，留空不改」），留空即沿用已存值。
- 面板配置写入宿主 settings 命名空间 `dsh-calendar`（`src/settings.ts`）：**面板没填过的字段仍由 profile 的 `cordis.patch.yml` 兜底**，两份配置共存、老部署零迁移；宿主没有 settings 服务时面板自动退化为只读并说明原因。工具层改为「每次调用现取配置」（`CalendarConfigSource`），所以面板保存后无需重启。
- 后端新增 `connection` / `testConnection` / `saveConnection` 三个动作；新增依赖 `schemastery`。
- **修复**：宿主 settings 服务改为**懒接入**（每个请求前 `ctx.get('settings')`）。此前依赖 `ctx.inject(['settings'])` 子 fiber 的时序 —— 插件被重复 apply、或命名空间已被注册时它会静默失效，面板就永远停在「settings 服务不可用」。现在命名空间已被注册也不当作失败：值从 `describe()` 描述符读、写走 provider 的 `replace`，功能完全一致。
- **修复**：Nextcloud 表单缺 `username`（认证账号）字段，照原表单填完会报「未配置 username」（`user` 是用来拼 URL 的，认证用的是 `username`）。
- 连接设置表单补齐「怎么拿到这些值」：字段级小字提示 + 可展开的分步说明 + 外链（Google Cloud 凭据页 / OAuth Playground / Apple ID 设置），Nextcloud 的 `user` 与 `username` 也分别写了说明。测试 88 → 102 项。
- **新增 `scripts/google-oauth.mjs`**：一条命令换 Google refresh token —— 起一次性本地回环回调、自动打开浏览器、收到 code 后换 token 并打印；README（中英）的 Google 段改为用它，`files` 增加 `scripts` 让 npm 包内也带这份脚本。测试 102 → 106 项（含本地假令牌端点的全流程测试）。
- 该脚本随后加固：**clientId 自检**（拦下控制台列表里被截断显示的那串，避免拿到一张 Google 400 页）、**授权地址预检**（打开浏览器前先问一次 Google，400 就在终端把原因说清楚）、**PKCE（S256）**、以及回调端口的收尾（预检失败/超时/拒绝都不再留下监听）。测试 106 → 111 项。
- **新增兜底存储**：宿主没有 settings 服务、或命名空间注册失败且无人注册时，连接配置改存插件自己的文件 `$DSH_HOME/data/dsh-calendar/connection.json`（0600，与 dsh-email 的 token 文件同源），面板里会写明「存在哪个文件」而不是笼统一句「不可用」；`/connection` 也会带上 `settingsKind`（settings｜file）与 `settingsReason`，便于排查。
- 文案：兜底存储的说明降级为弹窗底部一行小字（不再是一块看起来像报错的灰条），并改正「密码存在 settings.yaml」的说法 —— 兜底生效时它其实存在 `connection.json`。
- **修复**：settings 命名空间改为**插件加载时同步注册**。此前是在请求处理里懒注册，而宿主的 `register` 内部会 `ctx.effect(...)`（需要插件的活动作用域），在请求上下文里会失败；失败又被吞掉，于是表现成「面板看着能用，一保存就报 `settings namespace "dsh-calendar" is not registered`」。现在注册发生在 apply 阶段，真实失败会以 `dsh-calendar: …` 警告打到终端；插件被重复 apply 时第二个实例不再注册、直接搭既有注册的车。
- **修复**：Windows 上打开浏览器改用 `rundll32 url.dll,FileProtocolHandler`。此前用 `cmd /c start <url>`，授权 URL 里的 `&` 被 cmd 当成命令分隔符，浏览器只收到第一段 —— Google 的表现是 `Required parameter is missing: response_type`（预检查不出来，因为脚本自己发的请求是完整的）。换 token 脚本改为**交互式**：直接敲 `node scripts/google-oauth.mjs`，它会依次问 clientId 与 clientSecret，并识别「把文档示例文字当值粘进来」这种情况。
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
