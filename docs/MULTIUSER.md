# 身份隔离、反代、多日历与只读连接

这部分对应 issue #8；默认仍是原有单连接行为。`tools` 注册开关见 [配置说明](REFERENCE.zh.md#只使用面板或限制模型工具)。

## 认证与反向代理

面板设置、智能草稿和 ICS 导入使用宿主 `connection.fetch` 的认证管线：

- `/api/dsh-calendar/settings`
- `/api/dsh-calendar/draft`
- `/api/dsh-calendar/import`

无需把代理服务器地址伪装成本机 loopback。允许的主机、Origin 和浏览器/API 凭据由 DSH 本身验证；应用必须先在 DSH 层配置好公开域名和认证，插件不会通过 `X-Forwarded-For`、用户 ID 请求头或请求体自行授信。写操作继续要求 JSON，并拒绝跨站、跨源与 `Origin: null`。浏览器请求相对 DSH 文档 base URI 构造，保留反代子路径。

`perUser: true` 时不挂载旧的 `/_dsh/dsh-calendar/*` 共享路由；未启用时保留其原有 loopback 限制用于兼容，新面板默认使用认证管线。

## 按人连接

```yaml
- id: calendar
  config:
    perUser: true
    connectionsDir: /srv/dsh/calendar-people
```

此配置需要重载插件。目录未填写时使用插件数据目录中的 `people` 子目录。每位人员第一次连接得到空配置，在面板填写并保存自己的凭据，生成独立的服务器端文件；不会继承 owner 的连接、OAuth 凭据或环境变量。

身份仅来自可信宿主服务：

1. 如果安装的认证扩展提供 `requestIdentity.current(): {id: string} | null`，使用其**已验证** ID。服务存在但当前身份缺失/无效时直接拒绝，不回退到共享连接。
2. 否则，从 DSH 已认证请求的 `PeerScope.principal` 解析身份：具有稳定 `kind` 和 `id` 的非 owner principal 使用独立文件；无法识别的主体拒绝。`perUser: true` 时，共享 `owner` 也默认拒绝，以免身份扩展卸载后意外暴露 owner 连接。确实需要 owner 兼容入口的部署可明确设置 `allowOwnerFallback: true`；未开启 perUser 的原有单连接模式完全不受影响。

当前官方 DSH 0.2.2-rc.5 的内置 principal 只有共享 `owner`。单独打开此开关不会凭空产生多用户身份；部署方仍需一个真实的身份提供方。插件已对上述扩展合同和可信 principal 做隔离测试，但本轮没有真实 dsh-oidc 账号/服务器，不能据此声称已验证任何特定 OIDC 部署。

模型工具调用在 `perUser` 模式下同样需要其执行链上能取得有效的 `requestIdentity`。没有可靠的工具调用者身份时会明确拒绝，绝不把共享 owner 凭据当成替代；仅面板场景可配 `tools: false`。

文件名是命名空间和精确 ID 的 SHA-256，不直接使用姓名、邮箱或可操纵路径。不同大小写、Unicode 代码点和身份来源不会合并。文件格式为：

```json
{"schemaVersion":1,"revision":1,"value":{"provider":"custom","username":"person","password":"...","caldavUrl":"https://dav.example/calendars/person/"}}
```

文件只保留在服务器端，浏览器只得到“凭据是否存在”，不回传密码或 token。写入有版本比较、进程内同路径串行、临时文件与原子 rename；不要让多个 DSH 进程同时写同一人员目录。Unix 下目录/文件限制为 0700/0600，Windows 部署使用受限的数据目录 ACL。

## 多个日历集合

一个连接的多个集合共享该连接的认证凭据。可在 owner 配置或管理员管理的人员文件 `value` 中设置：

```yaml
provider: custom
username: example
password: <服务器上的凭据>
calendars:
  - id: personal
    name: 个人日历
    url: https://dav.example/calendars/example/personal/
  - id: team
    name: 团队日历
    url: https://dav.example/calendars/example/team/
    readOnly: true
writeCalendar: personal
```

最多 20 个集合，ID 与规范化 URL 不能重复。列表、搜索合并读取，并携带 `calendarId` / `calendarName`。更新、删除、读取事件按返回的完整 CalDAV href 归属到其集合，不能通过事件 UID 指向其他连接/主机。

新建与 ICS 导入只写 `writeCalendar`，多个集合时必须明确指定，不能默默写第一个。未设置 `calendars` 则保留原有 `caldavUrl` 单集合行为。

空闲查询读取并完整展开全部配置集合，再合并繁忙事件计算候选；任一集合失败时整次查询失败，不能用剩余日历给出虚假的空闲。

目前多集合与策略是服务器配置，不是新增的浏览器连接管理界面；现有连接表单只编辑凭据等原有字段，不允许请求体改写管理员设置的集合与策略。

## 只读策略

连接级 `readOnly: true` 阻止该连接的所有事件写操作；单集合 `readOnly: true` 仅阻止该集合写入。策略在服务器端同时覆盖模型工具、面板新建/修改/删除、ICS 导入。连接表单保存保留管理员策略，不能通过提交 `readOnly: false` 绕过。

这是实际写入限制，与仅隐藏模型工具的 `tools` 开关不同。只读日历仍能读取和查询空闲。修改/保存自己的连接凭据不等同于事件写入。

## 本轮验证

- 两个人的连接配置与凭据相互隔离；新人员不继承 owner 环境凭据。
- 身份服务空值、非法 principal、伪造请求体身份、未认证及跨源请求被拒绝。
- 多集合读取与事件归属、明确写入目标、连接/集合只读均有回归。
- 只读策略在 ICS 预览后启用也会阻止提交；其他人员的后端无法提交别人的预览 ID。
- 没有使用真实 CalDAV 或 OIDC 账号完成线上收发验收；这些是合同、协议 fixture 与自动回归结果。
