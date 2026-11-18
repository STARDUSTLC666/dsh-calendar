# dsh-calendar 工作台 / Workbench

日历主工作台，日期导航、月周议程切换与日程编辑分层更清楚。

Calendar workbench with clearer date navigation, views and event editing.

## 使用 / Use

更新插件并重启 DSH，在原生左侧栏打开工作台；没有固定时可在“更多”中找到。原有“设置”入口继续可用。侧栏排序和固定由 DSH 管理。

Update the plugin, restart DSH and open its native sidebar panel (or More if it is not pinned). The existing Settings entry remains available. DSH owns sidebar order and pinning.

界面跟随宿主中英文和深浅色，保留日程原文。日程侧栏提供迷你月历、当前 CalDAV 日历的显隐、冲突摘要和插件更新。窄窗口中侧栏上移，周网格可横向滚动。删除日程前需确认。

The UI follows the host language and theme and shows event text as entered. The schedule sidebar contains the mini calendar, visibility for the connected CalDAV calendar, conflicts, and plugin updates. In narrow windows the sidebar moves above the calendar and the week grid scrolls horizontally. Deleting an event requires confirmation.

顶部提供 DSH 原生、Arc 浮岛、Raycast 聚光和 Bento 卡片四种布局，以及原稿的蓝、紫、橙、绿四套配色。配色随宿主深浅色切换，仅应用于日历工作台。拖动侧栏分隔条或聚焦后按左右键调整宽度。浏览器会记住布局、配色和侧栏宽度。焦点在工作台内时，`Ctrl/⌘ + Shift + K` 打开可搜索的快捷操作，`W`、`M`、`A` 切换周、月、议程，`N` 新建，`F` 查找空闲。

The header offers DSH Native, Arc Floating, Raycast Spotlight, and Bento Cards, with the reference's blue, purple, orange, and green palettes. The palette follows the host color mode and applies to the calendar workbench. Drag the sidebar separator or focus it and use the arrow keys to resize. The browser remembers the layout, palette, and width. With focus inside the workbench, `Ctrl/⌘ + Shift + K` opens searchable actions, `W`, `M`, and `A` switch views, `N` creates a draft, and `F` finds free time.

## 源码 / Source

工作台源码位于 `templates/client.js`、`templates/panels/` 和 `templates/workbench-ui.js`。样式位于 `templates/calendar.module.css`。构建脚本通过 CSS Modules 编译样式并生成 `lib/client.js`，控件从宿主加载。

The workbench sources live in `templates/client.js`, `templates/panels/`, and `templates/workbench-ui.js`. The build compiles `templates/calendar.module.css` and generates `lib/client.js`. The client loads the controls from the host.

## 验收范围 / Validation boundary

当前版本要求宿主 DSH `>=0.2.2-rc.3`。工作台顶部内置可折叠「三步用起来」指南与一键复制的对话巡检指令。历史回归记录（早期 `>=0.2.2-rc.3` 升级前基线）：Windows 后台 Chrome/Playwright 实际点击和输入；覆盖中英文、浅深色、1536px 与 390px、状态读回与控制台。Browser plugin 不可用，因此使用本地 Playwright。

邮件使用受控 AgentMail HTTP 服务，日历使用受控 CalDAV 协议传输；插件处理器、存储、校验和原生宿主均实际运行。未使用真实邮箱、真实日历账号或付费模型。RSS 访问 Node.js 官方公开来源。PPT 实际生成并渲染 PPTX、下载 ZIP；两个视频插件实际运行官方引擎并播放 MP4。

这些是 Web 共用界面的验收结果，不代表已验收 Electron 专属菜单、系统权限、真实账号、全部外部来源或所有可选模型/引擎。Docker、Slack、钉钉继续按用户约定搁置。

## 中文账号 / Unicode accounts

Basic 认证现以 UTF-8 编码账号和密码，中文账号不再被本地 Latin-1 编码器拒绝。服务端仍须支持该账号及 UTF-8 凭据。OAuth 路径保持独立；遇到 401 请核对服务商要求的账号格式与授权。

Basic credentials use UTF-8, avoiding local Latin-1 encoding failures for Unicode names. The server must still accept the account and encoding. OAuth is unaffected.
