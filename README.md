**简体中文** · [English](README.en.md)

# Calendar

**看清日程，找到当前日历里合适的空闲时间。**

[![npm](https://img.shields.io/npm/v/dsh-calendar)](https://www.npmjs.com/package/dsh-calendar) [![downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-downloads.svg)](https://www.npmjs.com/package/dsh-calendar) [![total downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-total-downloads.svg)](https://www.npmjs.com/package/dsh-calendar)

**[安装使用](#安装) · [使用流程](#开始使用) · [完整说明](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/REFERENCE.zh.md)**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 640px)" srcset="https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/workflow-zh-mobile-dark.svg">
  <source media="(max-width: 640px)" srcset="https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/workflow-zh-mobile-light.svg">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/workflow-zh-dark.svg">
  <img src="https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/workflow-zh-light.svg" alt="看清日程，找到当前日历里合适的空闲时间。 · 流程示意" width="100%">
</picture>

## 功能

- 用月、周或议程视图安排日程。
- 按时长、工作日与缓冲查找空闲候选。
- 先核对新建草稿或 ICS 导入预览，再确认写入。

<details>
<summary>查看实际示例</summary>

![workbench example](https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/screen-zh.webp)

图片来自验证环境的真实界面或示例 PPTX 渲染，使用示例数据。

</details>

## 安装

在 DSH 桌面版「插件」面板安装 `dsh-calendar`。已配置命令行时也可使用：

```bash
dsh plugin --profile desktop add dsh-calendar
```

网页版把 `desktop` 改为 `web`；安装后重启对应的 DSH。宿主要求以包声明 `>=0.2.1-rc.3` 为准。

## 开始使用

1. 打开左侧栏“日历”，在连接设置中选择服务商并填写自己的账号与授权信息。
2. 测试连接并选择目标日历，核对时区后读取月、周或议程视图。
3. 新建或调整日程时，先核对日期、时间和目标日历，再确认保存。
4. 导入 ICS 时先预览并选择条目，再确认导入；检查跳过项和失败项后按需重试。

可以这样说：

> 读取当前日历本周的日程，先整理需要我确认的时间冲突。

## 开始前要知道

需要自己的 CalDAV 账号。空闲查询只覆盖当前连接的日历。

配置、完整工具与排错见[详细使用说明](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/REFERENCE.zh.md)。

## 插件更新

在工作台或原生插件详情页底部检查更新。默认自动检查，**默认不自动安装**；是否安装、何时重启由你决定。Suite 管理的组件随整包更新。[查看更新规则](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/REFERENCE.zh.md)。

## 文档

- [详细使用、配置与边界](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/REFERENCE.zh.md)
- [更新记录](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/CHANGELOG.md)
- [验证范围与历史](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/VALIDATION.md)

## 反馈与贡献

如果插件帮到了你，欢迎 Star，让更多人发现它。问题和建议请提交 [Issues](https://github.com/STARDUSTLC666/dsh-calendar/issues)，也欢迎代码与文档 [PR](https://github.com/STARDUSTLC666/dsh-calendar/pulls)。反馈时附上版本与复现步骤，并移除凭据。

## License

[MIT](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/LICENSE)

<a id="依赖与配置"></a>
