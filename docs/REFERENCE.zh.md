> 完整使用说明。首页已按用途、安装和操作流程重新整理；这里保留详细参数、限制、更新规则与历史验证链接。

# dsh-calendar

[English](./REFERENCE.en.md)

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

## 开始使用：三步用起来

1. **连接日历**：打开左侧栏「日历」，在连接设置中选择服务商并填写账号与授权信息，先测试连接再保存启用。
2. **查空档发邀约**：在「找空闲时段」按时长、工作时间与缓冲查出候选，点击「复制空闲时段文案」可直接发到微信、钉钉、Slack 或邮件，或点击「用此时段新建」填写草稿确认保存。
3. **让助手巡检日程**：在对话中让助手汇总今日议程、排查重叠冲突，或预览导入 ICS 日程。

## 依赖与配置

需要日历服务的登录信息；Google 使用 OAuth2，其他服务可使用应用专用密码。代理按实际网络需要配置。

详细配置、工具参数与排错见[使用说明](USAGE.md)。从源码独立开发时，Node 要求以 [package.json](../package.json) 为准。

多用户身份隔离、认证反代、多日历集合与只读写入策略见[部署说明](MULTIUSER.md)。

### 只使用面板或限制模型工具

在 profile 的 `cordis.patch.yml` 中覆盖 `calendar` 条目的 `config.tools`，重载插件或重启 DSH 后生效。默认不填或 `true` 注册全部 7 个工具；`false` 不注册任何日历模型工具，面板、ICS 导入与智能草稿入口仍可用：

```yaml
- id: calendar
  config:
    tools: false
```

也可逐工具关闭，未列出的工具保持启用。例如只保留只读模型工具：

```yaml
- id: calendar
  config:
    tools:
      calendar_create: false
      calendar_update: false
      calendar_delete: false
```

工具名包括 `calendar_list`、`calendar_search`、`calendar_health`、`calendar_find_time`、`calendar_create`、`calendar_update`、`calendar_delete`。这只控制模型工具注册，**不是日历账号或面板的只读权限设置**；面板依然可以写入日历。

## 文档

- [使用与排错](USAGE.md)
- [更新记录](../CHANGELOG.md)
- [验证范围与历史记录](VALIDATION.md)
- [问题反馈与功能建议](https://github.com/STARDUSTLC666/dsh-calendar/issues)

## 插件更新

需要 DSH `>=0.2.2-rc.3`。日历工作台的更新控件位于日程侧栏底部，原生插件详情页也提供同一组控件。检查、更新记录和偏好在原地展开，不增加独立更新页面或设置菜单。自动检查默认开启；**自动安装默认关闭**，明确授权后才会在空闲且没有未保存修改时安装兼容的稳定更新（默认允许兼容的次版本与补丁，也可限定为仅补丁）。开关按插件独立保存，可关闭、推迟或忽略提醒；不会强制重启 DSH、升级 DSH 本体或替换本地源码安装。Suite 组件在当前页面底部明确说明并操作 Suite 整包更新。

旧版用户先在官方插件管理中手动更新一次，之后才会获得此入口。发布到 npm 不会直接替换用户已经安装的版本。

## License

[MIT](../LICENSE)
