# dsh-calendar 验证记录

[0.10.1 中英文界面验收](validation-language-2026-10-03.md)。

本页整理原 README 的历史验证说明，保留当时的版本、日期与范围。自动测试、启动检查、浏览器操作和真实服务验收分别记录，不能相互替代。更详细的版本验收文件仍保留在仓库中。

## 当前版本

- **0.10.3 / 2026-10-05**：Windows 自动测试 194 通过。官方 npm Harness `0.2.1-alpha.1` 网页实际操作完成日程创建（隔离 CalDAV 服务），并在 424×612 窗口复测浮层与发送按钮：浮层在视口内，按钮区域无交集，聊天消息可正常发送。外部 CalDAV 账号和桌面原生窗口未重新验收。
- [0.10.0：ICS 导入、失败重试与窄屏操作验收](validation/0.10.0.md)

## 原中文记录

**0.9.0** 起适配 Harness **0.1.7** 的设置接口：宿主移除了 `ctx.settings.register`，设置项改由 entry 的 `Config` 承载。连接字段全部声明为 `volatile`（面板改完即生效，无需重启），三个凭据按 `secret` 处理（不回传浏览器，只回「有没有」）；升级后首次启动会把老 `settings.yaml` 里的 `dsh-calendar` 段搬进 profile（只补空缺、只搬一次，profile 里已写过的值优先）。0.1.5 / 0.1.6 宿主仍走原来的命名空间注册，行为不变。当前验证宿主为官方源码构建的 **0.2.0-rc.2**；真实 CalDAV 业务仍需有效账号单独验证。

**0.8.4（2026-09-23）**适配 Harness **0.1.7** 的 Web 子路径部署：日历面板的请求会跟随应用路径，修复经过反向代理访问时设置与事件操作失败的问题。真实 CalDAV 业务仍需有效账号单独验证。

遵循官方[插件打包与安装要求](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)：ESM 入口、预构建 `lib/`、`dsh.bundle.patch` 和 `cordis.patch.yml` 配置层；显式注入 `tools`，提供 JSON Schema 参数、规范化输出和渲染函数，运行时不 import `@deepseek-ai/*` 内部模块。使用 Node 22.19 及以上的 22.x 或 Node 24 及以上版本；Harness 仍在快速迭代，上述版本是实测基线。

## Original English record

Version **0.9.0** (2026-09-23) follows the settings interface introduced in Harness **0.1.7**: the host removed `ctx.settings.register`, so configuration now lives in the entry's own `Config`. Every connection field is declared `volatile` (panel edits apply live, no restart) and the three credentials carry the `secret` role (never returned to the browser, only whether they are set). On the first start after an upgrade the plugin moves the retired `dsh-calendar` section of `settings.yaml` into the profile — filling only absent keys, once, with values already written in the profile winning. Hosts on 0.1.5 / 0.1.6 keep the previous namespace registration unchanged. The verified host baseline is official-source **0.2.0-rc.2**; live CalDAV operations still require their own account validation.

Version **0.8.4** (2026-09-23) supports the Web mount paths introduced in Harness **0.1.7**. The calendar panel keeps its requests under the application path when deployed through a reverse proxy, preserving normal settings and event operations.

On 2026-09-10, npm `dsh-calendar@0.5.2` passed installation through this Harness release's official CLI and registration of all 6 tools. Host execution of `calendar_list` refreshed a real Google token (200), read via CalDAV REPORT (207) and rendered model-facing results. Only Google reads were tested; no writes were performed. This is a historical read-only verification record.

Follows the official [plugin packaging and installation requirements](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md): an ESM entry point, prebuilt `lib/`, `dsh.bundle.patch` and a `cordis.patch.yml` layer. The plugin explicitly injects `tools` and supplies JSON Schema parameters, canonical output and rendering, with no runtime imports of `@deepseek-ai/*` internals. Use Node 22.19 or later within 22.x, or Node 24 or later. Harness is evolving rapidly; the version above is the tested baseline.
