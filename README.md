# dsh-calendar

[English](README.en.md)

![dsh-calendar 鲸鱼娘插件封面](https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/assets/cover-whale-girl.png)

在 DSH 日历工作台连接 CalDAV，查看、创建和调整日程。支持月历、周视图与议程，以及先预览再选择导入的 ICS 日历文件。

[![npm](https://img.shields.io/npm/v/dsh-calendar)](https://www.npmjs.com/package/dsh-calendar) [![downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-downloads.svg)](https://www.npmjs.com/package/dsh-calendar)

欢迎使用，遇到问题或有改进建议，请提交 [issues](https://github.com/STARDUSTLC666/dsh-calendar/issues) 和 [PR](https://github.com/STARDUSTLC666/dsh-calendar/pulls)。

从 DSH 原生侧栏打开工作台；配置与操作边界见[工作台说明](docs/WORKBENCH.md)。

## 功能

- 月、周与议程视图，支持拖拽和键盘改期。
- 创建、搜索、更新、删除日程，并展开重复事件。
- 导入 ICS 文件或粘贴内容，核对时区、重复项和重叠提示后分批确认。
- 连接 Google、iCloud、Nextcloud 或自建 CalDAV。

## 安装

桌面版可在「插件」面板按包名 `dsh-calendar` 安装。已配置 dsh 命令时也可使用：

```bash
dsh plugin --profile desktop add dsh-calendar
```

网页版把命令中的 `desktop` 改为 `web`。安装后重启 DSH。

## 开始使用

打开「设置 → 日历」，选择服务商，填写连接信息后测试并保存。随后可说：“查看我这周的日程，找一个一小时的空档。”

迁移日程时，点击「导入 ICS」。预览不会修改日历；勾选后确认导入，已有日程自动跳过，失败项可以单独重试。

## 依赖与配置

需要日历服务的登录信息；Google 使用 OAuth2，其他服务可使用应用专用密码。代理按实际网络需要配置。

详细配置、工具参数与排错见[使用说明](docs/USAGE.md)。从源码独立开发时，Node 要求以 [package.json](package.json) 为准。

## 文档

- [使用与排错](docs/USAGE.md)
- [更新记录](CHANGELOG.md)
- [验证范围与历史记录](docs/VALIDATION.md)
- [问题反馈与功能建议](https://github.com/STARDUSTLC666/dsh-calendar/issues)

## 插件更新

需要 DSH 0.2.1-rc.3 或更新版本。更新控件直接位于原有工作台内容末尾；没有工作台的插件，位于原生插件详情页底部。检查、更新记录和偏好在原地展开，不增加独立更新页面或设置菜单。自动检查默认开启；**自动安装默认关闭**，明确授权后才会在空闲且没有未保存修改时安装兼容的稳定补丁。开关按插件独立保存，可关闭、推迟或忽略提醒；不会强制重启 DSH、升级 DSH 本体或替换本地源码安装。Suite 组件在当前页面底部明确说明并操作 Suite 整包更新。

旧版用户先在官方插件管理中手动更新一次，之后才会获得此入口。发布到 npm 不会直接替换用户已经安装的版本。

## License

[MIT](LICENSE)
