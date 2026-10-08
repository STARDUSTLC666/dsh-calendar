# dsh-calendar

[English](README.en.md)

![dsh-calendar 鲸鱼娘插件封面](https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/assets/cover-whale-girl.png)

连接 CalDAV 日历，在 DSH 中查看、创建和调整日程。

[![npm](https://img.shields.io/npm/v/dsh-calendar)](https://www.npmjs.com/package/dsh-calendar) [![downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-downloads.svg)](https://www.npmjs.com/package/dsh-calendar)

欢迎使用，遇到问题或有改进建议，请提交 [issues](https://github.com/STARDUSTLC666/dsh-calendar/issues) 和 [PR](https://github.com/STARDUSTLC666/dsh-calendar/pulls)。

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

## License

[MIT](LICENSE)
