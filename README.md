**简体中文** · [English](README.en.md)

# Calendar

> **看清今日日程、精准找空档，并在冲突核对后安全写入 CalDAV 日历。**

DeepSeek Harness（`>=0.2.2-rc.3`）原生日历工作台：默认 **Bento 卡片工作室**搭配顶部**今日聚焦条**，支持 4 套布局与 13 套明亮风格 × 8 套双层字体实时切换。

[![npm](https://img.shields.io/npm/v/dsh-calendar)](https://www.npmjs.com/package/dsh-calendar) [![downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-downloads.svg)](https://www.npmjs.com/package/dsh-calendar) [![total downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-total-downloads.svg)](https://www.npmjs.com/package/dsh-calendar)

**[核心能力](#核心能力) · [安装](#安装) · [快速上手](#开始使用) · [完整说明](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/REFERENCE.zh.md)**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 640px)" srcset="https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/workflow-zh-mobile-dark.svg">
  <source media="(max-width: 640px)" srcset="https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/workflow-zh-mobile-light.svg">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/workflow-zh-dark.svg">
  <img src="https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/workflow-zh-light.svg" alt="Bento 日历工作室与今日聚焦条：看清日程、定位空档并核对写入。 · 流程示意" width="100%">
</picture>

## 核心能力

| 模块 | 核心特性 |
| :--- | :--- |
| **Bento 工作室 + 今日聚焦条** | 默认立体卡片 Bento 布局（1 键切换原生 / 浮岛 / 聚光 / Bento）；顶部聚焦条实时展示今日徽章、下一日程倒计时、冲突状态与 `+ 快速新建` |
| **多视图与高效排期** | 月 / 周 / 议程视图（快捷键 `M`/`W`/`A`）、周视图 15 分钟拖拽改期（5 秒撤销）、iCloud 自动发现及文字/截图智能生成草稿 |
| **找空闲时段与一键邀约** | 按时长、工作日与前后缓冲检索空档（`F`），支持「复制空闲时段文案」直发微信/钉钉/Slack/邮件，或直接套用新建草稿 |
| **冲突核对与 ICS 导入** | 新建草稿与 `.ics` 文件/文本导入均先检查重叠冲突与去重，确认后再写入远端日历 |
| **导览与跨插件外观** | 内置 4 步交互式 `? 引导` 聚光灯导览，支持 13 套设计风格、4 套事件配色与 8 套字体搭配（默认跟随风格专属字） |

<details>
<summary>查看工作台实景截图（Bento 布局 + 今日聚焦条）</summary>

![Calendar 默认 Bento 卡片工作室布局与今日聚焦条](https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/screen-zh.webp)

截图来自 DeepSeek Harness 0.2.2-rc.3 中的 Calendar（默认 Bento 布局 + 今日聚焦条），使用示例日程。

</details>

## 安装

在 DSH 桌面版「插件」面板安装 `dsh-calendar`，或使用命令行：

```bash
dsh plugin --profile desktop add dsh-calendar
```

网页版将 `desktop` 改为 `web`，安装后重启 DSH。宿主要求：`>=0.2.2-rc.3`。

## 开始使用

1. **连接日历或试看示例**：打开左侧栏「日历」进入 Bento 工作室，在「连接」选择 iCloud / Google / Nextcloud / 自建 CalDAV，先「测试连接」再保存（也可先点「查看示例」）。
2. **切换视图与查找空档**：按 `M / W / A` 切视图，按 `F` 设定时长与缓冲查找空闲时段，一键复制邀约文案或套用此时段建稿。
3. **冲突核对与助手协作**：点 `+ 快速新建` 从文字/截图生成草稿或预览导入 `.ics`，随时点顶栏 `? 引导` 重温导览并复制对话指令。

### 常用对话示例

- **查找会议空档**：`帮我找本周下午两个 45 分钟空闲时段，工作时间按 13:30–18:00，前后预留 15 分钟缓冲，先列出候选不要直接创建。`
- **今日议程与冲突**：`汇总今天的会议议程并提醒冲突，按时间顺序列出每场日程的起止时间与地点。`
- **寻找深度工作块**：`读取我下周的日历安排，指出会议最密集的一天，并标出可用于深度工作的两小时整块空闲。`

## 开始前要知道

- 需自备 CalDAV 账号；空闲查询仅覆盖当前已连接的日历。
- 详细配置、工具清单与排错见 [完整说明](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/REFERENCE.zh.md)。

## 插件更新

在工作台或原生插件详情页底部检查更新。默认自动检查，**默认不自动安装**；Suite 管理的组件随整包更新。

## 文档与反馈

- [完整使用、配置与边界](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/REFERENCE.zh.md) · [更新记录](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/CHANGELOG.md) · [验证历史](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/VALIDATION.md)
- 欢迎 Star、提交 [Issues](https://github.com/STARDUSTLC666/dsh-calendar/issues) 与 [PR](https://github.com/STARDUSTLC666/dsh-calendar/pulls)（反馈请附版本与复现步骤，并移除凭据）。

## License

[MIT](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/LICENSE)

<a id="依赖与配置"></a>
