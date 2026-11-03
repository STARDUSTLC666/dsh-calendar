> 完整使用说明。首页已按用途、安装和操作流程重新整理；这里保留详细参数、限制、更新规则与历史验证链接。

# dsh-calendar

[English](../README.en.md)

![dsh-calendar 鲸鱼娘插件封面](https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/assets/cover-whale-girl.png)

在 DSH 日历工作台连接 CalDAV，查看、创建和调整日程。支持月历、周视图与议程，以及先预览再选择导入的 ICS 日历文件。

[![npm](https://img.shields.io/npm/v/dsh-calendar)](https://www.npmjs.com/package/dsh-calendar) [![downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-downloads.svg)](https://www.npmjs.com/package/dsh-calendar) [![total downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-total-downloads.svg)](https://www.npmjs.com/package/dsh-calendar)

[下载统计说明](https://github.com/STARDUSTLC666/dsh-suite/blob/npm-downloads/README.md)

欢迎使用，遇到问题或有改进建议，请提交 [issues](https://github.com/STARDUSTLC666/dsh-calendar/issues) 和 [PR](https://github.com/STARDUSTLC666/dsh-calendar/pulls)。

从 DSH 原生侧栏打开工作台；配置与操作边界见[工作台说明](WORKBENCH.md)。

## 功能

- 查找当前日历的空闲时段，选择后进入新建草稿再确认保存；可设时长、工作时间 / 工作日与缓冲，见[使用说明](AVAILABILITY.md)。


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

1. 打开左侧栏“日历”，在连接设置中选择服务商并填写自己的账号与授权信息。
2. 测试连接并选择目标日历，核对时区后读取月、周或议程视图。
3. 新建或调整日程时，先核对日期、时间和目标日历，再确认保存。
4. 导入 ICS 时先预览并选择条目，再确认导入；检查跳过项和失败项后按需重试。

## 依赖与配置

需要日历服务的登录信息；Google 使用 OAuth2，其他服务可使用应用专用密码。代理按实际网络需要配置。

详细配置、工具参数与排错见[使用说明](USAGE.md)。从源码独立开发时，Node 要求以 [package.json](../package.json) 为准。

## 文档

- [使用与排错](USAGE.md)
- [更新记录](../CHANGELOG.md)
- [验证范围与历史记录](VALIDATION.md)
- [问题反馈与功能建议](https://github.com/STARDUSTLC666/dsh-calendar/issues)

## 插件更新

需要 DSH 0.2.1-rc.3 或更新版本。更新控件直接位于原有工作台内容末尾；没有工作台的插件，位于原生插件详情页底部。检查、更新记录和偏好在原地展开，不增加独立更新页面或设置菜单。自动检查默认开启；**自动安装默认关闭**，明确授权后才会在空闲且没有未保存修改时安装兼容的稳定补丁。开关按插件独立保存，可关闭、推迟或忽略提醒；不会强制重启 DSH、升级 DSH 本体或替换本地源码安装。Suite 组件在当前页面底部明确说明并操作 Suite 整包更新。

旧版用户先在官方插件管理中手动更新一次，之后才会获得此入口。发布到 npm 不会直接替换用户已经安装的版本。

## License

[MIT](../LICENSE)
