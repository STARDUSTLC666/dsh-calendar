$p = 'E:\deepseek\dsh-calendar\README.md'
$c = Get-Content $p -Raw -Encoding UTF8

$anchor = '### Google example'
$section = @'
## 中国用户：特殊代理配置（Google / iCloud）

Google 与 iCloud 的 CalDAV 端点在中国大陆**不可直连**，需要配合你常用的梯子/特殊代理使用。插件内置 `proxyUrl` 配置：把 CalDAV 请求路由到**你本机代理客户端的端口**，不影响其他插件，也无需改任何系统设置。

```yaml
- id: calendar
  config:
    provider: google
    username: you@gmail.com
    calendarId: you@gmail.com
    password: 你的应用专用密码
    proxyUrl: http://127.0.0.1:7890   # 改成你代理客户端的本地端口
```

### 常见代理客户端本地端口

| 客户端 | 本地端口 |
|---|---|
| Clash / Clash Verge（HTTP） | 7890 / 7897 |
| v2rayN（HTTP / SOCKS） | 10808 / 10809 |
| Shadowsocks | 1080 |

在客户端界面确认你的实际端口，填进 `proxyUrl` 即可。国内可直连的 CalDAV 服务（如自建 Nextcloud）则无需填写。

### Google example
'@
if (-not $c.Contains($anchor)) { Write-Output 'R1 MISS' } else { $c = $c.Replace($anchor, $section); Write-Output '代理专节已加' }

$old = '| `password` | 必填* | 密码；支持环境变量 `DSH_CALENDAR_PASSWORD`。Google / iCloud 请用应用专用密码。 |'
if ($c.Contains($old)) {
  $c = $c.Replace($old, $old + [Environment]::NewLine + '| `proxyUrl` | 无 | 本机代理地址（如 http://127.0.0.1:7890）；中国大陆访问 Google/iCloud 必填，见上文专节 |')
  Write-Output '配置表行已加'
} else { Write-Output 'R2 MISS' }

Set-Content -Path $p -Value $c -Encoding UTF8 -NoNewline

$j = Get-Content 'package.json' -Raw | ConvertFrom-Json
$j.version = '0.3.0'
$j | ConvertTo-Json -Depth 10 | Set-Content 'package.json' -Encoding UTF8
node -e "const p=require('./package.json'); console.log('version:', p.version); if(!p.dsh||!p.dsh.bundle) throw new Error('dsh lost')"
git add -A
git commit -m 'feat: proxyUrl config for mainland users (per-plugin HTTP proxy)' 2>&1 | Select-Object -Last 1
git push 2>&1 | Select-Object -Last 1
