// NOTE（维护者请看这里）：这个文件就是插件网页端的**源码**，不经过 tsc —— 仓库里没有
// src/client.ts，pnpm run build 也不会重写它。改设置面板请直接改这里，改完用
// node --check lib/client.js 自检（CI 里也会跑这一步）。
//
// 面板只做三件事：把 CalDAV 上的日程画成月/周/议程三种视图、把日程详情讲清楚、
// 把增删改发回插件自己的 /_dsh/dsh-calendar/settings 路由。它不缓存业务数据——
// CalDAV 服务器才是唯一真相，服务器变了刷新即见。
window.__ModuleLoader__.load({ id: "dsh-calendar", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
"use strict";

const React = require("react");
const { useState, useEffect, useMemo, useRef, useCallback } = React;
const h = React.createElement;

const ROUTE = "/_dsh/dsh-calendar/settings";

/** 三视图；order 决定 tab 顺序。 */
const VIEWS = ["month", "week", "agenda"];

const WEEKDAYS_ZH = ["一", "二", "三", "四", "五", "六", "日"];

/* @ui-css-start */
const CSS = [
  ".dshc-root{color:var(--dsw-alias-label-primary,#111);font-size:13px;line-height:1.5}",
  ".dshc-shell{background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:14px;padding:14px 16px 16px}",
  ".dshc-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px}",
  ".dshc-title{font-size:15px;font-weight:600;margin:0}",
  ".dshc-sub{color:var(--dsw-alias-label-tertiary,#6b7280);font-size:12px}",
  ".dshc-spacer{flex:1}",
  ".dshc-btn{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#111);border-radius:9px;padding:5px 11px;font-size:12px;cursor:pointer;transition:background .12s,border-color .12s}",
  ".dshc-btn:hover:not(:disabled){background:var(--dsw-alias-bg-mask-3,rgba(0,0,0,.05))}",
  ".dshc-btn:disabled{opacity:.5;cursor:not-allowed}",
  ".dshc-btn.primary{background:var(--dsw-alias-button-primary-fill,#2563eb);border-color:transparent;color:var(--dsw-alias-label-primary-foreground,#fff)}",
  ".dshc-btn.primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover,#1d4ed8)}",
  ".dshc-btn.danger{color:var(--dsw-alias-state-error-primary,#dc2626);border-color:var(--dsw-alias-state-error-primary,#dc2626)}",
  ".dshc-btn.ghost{border-color:transparent;background:transparent}",
  ".dshc-tabs{display:inline-flex;background:var(--dsw-alias-bg-layer-2,rgba(0,0,0,.05));border-radius:10px;padding:2px;gap:2px}",
  ".dshc-tab{border:0;background:transparent;border-radius:8px;padding:4px 10px;font-size:12px;cursor:pointer;color:var(--dsw-alias-label-tertiary,#6b7280)}",
  ".dshc-tab.on{background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#111);box-shadow:var(--dsw-elevation-prominent,0 1px 2px rgba(0,0,0,.12))}",
  ".dshc-monthhead{text-align:center;font-size:13px;font-weight:600;min-width:104px}",
  ".dshc-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}",
  ".dshc-dow{text-align:center;font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);padding:2px 0 4px}",
  ".dshc-cell{display:block;width:100%;min-height:88px;box-sizing:border-box;border-radius:10px;padding:5px 5px 6px;background:var(--dsw-alias-bg-layer-2,rgba(0,0,0,.03));border:1px solid transparent;cursor:pointer;text-align:left;font:inherit;color:inherit;transition:background .12s,border-color .12s;overflow:hidden}",
  ".dshc-cell:hover{background:var(--dsw-alias-bg-mask-3,rgba(0,0,0,.07))}",
  ".dshc-cell.out{opacity:.45}",
  ".dshc-cell.today{border-color:var(--dsw-alias-state-business-primary,#2563eb)}",
  ".dshc-daynum{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);margin:0 0 3px;display:flex;justify-content:space-between}",
  ".dshc-cell.today .dshc-daynum b{background:var(--dsw-alias-state-business-primary,#2563eb);color:var(--dsw-alias-label-primary-foreground,#fff);border-radius:999px;padding:0 6px}",
  ".dshc-cell.today .dshc-daynum b{font-weight:600}",
  ".dshc-chip{display:block;width:100%;text-align:left;border:0;border-left:3px solid var(--dsw-alias-state-business-primary,#2563eb);background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#111);border-radius:7px;padding:3px 6px;margin-bottom:3px;font-size:12px;line-height:1.35;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
  ".dshc-chip:hover{background:var(--dsw-alias-button-elevated-fill,rgba(0,0,0,.06))}",
  ".dshc-chip.allday{border-left-color:var(--dsw-alias-state-success-primary,#16a34a)}",
  ".dshc-chip.recurring{border-left-color:var(--dsw-alias-state-warn-primary,#f59e0b)}",
  ".dshc-chip .t{color:var(--dsw-alias-label-tertiary,#9ca3af);margin-right:4px}",
  ".dshc-more{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);padding-left:3px}",
  ".dshc-week{display:grid;grid-template-columns:56px repeat(7,minmax(0,1fr));gap:4px;max-height:520px;overflow:auto}",
  ".dshc-hour{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);text-align:right;padding-right:4px;height:44px}",
  ".dshc-daycol{position:relative;border-left:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.07));min-height:44px}",
  ".dshc-daycol.today{background:var(--dsw-alias-bg-mask-3,rgba(37,99,235,.06))}",
  ".dshc-dayhead{position:sticky;top:0;background:var(--dsw-alias-bg-layer-1,#fff);z-index:2;text-align:center;font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);padding-bottom:4px}",
  ".dshc-dayhead b{color:var(--dsw-alias-label-primary,#111);font-weight:600;font-size:13px}",
  ".dshc-slot{position:absolute;left:2px;right:2px;border-radius:7px;padding:3px 5px;font-size:11px;line-height:1.3;overflow:hidden;cursor:pointer;background:var(--dsw-alias-state-business-primary,#2563eb);color:var(--dsw-alias-label-primary-foreground,#fff);border:0;text-align:left}",
  ".dshc-slot.allday{background:var(--dsw-alias-state-success-primary,#16a34a)}",
  ".dshc-slot.recurring{background:var(--dsw-alias-state-warn-primary,#f59e0b);color:#1f2937}",
  ".dshc-agenda{display:flex;flex-direction:column;gap:14px;max-height:560px;overflow:auto;padding-right:4px}",
  ".dshc-daygroup{display:flex;flex-direction:column;gap:6px}",
  ".dshc-daylabel{display:flex;align-items:baseline;gap:8px;position:sticky;top:0;background:var(--dsw-alias-bg-layer-1,#fff);padding:2px 0}",
  ".dshc-daylabel b{font-size:13px}",
  ".dshc-row{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-radius:10px;background:var(--dsw-alias-bg-layer-2,rgba(0,0,0,.03));cursor:pointer;border-left:3px solid var(--dsw-alias-state-business-primary,#2563eb)}",
  ".dshc-row:hover{background:var(--dsw-alias-bg-mask-3,rgba(0,0,0,.07))}",
  ".dshc-row.allday{border-left-color:var(--dsw-alias-state-success-primary,#16a34a)}",
  ".dshc-row.recurring{border-left-color:var(--dsw-alias-state-warn-primary,#f59e0b)}",
  ".dshc-time{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-tertiary,#6b7280);min-width:96px;font-size:12px;padding-top:1px}",
  ".dshc-main{flex:1;min-width:0}",
  ".dshc-name{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
  ".dshc-meta{color:var(--dsw-alias-label-tertiary,#6b7280);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
  ".dshc-tag{display:inline-block;font-size:11px;padding:1px 6px;border-radius:999px;background:var(--dsw-alias-bg-mask-3,rgba(0,0,0,.07));color:var(--dsw-alias-label-tertiary,#6b7280);margin-left:6px}",
  ".dshc-empty{padding:26px 18px;text-align:center;color:var(--dsw-alias-label-tertiary,#6b7280)}",
  ".dshc-empty h3{color:var(--dsw-alias-label-primary,#111);margin:0 0 6px;font-size:14px}",
  ".dshc-empty code{background:var(--dsw-alias-bg-layer-2,rgba(0,0,0,.05));padding:1px 5px;border-radius:5px;font-size:12px}",
  ".dshc-alert{display:flex;gap:8px;align-items:flex-start;border-radius:10px;padding:8px 10px;font-size:12px;margin-bottom:10px;background:var(--dsw-alias-bg-mask-3,rgba(0,0,0,.05))}",
  ".dshc-alert.error{background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#dc2626) 12%,transparent);color:var(--dsw-alias-state-error-primary,#dc2626)}",
  ".dshc-alert.warn{background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#f59e0b) 16%,transparent)}",
  ".dshc-alert.demo{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#2563eb) 12%,transparent)}",
  ".dshc-skel{height:88px;border-radius:10px;background:linear-gradient(90deg,var(--dsw-alias-bg-layer-2,rgba(0,0,0,.04)) 25%,var(--dsw-alias-bg-mask-3,rgba(0,0,0,.08)) 37%,var(--dsw-alias-bg-layer-2,rgba(0,0,0,.04)) 63%);background-size:400% 100%;animation:dshc-shimmer 1.4s ease infinite}",
  "@keyframes dshc-shimmer{0%{background-position:100% 0}100%{background-position:0 0}}",
  ".dshc-overlay{position:fixed;inset:0;background:var(--dsw-alias-bg-mask-3,rgba(15,23,42,.42));display:flex;justify-content:flex-end;z-index:60}",
  ".dshc-drawer{width:min(420px,92vw);height:100%;background:var(--dsw-alias-bg-layer-1,#fff);border-left:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));padding:18px;overflow:auto;box-shadow:var(--dsw-elevation-prominent,0 10px 30px rgba(0,0,0,.2))}",
  ".dshc-modalwrap{position:fixed;inset:0;background:var(--dsw-alias-bg-mask-3,rgba(15,23,42,.42));display:flex;align-items:center;justify-content:center;z-index:70;padding:20px}",
  ".dshc-modal{width:min(460px,94vw);max-height:88vh;overflow:auto;background:var(--dsw-alias-bg-layer-1,#fff);border-radius:14px;padding:18px;box-shadow:var(--dsw-elevation-prominent,0 10px 30px rgba(0,0,0,.25))}",
  ".dshc-field{margin-bottom:10px}",
  ".dshc-field label{display:block;font-size:12px;color:var(--dsw-alias-label-tertiary,#6b7280);margin-bottom:4px}",
  ".dshc-input,select.dshc-input,textarea.dshc-input{width:100%;box-sizing:border-box;background:var(--dsw-specific-input-major,var(--dsw-alias-bg-layer-2,rgba(0,0,0,.03)));border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:9px;padding:7px 9px;font:inherit;color:inherit}",
  "textarea.dshc-input{min-height:72px;resize:vertical}",
  ".dshc-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
  ".dshc-check{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--dsw-alias-label-primary,#111)}",
  ".dshc-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}",
  ".dshc-kv{display:grid;grid-template-columns:72px 1fr;gap:6px 10px;font-size:12px;margin:12px 0 0}",
  ".dshc-kv dt{color:var(--dsw-alias-label-tertiary,#6b7280)}",
  ".dshc-kv dd{margin:0;word-break:break-all}",
  ".dshc-drawertitle{font-size:16px;font-weight:600;margin:0 0 4px}",
  ".dshc-mono{font-family:ui-monospace,Consolas,monospace;font-size:11px;color:var(--dsw-alias-label-tertiary,#6b7280);word-break:break-all}",
  ".dshc-close{position:absolute;top:10px;right:12px}",
  ".dshc-footer{margin-top:12px;display:flex;align-items:center;gap:8px;justify-content:space-between;color:var(--dsw-alias-label-tertiary,#9ca3af);font-size:11px}"
].join("");
/* @ui-css-end */

const UI = {
  zh: {
    "nav.title": "日历",
    "section.title": "日历",
    "section.intro": "在设置页直接查看和编辑 CalDAV 上的日程：月/周/议程三种视图，点一下就能改时间、换标题、加重复规则。",
    "view.month": "月", "view.week": "周", "view.agenda": "议程",
    "action.today": "今天", "action.prev": "上", "action.next": "下", "action.new": "新建日程",
    "action.refresh": "刷新", "action.retry": "重试", "action.edit": "编辑", "action.delete": "删除",
    "action.save": "保存", "action.cancel": "取消", "action.confirmDelete": "确认删除",
    "action.open": "打开", "action.copy": "复制 uid", "action.copied": "已复制",
    "action.demo": "查看示例", "action.exitDemo": "退出示例",
    "state.loading": "正在读取日历…", "state.empty": "这段时间没有日程。",
    "state.notConfigured": "还没配置 CalDAV 账号",
    "state.notConfiguredHint": "在 profile 的 cordis.patch.yml 里给 dsh-calendar 填上 provider / caldavUrl / username / password（或 OAuth 四件套）后重启即可。现在可以先看看示例面板。",
    "state.readonly": "只读",
    "demo.banner": "示例数据（不是你的真实日历）—— 点右上角「退出示例」回到真实数据。",
    "field.summary": "标题", "field.date": "日期", "field.start": "开始", "field.end": "结束",
    "field.allDay": "全天", "field.location": "地点", "field.description": "备注",
    "field.repeat": "重复", "field.uid": "事件 uid", "field.when": "时间", "field.duration": "时长",
    "repeat.none": "不重复", "repeat.daily": "每天", "repeat.weekly": "每周", "repeat.monthly": "每月", "repeat.yearly": "每年", "repeat.custom": "自定义 RRULE",
    "repeat.weeklyEvery": "每周（{n} 次）", "repeat.recurring": "重复", "repeat.occurrence": "系列中的一次",
    "conflict.title": "这个时段已有 {n} 个日程，会重叠：", "conflict.hint": "仍然保存？",
    "error.title": "操作失败", "error.load": "读取日历失败",
    "confirm.delete": "删除「{name}」？这个操作会同步到你的日历服务器。",
    "form.newTitle": "新建日程", "form.editTitle": "编辑日程",
    "form.required": "标题和时间都要填。",
    "day.today": "今天", "day.tomorrow": "明天", "day.yesterday": "昨天",
    "count.events": "{n} 个日程", "count.occurrences": "含 {n} 次重复展开",
    "format.duration.hm": "{h} 小时 {m} 分", "format.duration.h": "{h} 小时", "format.duration.m": "{m} 分钟", "format.duration.zero": "0 分钟",
    "format.allday": "全天",
    "conn.button": "连接设置",
    "conn.title": "CalDAV 连接设置",
    "conn.intro": "填完点「测试连接」，通了才会保存。密码只存在本机（不进日志、不进导出）。",
    "conn.provider": "服务商",
    "conn.caldavUrl": "日历集合 URL",
    "conn.username": "账号",
    "conn.password": "密码 / 应用专用密码",
    "conn.host": "服务器地址",
    "conn.user": "用户名",
    "conn.calendar": "日历名（如 personal）",
    "conn.calendarId": "日历 ID（通常是你的邮箱）",
    "conn.clientId": "clientId",
    "conn.clientSecret": "clientSecret",
    "conn.refreshToken": "refreshToken",
    "conn.tokenUrl": "令牌地址（可留空）",
    "conn.proxyUrl": "代理地址（可留空）",
    "conn.keep": "已保存，留空不改",
    "conn.test": "测试连接",
    "conn.testing": "正在连接…",
    "conn.save": "保存并启用",
    "conn.saving": "保存中…",
    "conn.ok": "连接成功：未来 30 天读到 {n} 个日程",
    "conn.okSample": "（例如：{sample}）",
    "conn.fail": "连接失败",
    "conn.savedToast": "连接已保存，工具下一次调用就用它",
    "conn.noSettings": "当前宿主的 settings 服务不可用，面板不能保存：请在 profile 的 cordis.patch.yml 里配置 dsh-calendar 后重启。",
    "conn.storageFallback": "连接保存在插件自己的文件：~/.dsh/data/dsh-calendar/connection.json（{reason}，功能不受影响）。",
    "conn.needProvider": "先选一个服务商",
    "conn.current": "当前：{summary}",
    "conn.steps": "怎么拿到这些值？（点开看步骤）",
    "link.googleConsole": "打开 Google Cloud 凭据页 ↗",
    "link.googlePlayground": "打开 OAuth Playground ↗",
    "link.appleId": "打开 Apple ID 设置 ↗",
    "hint.calendarId.google": "通常就是你的 Gmail 地址",
    "hint.clientId.google": "OAuth 客户端 ID，类型选「桌面应用」即可",
    "hint.refreshToken.google": "用下面步骤里的 OAuth Playground 换一次，长期有效",
    "hint.tokenUrl": "留空即用 Google 默认地址",
    "hint.caldavUrl.icloud": "形如 https://caldav.icloud.com/<数字ID>/calendars/<日历ID>/ —— 数字 ID 在与日历同级的设置里能看到",
    "hint.username.icloud": "你的 Apple ID 邮箱",
    "hint.password.icloud": "必须用 App 专用密码，不是 Apple ID 登录密码",
    "hint.host.nextcloud": "含 https://，结尾不要带 /",
    "hint.user.nextcloud": "拼 CalDAV 地址用的用户名（通常与登录名相同）",
    "hint.username.nextcloud": "用于认证的账号名；与上一栏不同时才需要分别填",
    "hint.calendar.nextcloud": "日历名，个人日历默认是 personal",
    "hint.caldavUrl.custom": "完整日历集合 URL，结尾的 / 别丢",
    "hint.username.custom": "登录账号 / 邮箱",
    "steps.google": ["在 Google Cloud 控制台新建项目，并启用「Google Calendar API」", "「凭据」→ 创建凭据 → OAuth 客户端 ID，类型选「桌面应用」，拿到 clientId 与 clientSecret", "打开 OAuth Playground（齿轮里勾 Use your own OAuth credentials，填上面的 clientId / clientSecret），授权 scope https://www.googleapis.com/auth/calendar，换取 refreshToken", "日历 ID 一般就是你的 Gmail 地址；四格填完点「测试连接」"],
    "steps.icloud": ["到 appleid.apple.com → 登录与安全 → App 专用密码，生成一个（形如 xxxx-xxxx-xxxx-xxxx）", "iCloud 网页版日历 → 左下角齿轮 → 日历设置，找到你要连的那本日历的 CalDAV 地址", "账号填 Apple ID 邮箱，密码填上一步的 App 专用密码"],
    "steps.nextcloud": ["服务器地址填 https://cloud.example.com（结尾不带 /）", "用户名 = 登录名；日历名在「日历」应用左侧能看到，个人日历默认叫 personal", "密码用 App 密码或登录密码，填完点「测试连接」"],
    "steps.custom": ["在服务商后台找到你日历的集合 URL（以 / 结尾），例如 https://cloud.example.com/remote.php/dav/calendars/用户名/日历名/", "账号填登录名，密码填授权码 / App 密码，填完点「测试连接」"],
    "conn.googleHint": "Google 必须用 OAuth：clientSecret 与 refreshToken 由一次授权换成，README 里有换取步骤；Google 不接受应用专用密码。",
    "conn.icloudHint": "iCloud 用 App 专用密码（appleid.apple.com → 登录与安全）；日历集合 URL 形如 https://caldav.icloud.com/<数字ID>/calendars/<日历ID>/，可在 iCloud 网页版日历设置里找到。",
    "conn.nextcloudHint": "Nextcloud 填服务器地址 + 用户名 + 日历名即可，密码用 App 密码或登录密码。",
    "conn.customHint": "自建 CalDAV 直接给完整日历集合 URL（结尾的 / 别丢），形如 https://cloud.example.com/remote.php/dav/calendars/用户名/日历名/。"
  },
  en: {
    "nav.title": "Calendar",
    "section.title": "Calendar",
    "section.intro": "View and edit your CalDAV calendar right here: month, week and agenda views; click any event to retitle it, move it, or add a recurrence rule.",
    "view.month": "Month", "view.week": "Week", "view.agenda": "Agenda",
    "action.today": "Today", "action.prev": "Prev", "action.next": "Next", "action.new": "New event",
    "action.refresh": "Refresh", "action.retry": "Retry", "action.edit": "Edit", "action.delete": "Delete",
    "action.save": "Save", "action.cancel": "Cancel", "action.confirmDelete": "Delete anyway",
    "action.open": "Open", "action.copy": "Copy uid", "action.copied": "Copied",
    "action.demo": "See a sample", "action.exitDemo": "Exit sample",
    "state.loading": "Loading your calendar…", "state.empty": "Nothing scheduled in this range.",
    "state.notConfigured": "No CalDAV account configured yet",
    "state.notConfiguredHint": "Fill in provider / caldavUrl / username / password (or the four OAuth fields) for dsh-calendar in your profile's cordis.patch.yml and restart. Meanwhile you can look at a sample panel.",
    "state.readonly": "read-only",
    "demo.banner": "Sample data (not your real calendar) — hit「Exit sample」to go back.",
    "field.summary": "Title", "field.date": "Date", "field.start": "Start", "field.end": "End",
    "field.allDay": "All day", "field.location": "Location", "field.description": "Notes",
    "field.repeat": "Repeats", "field.uid": "Event uid", "field.when": "When", "field.duration": "Duration",
    "repeat.none": "Does not repeat", "repeat.daily": "Daily", "repeat.weekly": "Weekly", "repeat.monthly": "Monthly", "repeat.yearly": "Yearly", "repeat.custom": "Custom RRULE",
    "repeat.weeklyEvery": "Weekly ({n} times)", "repeat.recurring": "Recurring", "repeat.occurrence": "One occurrence of a series",
    "conflict.title": "This slot already has {n} event(s); they overlap:", "conflict.hint": "Save anyway?",
    "error.title": "Something failed", "error.load": "Could not load the calendar",
    "confirm.delete": "Delete「{name}」? This is pushed to your calendar server.",
    "form.newTitle": "New event", "form.editTitle": "Edit event",
    "form.required": "A title and a time range are required.",
    "day.today": "Today", "day.tomorrow": "Tomorrow", "day.yesterday": "Yesterday",
    "count.events": "{n} events", "count.occurrences": "{n} expanded occurrences",
    "format.duration.hm": "{h}h {m}m", "format.duration.h": "{h}h", "format.duration.m": "{m}m", "format.duration.zero": "0m",
    "format.allday": "All day",
    "conn.button": "Connection",
    "conn.title": "CalDAV connection",
    "conn.intro": "Fill this in and hit「Test connection」— nothing is saved until it works. The password stays on this machine only (no logs, no exports).",
    "conn.provider": "Provider",
    "conn.caldavUrl": "Calendar collection URL",
    "conn.username": "Account",
    "conn.password": "Password / app-specific password",
    "conn.host": "Server",
    "conn.user": "Username",
    "conn.calendar": "Calendar name (e.g. personal)",
    "conn.calendarId": "Calendar ID (usually your email)",
    "conn.clientId": "clientId",
    "conn.clientSecret": "clientSecret",
    "conn.refreshToken": "refreshToken",
    "conn.tokenUrl": "Token URL (optional)",
    "conn.proxyUrl": "Proxy URL (optional)",
    "conn.keep": "saved — leave blank to keep",
    "conn.test": "Test connection",
    "conn.testing": "Connecting…",
    "conn.save": "Save and enable",
    "conn.saving": "Saving…",
    "conn.ok": "Connected: {n} events in the next 30 days",
    "conn.okSample": " (e.g. {sample})",
    "conn.fail": "Connection failed",
    "conn.savedToast": "Saved — the tools pick it up on their next call",
    "conn.noSettings": "This host has no settings service, so the panel cannot save: configure dsh-calendar in the profile's cordis.patch.yml and restart.",
    "conn.storageFallback": "Saved in the plugin's own file: ~/.dsh/data/dsh-calendar/connection.json ({reason}; nothing else changes).",
    "conn.needProvider": "Pick a provider first",
    "conn.current": "Now: {summary}",
    "conn.steps": "Where do these values come from?",
    "link.googleConsole": "Open Google Cloud credentials ↗",
    "link.googlePlayground": "Open OAuth Playground ↗",
    "link.appleId": "Open Apple ID settings ↗",
    "hint.calendarId.google": "usually your Gmail address",
    "hint.clientId.google": "an OAuth client ID; the desktop-app type works",
    "hint.refreshToken.google": "exchange it once in the OAuth Playground step below; it lasts",
    "hint.tokenUrl": "leave empty to use Google's default",
    "hint.caldavUrl.icloud": "looks like https://caldav.icloud.com/<numeric id>/calendars/<calendar id>/",
    "hint.username.icloud": "your Apple ID email",
    "hint.password.icloud": "an app-specific password, not your Apple ID password",
    "hint.host.nextcloud": "include https:// and drop any trailing /",
    "hint.user.nextcloud": "the username used to build the CalDAV URL",
    "hint.username.nextcloud": "the account used to authenticate; fill it separately only when it differs",
    "hint.calendar.nextcloud": "calendar name; the personal one is usually called personal",
    "hint.caldavUrl.custom": "the full collection URL — keep the trailing slash",
    "hint.username.custom": "login account / email",
    "steps.google": ["Create a project in the Google Cloud console and enable the Google Calendar API", "Credentials → Create credentials → OAuth client ID, type Desktop app; copy clientId and clientSecret", "Open the OAuth Playground (gear icon: Use your own OAuth credentials, paste clientId/clientSecret), authorize scope https://www.googleapis.com/auth/calendar and exchange a refreshToken", "The calendar ID is usually your Gmail address; then hit Test connection"],
    "steps.icloud": ["Go to appleid.apple.com → Sign-In and Security → App-Specific Passwords and create one (xxxx-xxxx-xxxx-xxxx)", "In iCloud web Calendar → gear → Calendar settings, find the CalDAV URL of the calendar you want", "Fill your Apple ID email and that app-specific password"],
    "steps.nextcloud": ["Server: https://cloud.example.com (no trailing slash)", "Username = your login; the calendar name is shown in the Calendar app (personal by default)", "Use an app password or your login password, then hit Test connection"],
    "steps.custom": ["Find your calendar collection URL in the provider's settings (it ends with /), e.g. https://cloud.example.com/remote.php/dav/calendars/user/calendar/", "Fill the login account and an app password / token, then Test connection"],
    "conn.googleHint": "Google requires OAuth: exchange clientSecret and refreshToken once (see the README); Google does not accept app passwords.",
    "conn.icloudHint": "iCloud uses an app-specific password (appleid.apple.com → Sign-In and Security); the collection URL looks like https://caldav.icloud.com/<numeric id>/calendars/<calendar id>/.",
    "conn.nextcloudHint": "Nextcloud needs the server URL, username and calendar name; any app password works.",
    "conn.customHint": "For a self-hosted CalDAV give the full collection URL (keep the trailing slash), e.g. https://cloud.example.com/remote.php/dav/calendars/user/calendar/."
  }
};

var UI_LANG = "zh";
var relocalize = null;

/** 宿主 locale 服务：get('locale') 是正规读法，ctx.locale 兜旧宿主，都没有就是没有。 */
function localeServiceOf(ctx) {
  try {
    if (typeof ctx.get === "function") {
      const viaGet = ctx.get("locale");
      if (viaGet !== undefined && viaGet !== null) return viaGet;
    }
  } catch (e) { /* 落到下面那条路 */ }
  const direct = ctx.locale;
  return direct === undefined || direct === null ? null : direct;
}

function localeToLang(active) {
  const text = typeof active === "string" ? active.toLowerCase() : "";
  return text.indexOf("en") === 0 ? "en" : "zh";
}

/** 订阅语言切换；服务缺失或形状不同都只是留在 zh，绝不把面板拖垮。 */
function subscribeLocale(ctx) {
  const service = localeServiceOf(ctx);
  if (service === null) return () => {};
  const apply = () => {
    try {
      if (typeof service.getSnapshot === "function") {
        UI_LANG = localeToLang(service.getSnapshot().active);
      }
    } catch (e) { UI_LANG = "zh"; }
    if (typeof relocalize === "function") {
      try { relocalize(); } catch (e) { /* 重绘失败不该断订阅链 */ }
    }
  };
  apply();
  try {
    if (typeof service.subscribe !== "function") return () => {};
    const off = service.subscribe(apply);
    return typeof off === "function" ? off : () => {};
  } catch (e) { return () => {}; }
}

/** 文案：{name} 形式的占位符按 params 替换，缺参时保留原样（宁可露出花括号也不吞字）。 */
function t(key, params) {
  const dict = UI[UI_LANG] || UI.zh;
  let text = dict[key];
  if (text === undefined) text = (UI.zh[key] !== undefined ? UI.zh[key] : key);
  if (params === undefined) return text;
  return text.replace(/\{(\w+)\}/g, (whole, name) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : whole);
}

/** 调插件自己的路由；错误码原样带出，方便上层区分「没配置」与「服务器拒绝」。 */
async function api(action, payload) {
  const init = { credentials: "same-origin", method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ action }, payload)) };
  const res = await fetch(ROUTE, init);
  let body = null;
  try { body = await res.json(); } catch (e) { body = null; }
  if (!res.ok || !body || body.ok !== true) {
    const message = body && body.error && body.error.message ? body.error.message : ("HTTP " + res.status);
    const error = new Error(message);
    error.status = res.status;
    error.code = body && body.error ? body.error.code : undefined;
    throw error;
  }
  return body.value;
}

// ───────────────────────────── 时间与格式 ─────────────────────────────

/** 事件时间是「全天 = YYYY-MM-DD」或「定时 = UTC ISO」，两种都要能解析。 */
function isDateOnly(value) { return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")); }
function startDate(event) { return isDateOnly(event.start) ? new Date(event.start + "T00:00:00") : new Date(event.start); }
function endDate(event) { return isDateOnly(event.end) ? new Date(event.end + "T00:00:00") : new Date(event.end); }
function dayKey(date) {
  return date.getFullYear() + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
}
function pad2(n) { return n < 10 ? "0" + n : String(n); }
function hhmm(date) { return pad2(date.getHours()) + ":" + pad2(date.getMinutes()); }
function startOfDay(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
function addDays(date, n) { return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n); }
function addMonths(date, n) { return new Date(date.getFullYear(), date.getMonth() + n, 1); }
/** 周一为一周之首：JS 的 getDay() 里周日是 0，先掰成 1..7。 */
function isoWeekday(date) { const d = date.getDay(); return d === 0 ? 7 : d; }
function startOfWeek(date) { return addDays(startOfDay(date), -(isoWeekday(date) - 1)); }
function daysBetween(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }

function formatDay(date, opts) {
  const withYear = opts && opts.withYear;
  return date.getFullYear() + " 年 " + (date.getMonth() + 1) + " 月 " + date.getDate() + " 日" + (withYear ? "" : "");
}
function formatMonthTitle(date) { return date.getFullYear() + " 年 " + (date.getMonth() + 1) + " 月"; }
function formatWeekTitle(date) {
  const from = startOfWeek(date), to = addDays(from, 6);
  return formatMonthTitle(from) + " " + from.getDate() + "–" + (to.getMonth() === from.getMonth() ? "" : (to.getMonth() + 1) + " 月 ") + to.getDate() + " 日";
}
function relativeDay(date) {
  const diff = daysBetween(new Date(), date);
  if (diff === 0) return t("day.today");
  if (diff === 1) return t("day.tomorrow");
  if (diff === -1) return t("day.yesterday");
  return "周" + WEEKDAYS_ZH[isoWeekday(date) - 1];
}
function formatWhen(event) {
  if (event.allDay) return t("format.allday") + " · " + formatDay(startDate(event));
  const s = startDate(event), e = endDate(event);
  const sameDay = dayKey(s) === dayKey(e);
  return formatDay(s) + " " + hhmm(s) + "–" + (sameDay ? "" : formatDay(e) + " ") + hhmm(e);
}
function formatDuration(event) {
  if (event.allDay) {
    const days = Math.max(1, daysBetween(startDate(event), endDate(event)));
    return days === 1 ? t("format.allday") : days + " 天";
  }
  const minutes = Math.max(0, Math.round((endDate(event) - startDate(event)) / 60000));
  const hours = Math.floor(minutes / 60), rest = minutes % 60;
  if (hours > 0 && rest > 0) return t("format.duration.hm", { h: hours, m: rest });
  if (hours > 0) return t("format.duration.h", { h: hours });
  if (rest > 0) return t("format.duration.m", { m: rest });
  return t("format.duration.zero");
}

/** RRULE 说人话：只翻译常见的 FREQ/INTERVAL/COUNT/UNTIL，认不出就原样返回。 */
function humanRepeat(rrule) {
  if (!rrule) return "";
  const parts = {};
  String(rrule).split(";").forEach((piece) => {
    const i = piece.indexOf("=");
    if (i > 0) parts[piece.slice(0, i).toUpperCase()] = piece.slice(i + 1);
  });
  const freq = parts.FREQ;
  const base = freq === "DAILY" ? "每天" : freq === "WEEKLY" ? "每周" : freq === "MONTHLY" ? "每月" : freq === "YEARLY" ? "每年" : "";
  if (base === "") return rrule;
  const interval = Number(parts.INTERVAL || "1");
  const every = interval > 1 ? "每 " + interval + (freq === "DAILY" ? " 天" : freq === "WEEKLY" ? " 周" : freq === "MONTHLY" ? " 个月" : " 年") : base;
  if (parts.COUNT) return every + "（共 " + parts.COUNT + " 次）";
  if (parts.UNTIL) {
    const raw = String(parts.UNTIL);
    const iso = raw.length >= 8 ? raw.slice(0, 4) + "-" + raw.slice(4, 6) + "-" + raw.slice(6, 8) : raw;
    return every + "，到 " + iso + " 为止";
  }
  return every;
}

/** 两个事件是否真的重叠（全天事件按当天整天算）。 */
function overlaps(a, b) {
  const as = startDate(a).getTime(), ae = endDate(a).getTime() || as;
  const bs = startDate(b).getTime(), be = endDate(b).getTime() || bs;
  return as < be && bs < ae;
}

/** 月视图的 6×7 网格起点：所在周的周一，往前补到整周。 */
function monthGridDays(anchor) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const start = startOfWeek(first);
  const days = [];
  for (let i = 0; i < 42; i++) days.push(addDays(start, i));
  return days;
}

/** 一个事件落在哪几天（跨天事件在月视图里逐天显示）。 */
function daysOfEvent(event) {
  const days = [];
  if (event.allDay) {
    const from = startDate(event);
    // 全天事件的 DTEND 是「次日零点」（iCal 语义），显示上要退一天。
    const to = addDays(endDate(event), -1);
    for (let d = startOfDay(from); d <= to; d = addDays(d, 1)) days.push(d);
    return days.length > 0 ? days : [from];
  }
  const from = startOfDay(startDate(event)), to = startOfDay(endDate(event));
  for (let d = from; d <= to; d = addDays(d, 1)) days.push(d);
  return days;
}

/** 事件排序：全天在前，然后按开始时间。 */
function sortForDisplay(events) {
  return events.slice().sort((a, b) => {
    if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
    return startDate(a) - startDate(b);
  });
}

// ───────────────────────────── 宿主 UI 组件（可选） ─────────────────────────────
// 平台的 seed 模块表里有 ui-primitives；老宿主没有时退回同名自绘控件，
// 面板不会因为「组件库不在」整块消失。
var PRIM = null;
try { PRIM = require("@deepseek-ai/dsh-client-ui-primitives"); } catch (e) { PRIM = null; }

/** Button：有官方组件就用官方（variant/tokens 一致），否则退回 .dshc-btn。 */
function Btn(props) {
  const { variant, size, icon, className, children, ...rest } = props || {};
  if (PRIM && typeof PRIM.Button === "function") {
    return h(PRIM.Button, Object.assign({ variant: variant || "ghost", size: size || "sm" }, rest, { className }), children);
  }
  const cls = ["dshc-btn", variant === "primary" ? "primary" : "", variant === "danger" ? "danger" : "", variant === "ghost" ? "ghost" : "", className || ""].join(" ").trim();
  return h("button", Object.assign({ type: "button" }, rest, { className: cls }), children);
}

/** Input：官方版是「带图标的 span 包 input」，属性透传，这里只用其属性面。 */
function Txt(props) {
  const { className, ...rest } = props || {};
  if (PRIM && typeof PRIM.Input === "function") return h(PRIM.Input, Object.assign({}, rest, { className }));
  return h("input", Object.assign({ type: "text" }, rest, { className: ["dshc-input", className || ""].join(" ").trim() }));
}

/** Checkbox：回到原生勾选框 + 文案，语义与官方一致（label 既是可见名也是无障碍名）。 */
function Chk(props) {
  if (PRIM && typeof PRIM.Checkbox === "function") return h(PRIM.Checkbox, props);
  return h("label", { className: "dshc-check" }, [
    h("input", { type: "checkbox", checked: props.checked === true, disabled: props.disabled === true, onChange: (e) => props.onChange(e.target.checked) }),
    h("span", null, props.label)
  ]);
}

/** Modal：官方版是 portal + 遮罩 + Esc 语义；没有它时用同一套 class 自绘。 */
function Dlg(props) {
  if (PRIM && typeof PRIM.Modal === "function") {
    return h(PRIM.Modal, {
      open: props.open,
      onClose: props.onClose,
      title: props.title,
      closeLabel: props.closeLabel || props.title,
      children: props.children,
      footer: props.footer
    });
  }
  if (!props.open) return null;
  return h("div", { className: "dshc-modalwrap", onMouseDown: (e) => { if (e.target === e.currentTarget) props.onClose(); } }, [
    h("div", { className: "dshc-modal" }, [
      h("div", { style: { position: "relative" } }, [
        h("div", { className: "dshc-drawertitle" }, props.title),
        h("button", { type: "button", className: "dshc-btn ghost dshc-close", onClick: props.onClose, "aria-label": props.closeLabel || props.title }, "\u2715")
      ]),
      props.children,
      props.footer
    ])
  ]);
}

/** 复制 uid：优先官方 writeClipboard（它处理了非 https 的降级），否则走 navigator。 */
async function copyText(text) {
  try {
    if (PRIM && typeof PRIM.writeClipboard === "function") { await PRIM.writeClipboard(text); return true; }
  } catch (e) { /* 落到下面 */ }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; }
  } catch (e) { /* 忽略 */ }
  return false;
}

// ───────────────────────────── 小部件 ─────────────────────────────

/** 事件属于哪一类：影响左侧色条（全天绿 / 重复黄 / 普通蓝）。 */
function eventClass(event) {
  return event.allDay ? "allday" : (event.rrule || event.isOccurrence ? "recurring" : "");
}

function Chip(props) {
  const { event, onClick } = props;
  return h("button", {
    type: "button",
    className: "dshc-chip " + eventClass(event),
    title: event.summary,
    onClick: (e) => { e.stopPropagation(); onClick(event); }
  }, [
    event.allDay ? null : h("span", { className: "t" }, hhmm(startDate(event))),
    h("span", null, event.summary)
  ]);
}

/** 议程里的一行：时间列 + 标题/地点 + 重复角标。 */
function Row(props) {
  const { event, onClick } = props;
  const meta = [];
  if (event.location) meta.push(event.location);
  if (event.rrule) meta.push(humanRepeat(event.rrule));
  else if (event.isOccurrence) meta.push(t("repeat.occurrence"));
  return h("div", { className: "dshc-row " + eventClass(event), onClick: () => onClick(event), role: "button", tabIndex: 0,
    onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") onClick(event); } }, [
    h("div", { className: "dshc-time" }, event.allDay ? t("format.allday") : (hhmm(startDate(event)) + "–" + hhmm(endDate(event)))),
    h("div", { className: "dshc-main" }, [
      h("div", { className: "dshc-name" }, event.summary),
      meta.length > 0 ? h("div", { className: "dshc-meta" }, meta.join(" · ")) : null
    ])
  ]);
}

/** 月视图：6×7 网格；每格最多 3 条，多的收成「+N」。 */
function MonthView(props) {
  const { anchor, events, onPick, onCreateAt } = props;
  const days = monthGridDays(anchor);
  const today = dayKey(new Date());
  const byDay = {};
  for (const event of events) {
    for (const day of daysOfEvent(event)) {
      const key = dayKey(day);
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(event);
    }
  }
  const cells = [];
  for (const day of days) {
    const key = dayKey(day);
    const list = sortForDisplay(byDay[key] || []);
    const shown = list.slice(0, 3);
    const rest = list.length - shown.length;
    // 格子必须是 div 而不是 button：里面的日程芯片本身是按钮，而按钮不能嵌套按钮 ——
    // 嵌套时浏览器会把外层按钮提前闭合，芯片就被挤到网格外面去了（真被用户抓到过）。
    cells.push(h("div", {
      key: key,
      role: "button",
      tabIndex: 0,
      className: "dshc-cell" + (day.getMonth() !== anchor.getMonth() ? " out" : "") + (key === today ? " today" : ""),
      onClick: () => onCreateAt(day),
      onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCreateAt(day); } },
      title: t("action.new")
    }, [
      h("div", { className: "dshc-daynum" }, [key === today ? h("b", null, String(day.getDate())) : h("span", null, String(day.getDate()))]),
      shown.map((event) => h(Chip, { key: event.uid + "@" + key, event, onClick: onPick })),
      rest > 0 ? h("div", { className: "dshc-more" }, "+" + rest) : null
    ]));
  }
  return h("div", null, [
    h("div", { className: "dshc-grid", style: { marginBottom: "4px" } }, WEEKDAYS_ZH.map((d) => h("div", { className: "dshc-dow", key: d }, "周" + d))),
    h("div", { className: "dshc-grid" }, cells)
  ]);
}

/** 周视图：7 列 × 24 小时网格，事件按分钟定位；同一时段重叠的事件并排显示。 */
function WeekView(props) {
  const { anchor, events, onPick, onCreateAt } = props;
  const HOUR_PX = 44;
  const start = startOfWeek(anchor);
  const days = [];
  for (let i = 0; i < 7; i++) days.push(addDays(start, i));
  const today = dayKey(new Date());
  const allDay = sortForDisplay(events.filter((e) => e.allDay));
  const timed = events.filter((e) => !e.allDay);

  const hoursColumn = h("div", { key: "__hours" }, [h("div", { className: "dshc-dayhead", key: "h" }, "\u00a0")].concat(
    Array.from({ length: 24 }, (_, hour) => h("div", { className: "dshc-hour", key: "h" + hour }, hour === 0 ? "" : pad2(hour) + ":00"))
  ));

  const dayColumns = days.map((day) => {
    const key = dayKey(day);
    const dayTimed = timed.filter((event) => daysOfEvent(event).some((d) => dayKey(d) === key));
    // 重叠事件分轨：按开始时间排好，逐个找第一条已经结束的轨道；没有就新开一条。
    const laneEnds = [];
    const placed = dayTimed.slice().sort((a, b) => startDate(a) - startDate(b)).map((event) => {
      const from = startDate(event), to = endDate(event);
      let lane = laneEnds.findIndex((endMs) => endMs <= from.getTime());
      if (lane === -1) { lane = laneEnds.length; laneEnds.push(0); }
      laneEnds[lane] = to.getTime();
      return { event, lane };
    });
    const laneCount = Math.max(1, laneEnds.length);
    const blocks = placed.map(({ event, lane }) => {
      const from = startDate(event), to = endDate(event);
      const top = (from.getHours() * 60 + from.getMinutes()) * (HOUR_PX / 60);
      const height = Math.max(18, ((to - from) / 60000) * (HOUR_PX / 60));
      const width = "calc(" + (100 / laneCount) + "% - 4px)";
      const left = "calc(" + (lane * (100 / laneCount)) + "% + 2px)";
      return h("button", {
        key: event.uid,
        type: "button",
        className: "dshc-slot " + eventClass(event),
        style: { top: top + "px", height: height + "px", left, width },
        title: event.summary + " " + hhmm(from) + "\u2013" + hhmm(to),
        onClick: (e) => { e.stopPropagation(); onPick(event); }
      }, [h("div", null, event.summary), h("div", { style: { opacity: .75 } }, hhmm(from) + "\u2013" + hhmm(to))]);
    });
    return h("div", { key, style: { minWidth: 0 } }, [
      h("div", { className: "dshc-dayhead" }, [
        h("b", null, String(day.getDate())),
        " ",
        relativeDay(day)
      ]),
      h("div", {
        className: "dshc-daycol" + (key === today ? " today" : ""),
        style: { height: (24 * HOUR_PX) + "px" },
        onClick: () => onCreateAt(day),
        title: t("action.new")
      }, blocks)
    ]);
  });

  return h("div", null, [
    allDay.length > 0
      ? h("div", { style: { marginBottom: "8px" } }, allDay.map((event) => h(Row, { key: event.uid, event, onClick: onPick })))
      : null,
    h("div", { className: "dshc-week" }, [hoursColumn].concat(dayColumns))
  ]);
}

/** 议程视图：从今天起按天分组，最像「接下来要干什么」。 */
function AgendaView(props) {
  const { events, onPick, onCreateAt } = props;
  const groups = [];
  const index = {};
  for (const event of sortForDisplay(events)) {
    const day = startOfDay(startDate(event));
    const key = dayKey(day);
    if (index[key] === undefined) { index[key] = groups.length; groups.push({ day, key, items: [] }); }
    groups[index[key]].items.push(event);
  }
  if (groups.length === 0) return h("div", { className: "dshc-empty" }, t("state.empty"));
  return h("div", { className: "dshc-agenda" }, groups.map((group) => h("div", { className: "dshc-daygroup", key: group.key }, [
    h("div", { className: "dshc-daylabel" }, [
      h("b", null, formatDay(group.day)),
      h("span", { className: "dshc-sub" }, relativeDay(group.day)),
      h("span", { className: "dshc-spacer" }),
      h("button", { type: "button", className: "dshc-btn ghost", onClick: () => onCreateAt(group.day) }, t("action.new"))
    ]),
    group.items.map((event) => h(Row, { key: event.uid, event, onClick: onPick }))
  ])));
}

// ───────────────────────────── 悬浮面板的样式补充 ─────────────────────────────
const CSS_EXTRA = [
  ".dshc-fab{position:fixed;right:18px;bottom:18px;z-index:55;width:38px;height:38px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#111);box-shadow:var(--dsw-elevation-prominent,0 6px 18px rgba(0,0,0,.18));cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:.62;transition:opacity .15s,transform .15s}",
  ".dshc-fab:hover{opacity:1;transform:translateY(-1px)}",
  ".dshc-fab.on{opacity:1;background:var(--dsw-alias-button-primary-fill,#2563eb);color:var(--dsw-alias-label-primary-foreground,#fff);border-color:transparent}",
  ".dshc-float{position:fixed;right:18px;bottom:66px;z-index:56;width:min(760px,94vw);max-height:min(78vh,720px);overflow:auto;background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:16px;box-shadow:var(--dsw-elevation-prominent,0 18px 48px rgba(0,0,0,.28));padding:14px}",
  ".dshc-float .dshc-shell{border:0;padding:0;background:transparent}",
  ".dshc-steps{margin:2px 0 10px;font-size:12px;color:var(--dsw-alias-label-tertiary,#6b7280)}",
  ".dshc-steps summary{cursor:pointer;color:var(--dsw-alias-state-business-primary,#2563eb)}",
  ".dshc-steps ol{margin:6px 0 0;padding-left:18px;line-height:1.6}",
  ".dshc-link{color:var(--dsw-alias-state-business-primary,#2563eb);text-decoration:none}",
  ".dshc-toast{position:fixed;right:18px;bottom:112px;z-index:57;background:var(--dsw-alias-label-primary,#111);color:var(--dsw-alias-label-primary-foreground,#fff);border-radius:10px;padding:8px 12px;font-size:12px;box-shadow:var(--dsw-elevation-prominent,0 8px 20px rgba(0,0,0,.25))}"
].join("");

// ───────────────────────────── 数据 ─────────────────────────────

/** 去掉毫秒：后端的 assertIsoTime 只认秒级 ISO，浏览器 toISOString 带 .000Z。 */
function isoOf(date) { return date.toISOString().replace(/\.\d{3}Z$/, "Z"); }

function rangeOf(view, anchor) {
  if (view === "week") {
    const from = startOfWeek(anchor);
    return { start: isoOf(from), end: isoOf(addDays(from, 7)) };
  }
  if (view === "agenda") {
    const from = startOfDay(new Date());
    return { start: isoOf(from), end: isoOf(addDays(from, 30)) };
  }
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const from = startOfWeek(first);
  return { start: isoOf(from), end: isoOf(addDays(from, 42)) };
}

/** 示例数据：只在「没配置」或用户主动点「查看示例」时用，不冒充真实日历。 */
function demoEvents() {
  const base = startOfDay(new Date());
  const at = (offset, hour, minute) => { const d = addDays(base, offset); d.setHours(hour, minute || 0, 0, 0); return isoOf(d); };
  const dateOnly = (offset) => { const d = addDays(base, offset); return dayKey(d); };
  return [
    { uid: "demo://allday", summary: "📦 发布日：dsh-email 0.13.1 + dsh-suite 0.1.5", start: dateOnly(0), end: dateOnly(1), allDay: true, description: "两个包都已发布并通过 tarball 内容核对", location: "npm registry", isOccurrence: false },
    { uid: "demo://review", summary: "产品评审会", start: at(0, 10, 0), end: at(0, 11, 0), allDay: false, location: "会议室 A", description: "议程：0.13.1 反馈、下载数据复盘", isOccurrence: false },
    { uid: "demo://one-on-one", summary: "1:1 同步", start: at(0, 15, 0), end: at(0, 15, 30), allDay: false, location: "线上", isOccurrence: false },
    { uid: "demo://standup", summary: "每周站会", start: at(1, 9, 30), end: at(1, 9, 50), allDay: false, rrule: "FREQ=WEEKLY;COUNT=6", location: "线上", isOccurrence: false },
    { uid: "demo://standup@2", summary: "每周站会", start: at(8, 9, 30), end: at(8, 9, 50), allDay: false, location: "线上", isOccurrence: true, seriesStart: at(1, 9, 30) },
    { uid: "demo://gurio", summary: "与 gurio-wine 同步", start: at(2, 16, 0), end: at(2, 16, 30), allDay: false, location: "线上", description: "OAuth2 内置客户端后续", isOccurrence: false }
  ];
}

/** 拉一个时间窗的事件；demo 为真时用示例数据，不打网络。 */
function useCalendarData(range, reloadToken, demo) {
  const [state, setState] = useState({ loading: true, error: null, events: [], configured: true });
  useEffect(() => {
    if (demo === true) {
      setState({ loading: false, error: null, events: demoEvents(), configured: true });
      return () => {};
    }
    let alive = true;
    setState((prev) => ({ loading: true, error: null, events: prev.events, configured: prev.configured }));
    api("list", { start: range.start, end: range.end, expand: true, maxOccurrences: 300 })
      .then((value) => { if (alive) setState({ loading: false, error: null, events: (value && value.events) || [], configured: true }); })
      .catch((error) => { if (alive) setState({ loading: false, error, events: [], configured: error && error.code !== "not-configured" }); });
    return () => { alive = false; };
  }, [range.start, range.end, reloadToken, demo]);
  return state;
}

// ───────────────────────────── 表单 ─────────────────────────────

/** 事件 → 表单草稿（日期与时间都按浏览器本地时区拆开给 datetime-local 用）。 */
function draftOfEvent(event) {
  const allDay = event.allDay === true;
  const s = startDate(event);
  const rawEnd = endDate(event);
  // 全天事件的 DTEND 是「次日零点」：编辑时退一天，否则用户会看到莫名多一天。
  const e = allDay ? addDays(rawEnd, -1) : rawEnd;
  return {
    uid: event.uid,
    summary: event.summary || "",
    date: dayKey(s),
    startTime: pad2(s.getHours()) + ":" + pad2(s.getMinutes()),
    endTime: pad2(e.getHours()) + ":" + pad2(e.getMinutes()),
    allDay,
    location: event.location || "",
    description: event.description || "",
    repeat: repeatKeyOf(event.rrule),
    rrule: event.rrule || ""
  };
}

/** 新建表单：默认落在被点的那一天，上午 10:00–11:00（日历产品的惯例）。 */
function draftAt(date, hour) {
  const d = date || new Date();
  const startHour = typeof hour === "number" ? hour : 10;
  return {
    uid: undefined,
    summary: "",
    date: dayKey(d),
    startTime: pad2(startHour) + ":00",
    endTime: pad2(Math.min(23, startHour + 1)) + ":00",
    allDay: false,
    location: "",
    description: "",
    repeat: "",
    rrule: ""
  };
}

function repeatKeyOf(rrule) {
  if (!rrule) return "";
  const freq = /FREQ=([A-Z]+)/i.exec(rrule);
  if (!freq) return "custom";
  const value = freq[1].toUpperCase();
  const simple = rrule.replace(/FREQ=[A-Z]+;?/i, "").replace(/^;|;$/g, "");
  if (simple !== "") return "custom";
  if (value === "DAILY") return "daily";
  if (value === "WEEKLY") return "weekly";
  if (value === "MONTHLY") return "monthly";
  if (value === "YEARLY") return "yearly";
  return "custom";
}

function rruleForRepeat(repeat) {
  if (repeat === "daily") return "FREQ=DAILY";
  if (repeat === "weekly") return "FREQ=WEEKLY";
  if (repeat === "monthly") return "FREQ=MONTHLY";
  if (repeat === "yearly") return "FREQ=YEARLY";
  return "";
}

/** 草稿 → 后端字段（全天走 DATE，定时走本地时间换算出的 UTC 秒级 ISO）。 */
function fieldsOfDraft(draft) {
  const fields = { summary: draft.summary.trim(), location: draft.location.trim(), description: draft.description.trim() };
  if (draft.allDay === true) {
    fields.start = draft.date;
    fields.end = dayKey(addDays(new Date(draft.date + "T00:00:00"), 1));
    fields.allDay = true;
  } else {
    const start = new Date(draft.date + "T" + (draft.startTime || "00:00") + ":00");
    const end = new Date(draft.date + "T" + (draft.endTime || "00:00") + ":00");
    fields.start = isoOf(start);
    fields.end = isoOf(end);
    fields.allDay = false;
  }
  const rrule = draft.repeat === "custom" ? (draft.rrule || "").trim() : rruleForRepeat(draft.repeat);
  if (rrule !== "") fields.rrule = rrule;
  else if (draft.uid !== undefined) fields.rrule = "";
  return fields;
}

/** 草稿算出来的临时事件，用来做冲突检测（不落盘）。 */
function asPseudoEvent(draft) {
  const fields = fieldsOfDraft(draft);
  return { uid: "__draft", summary: fields.summary || "(未命名)", start: fields.start, end: fields.end, allDay: draft.allDay === true };
}

function EventForm(props) {
  const { draft, events, onCancel, onSubmit, busy, error } = props;
  const [form, setForm] = useState(draft);
  useEffect(() => { setForm(draft); }, [draft.uid, draft.date, draft.startTime, draft.summary]);
  const patch = (fields) => setForm((prev) => Object.assign({}, prev, fields));
  const isEdit = draft.uid !== undefined;
  const pseudo = asPseudoEvent(form);
  const conflicts = form.summary.trim() === "" ? [] : events.filter((event) => overlaps(event, pseudo) && event.uid !== form.uid);
  const canSave = form.summary.trim() !== "" && (form.allDay === true || form.startTime <= form.endTime);

  const body = h("div", null, [
    error ? h("div", { className: "dshc-alert error" }, error) : null,
    h("div", { className: "dshc-field" }, [
      h("label", null, t("field.summary")),
      h(Txt, { value: form.summary, autoFocus: true, onChange: (e) => patch({ summary: e.target.value }), placeholder: t("form.newTitle") })
    ]),
    h("div", { className: "dshc-field" }, [
      h("label", null, t("field.date")),
      h(Txt, { type: "date", value: form.date, onChange: (e) => patch({ date: e.target.value }) })
    ]),
    form.allDay === true ? null : h("div", { className: "dshc-two" }, [
      h("div", { className: "dshc-field" }, [h("label", null, t("field.start")), h(Txt, { type: "time", value: form.startTime, onChange: (e) => patch({ startTime: e.target.value }) })]),
      h("div", { className: "dshc-field" }, [h("label", null, t("field.end")), h(Txt, { type: "time", value: form.endTime, onChange: (e) => patch({ endTime: e.target.value }) })])
    ]),
    h("div", { className: "dshc-field" }, [h(Chk, { checked: form.allDay === true, label: t("field.allDay"), onChange: (next) => patch({ allDay: next }) })]),
    h("div", { className: "dshc-field" }, [
      h("label", null, t("field.repeat")),
      h("select", { className: "dshc-input", value: form.repeat, onChange: (e) => patch({ repeat: e.target.value }) }, [
        h("option", { value: "", key: "none" }, t("repeat.none")),
        h("option", { value: "daily", key: "d" }, t("repeat.daily")),
        h("option", { value: "weekly", key: "w" }, t("repeat.weekly")),
        h("option", { value: "monthly", key: "m" }, t("repeat.monthly")),
        h("option", { value: "yearly", key: "y" }, t("repeat.yearly")),
        h("option", { value: "custom", key: "c" }, t("repeat.custom"))
      ])
    ]),
    form.repeat === "custom" ? h("div", { className: "dshc-field" }, [
      h("label", null, "RRULE"),
      h(Txt, { value: form.rrule, placeholder: "FREQ=WEEKLY;COUNT=10", onChange: (e) => patch({ rrule: e.target.value }) })
    ]) : null,
    h("div", { className: "dshc-field" }, [h("label", null, t("field.location")), h(Txt, { value: form.location, onChange: (e) => patch({ location: e.target.value }) })]),
    h("div", { className: "dshc-field" }, [
      h("label", null, t("field.description")),
      h("textarea", { className: "dshc-input", value: form.description, onChange: (e) => patch({ description: e.target.value }) })
    ]),
    conflicts.length > 0 ? h("div", { className: "dshc-alert warn" }, [
      h("div", null, [
        h("div", null, t("conflict.title", { n: conflicts.length })),
        conflicts.slice(0, 3).map((event) => h("div", { key: event.uid }, "\u2022 " + formatWhen(event) + " " + event.summary)),
        h("div", { className: "dshc-sub" }, t("conflict.hint"))
      ])
    ]) : null
  ]);

  const footer = h("div", { className: "dshc-actions" }, [
    h(Btn, { key: "cancel", variant: "ghost", onClick: onCancel, disabled: busy === true }, t("action.cancel")),
    h(Btn, { key: "save", variant: "primary", onClick: () => onSubmit(form), disabled: busy === true || canSave !== true }, busy === true ? "\u2026" : t("action.save"))
  ]);

  return h(Dlg, {
    open: true,
    onClose: onCancel,
    title: isEdit ? t("form.editTitle") : t("form.newTitle"),
    children: body,
    footer: footer
  });
}

// ───────────────────────────── 详情抽屉 ─────────────────────────────

function EventDrawer(props) {
  const { event, onClose, onEdit, onDelete, busy, confirmDelete, setConfirmDelete, events } = props;
  const [copied, setCopied] = useState(false);
  const seriesCount = event.isOccurrence ? events.filter((e) => e.seriesStart === event.seriesStart).length : 0;
  return h("div", { className: "dshc-overlay", onMouseDown: (e) => { if (e.target === e.currentTarget) onClose(); } }, [
    h("div", { className: "dshc-drawer", style: { position: "relative" } }, [
      h("button", { type: "button", className: "dshc-btn ghost dshc-close", onClick: onClose, "aria-label": "close" }, "\u2715"),
      h("div", { className: "dshc-drawertitle" }, event.summary),
      h("div", { className: "dshc-sub" }, [
        formatWhen(event),
        h("span", { className: "dshc-tag" }, formatDuration(event))
      ].filter(Boolean)),
      h("dl", { className: "dshc-kv" }, [
        event.rrule ? h("dt", { key: "rdt" }, t("repeat.recurring")) : null,
        event.rrule ? h("dd", { key: "rdd" }, humanRepeat(event.rrule) + " · " + event.rrule) : null,
        event.isOccurrence && !event.rrule ? h("dt", { key: "odt" }, t("repeat.occurrence")) : null,
        event.isOccurrence && !event.rrule ? h("dd", { key: "odd" }, (seriesCount > 0 ? seriesCount + " / " : "") + t("repeat.occurrence")) : null,
        event.location ? h("dt", { key: "ldt" }, t("field.location")) : null,
        event.location ? h("dd", { key: "ldd" }, event.location) : null,
        event.description ? h("dt", { key: "ddt" }, t("field.description")) : null,
        event.description ? h("dd", { key: "ddd", style: { whiteSpace: "pre-wrap" } }, event.description) : null,
        h("dt", { key: "udt" }, t("field.uid")),
        h("dd", { key: "udd" }, h("span", { className: "dshc-mono" }, event.uid))
      ].filter(Boolean)),
      h("div", { className: "dshc-actions" }, [
        h(Btn, { key: "copy", onClick: async () => { const ok = await copyText(event.uid); if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1600); } } }, copied ? t("action.copied") : t("action.copy")),
        h("span", { className: "dshc-spacer" }),
        confirmDelete
          ? h(Btn, { key: "confirm", variant: "primary", disabled: busy === true, onClick: () => onDelete(event) }, t("action.confirmDelete"))
          : h(Btn, { key: "delete", variant: "danger", onClick: () => setConfirmDelete(true), disabled: busy === true }, t("action.delete")),
        h(Btn, { key: "edit", variant: "outline", onClick: () => onEdit(event), disabled: busy === true }, t("action.edit"))
      ]),
      confirmDelete ? h("div", { className: "dshc-sub", style: { textAlign: "right", marginTop: "6px" } }, t("confirm.delete", { name: event.summary })) : null
    ])
  ]);
}

// ───────────────────────────── 连接设置 ─────────────────────────────

/** 每个服务商要填哪些格子。顺序就是表单里的顺序。 */
const PROVIDER_FIELDS = {
  google: ["calendarId", "clientId", "clientSecret", "refreshToken", "tokenUrl", "proxyUrl"],
  icloud: ["caldavUrl", "username", "password", "proxyUrl"],
  nextcloud: ["host", "user", "username", "calendar", "password", "proxyUrl"],
  custom: ["caldavUrl", "username", "password", "proxyUrl"]
};
const FIELD_LABEL = {
  caldavUrl: "conn.caldavUrl", username: "conn.username", password: "conn.password",
  host: "conn.host", user: "conn.user", calendar: "conn.calendar", calendarId: "conn.calendarId",
  clientId: "conn.clientId", clientSecret: "conn.clientSecret", refreshToken: "conn.refreshToken",
  tokenUrl: "conn.tokenUrl", proxyUrl: "conn.proxyUrl"
};
const SECRET_FIELDS = ["password", "clientSecret", "refreshToken"];
const PROVIDER_HINT = { google: "conn.googleHint", icloud: "conn.icloudHint", nextcloud: "conn.nextcloudHint", custom: "conn.customHint" };
/** 字段级小字提示：provider -> 字段 -> 文案 key（没有就不显示）。 */
const FIELD_HINT = {
  google: { calendarId: "hint.calendarId.google", refreshToken: "hint.refreshToken.google", clientId: "hint.clientId.google", tokenUrl: "hint.tokenUrl" },
  icloud: { caldavUrl: "hint.caldavUrl.icloud", username: "hint.username.icloud", password: "hint.password.icloud" },
  nextcloud: { host: "hint.host.nextcloud", user: "hint.user.nextcloud", username: "hint.username.nextcloud", calendar: "hint.calendar.nextcloud" },
  custom: { caldavUrl: "hint.caldavUrl.custom", username: "hint.username.custom" }
};
/** 「怎么拿到这些值」的步骤 + 外链（两边语言各一份文案，链接是共用的）。 */
const PROVIDER_LINKS = {
  google: [
    { href: "https://console.cloud.google.com/apis/credentials", key: "link.googleConsole" },
    { href: "https://developers.google.com/oauthplayground", key: "link.googlePlayground" }
  ],
  icloud: [{ href: "https://appleid.apple.com/account/manage", key: "link.appleId" }],
  nextcloud: [],
  custom: []
};
const PROVIDER_NAMES = ["google", "icloud", "nextcloud", "custom"];

/** 面板上的连接摘要 → 表单草稿。密钥一律留空，靠 placeholder 说明「已保存」。 */
function connectionDraftOf(connection) {
  const out = { provider: "" };
  for (const key of Object.keys(FIELD_LABEL)) out[key] = "";
  if (connection) {
    for (const key of Object.keys(out)) {
      if (typeof connection[key] === "string") out[key] = connection[key];
    }
  }
  return out;
}

/** 「当前：icloud · 你@icloud.com」里的那半句。 */
function connectionSummary(connection) {
  if (connection === null || connection === undefined) return "";
  const provider = connection.provider || "custom";
  const account = connection.calendarId || connection.username || connection.user
    || (connection.host ? String(connection.host).replace(/^https?:\/\//, "") : "")
    || connection.caldavUrl || "";
  return account === "" ? provider : provider + " · " + account;
}

/**
 * 连接设置表单：填 → 测试 → 保存。保存前服务端还会再测一次（test:true），
 * 所以「保存成功」等价于「这套凭据刚才真的连上了」。
 */
function ConnectionForm(props) {
  const { connection, onClose, onSaved } = props;
  const [form, setForm] = useState(() => connectionDraftOf(connection));
  const [busy, setBusy] = useState("");
  const [result, setResult] = useState(null);
  const maySave = connection === null || connection.settingsAvailable !== false;
  const patch = (fields) => setForm((prev) => Object.assign({}, prev, fields));
  const visible = PROVIDER_FIELDS[form.provider] || [];
  const payload = () => {
    const out = {};
    for (const key of Object.keys(FIELD_LABEL)) {
      const value = form[key];
      if (typeof value !== "string") continue;
      // 密钥留空 = 保持已存的那一份；其余字段空串服务端也按「保持不变」处理。
      if (SECRET_FIELDS.indexOf(key) !== -1 && value.trim() === "") continue;
      out[key] = value.trim();
    }
    if (form.provider !== "") out.provider = form.provider;
    if (form.provider === "google") out.authMethod = "oauth";
    return out;
  };
  const test = async () => {
    setBusy("test");
    setResult(null);
    try {
      const value = await api("testConnection", payload());
      const sample = (value.sample || []).join("、");
      setResult({ ok: true, text: t("conn.ok", { n: value.count }) + (sample === "" ? "" : t("conn.okSample", { sample })) });
    } catch (error) {
      setResult({ ok: false, text: error && error.message ? error.message : String(error) });
    } finally {
      setBusy("");
    }
  };
  const save = async () => {
    setBusy("save");
    setResult(null);
    try {
      onSaved(await api("saveConnection", Object.assign({}, payload(), { test: true })));
    } catch (error) {
      setResult({ ok: false, text: error && error.message ? error.message : String(error) });
    } finally {
      setBusy("");
    }
  };
  const body = h("div", null, [
    h("div", { className: "dshc-sub", style: { marginBottom: "10px" } }, t("conn.intro")),
    maySave !== true
      ? h("div", { className: "dshc-alert warn" }, t("conn.noSettings"))
      : null,
    h("div", { className: "dshc-field" }, [
      h("label", null, t("conn.provider")),
      h("select", { className: "dshc-input", value: form.provider, onChange: (e) => patch({ provider: e.target.value }) },
        [h("option", { value: "", key: "__none" }, "— " + t("conn.needProvider") + " —")].concat(
          PROVIDER_NAMES.map((name) => h("option", { value: name, key: name }, name === "custom" ? "自建 CalDAV" : name === "icloud" ? "iCloud" : name === "nextcloud" ? "Nextcloud" : "Google"))
        ))
    ]),
    PROVIDER_HINT[form.provider] ? h("div", { className: "dshc-sub", style: { marginBottom: "8px" } }, t(PROVIDER_HINT[form.provider])) : null,
    form.provider === "" ? null : h("details", { className: "dshc-steps" }, [
      h("summary", { key: "sum" }, t("conn.steps")),
      h("ol", { key: "list" }, (UI[UI_LANG]["steps." + form.provider] || []).map((line, index) => h("li", { key: "s" + index }, line))),
      (PROVIDER_LINKS[form.provider] || []).length === 0 ? null : h("div", { key: "links", style: { marginTop: "6px", display: "flex", gap: "10px", flexWrap: "wrap" } },
        (PROVIDER_LINKS[form.provider] || []).map((link) => h("a", { key: link.href, href: link.href, target: "_blank", rel: "noreferrer", className: "dshc-link" }, t(link.key))))
    ]),
    visible.map((key) => {
      const secret = SECRET_FIELDS.indexOf(key) !== -1;
      const stored = connection !== null && connection !== undefined && (
        (key === "password" && connection.hasPassword === true)
        || (key === "clientSecret" && connection.hasClientSecret === true)
        || (key === "refreshToken" && connection.hasRefreshToken === true));
      const hintKey = FIELD_HINT[form.provider] ? FIELD_HINT[form.provider][key] : undefined;
      return h("div", { className: "dshc-field", key }, [
        h("label", null, t(FIELD_LABEL[key])),
        h(Txt, {
          type: secret ? "password" : "text",
          value: form[key] || "",
          placeholder: stored ? t("conn.keep") : "",
          onChange: (e) => patch({ [key]: e.target.value })
        }),
        hintKey ? h("div", { className: "dshc-sub", style: { marginTop: "3px" } }, t(hintKey)) : null
      ]);
    }),
    result !== null
      ? h("div", { className: "dshc-alert " + (result.ok === true ? "demo" : "error") }, (result.ok === true ? "✓ " : t("conn.fail") + "：") + result.text)
      : null,
    h("div", { className: "dshc-actions" }, [
      h(Btn, { key: "cancel", onClick: onClose, disabled: busy !== "" }, t("action.cancel")),
      h(Btn, { key: "test", onClick: test, disabled: busy !== "" || form.provider === "" }, busy === "test" ? t("conn.testing") : t("conn.test")),
      h(Btn, { key: "save", variant: "primary", onClick: save, disabled: busy !== "" || form.provider === "" || maySave !== true }, busy === "save" ? t("conn.saving") : t("conn.save"))
    ]),
    maySave !== true || (connection !== null && connection !== undefined && connection.settingsKind === "file")
      ? h("div", { className: "dshc-sub", style: { marginTop: "10px" } },
          connection !== null && connection !== undefined && connection.settingsKind === "file"
            ? t("conn.storageFallback", { reason: connection.settingsReason || "插件未注入宿主 settings 服务" })
            : t("conn.current", { summary: connectionSummary(connection) }))
      : null
  ]);
  return h(Dlg, { open: true, onClose, title: t("conn.title"), children: body });
}

// ───────────────────────────── 主面板 ─────────────────────────────

function CalendarPanel(props) {
  const compact = props.compact === true;
  const [view, setView] = useState("month");
  const [anchor, setAnchor] = useState(() => new Date());
  const [demo, setDemo] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState(null);
  const [banner, setBanner] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [configured, setConfigured] = useState(null);
  const [conn, setConn] = useState(null);
  const [connOpen, setConnOpen] = useState(false);
  useEffect(() => {
    let alive = true;
    api("connection", {}).then((value) => { if (alive) { setConn(value); setConfigured(value && value.configured !== false); } })
      .catch(() => { if (alive) setConfigured(true); }); // 状态都问不到时按「已配置」处理，让错误条去解释
    return () => { alive = false; };
  }, [reloadToken]);

  const range = useMemo(() => rangeOf(view, anchor), [view, anchor.getFullYear(), anchor.getMonth(), anchor.getDate()]);
  const data = useCalendarData(range, reloadToken, demo);
  const reload = () => setReloadToken((n) => n + 1);

  const notify = (text) => { setBanner(text); setTimeout(() => setBanner((current) => (current === text ? null : current)), 2200); };

  const title = view === "week" ? formatWeekTitle(anchor) : view === "agenda" ? t("view.agenda") : formatMonthTitle(anchor);
  const step = (delta) => setAnchor((current) => (view === "week" ? addDays(current, delta * 7) : addMonthShift(current, delta)));

  const submit = async (form) => {
    setBusy(true);
    setFormError(null);
    try {
      const fields = fieldsOfDraft(form);
      if (form.uid === undefined) await api("create", fields);
      else await api("update", Object.assign({ uid: form.uid }, fields));
      setDraft(null);
      setSelected(null);
      reload();
      notify(form.uid === undefined ? "已创建" : "已保存");
    } catch (error) {
      setFormError(error && error.message ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (event) => {
    setBusy(true);
    try {
      await api("delete", { uid: event.uid });
      setSelected(null);
      setConfirmDelete(false);
      reload();
      notify("已删除");
    } catch (error) {
      setBanner(error && error.message ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  };

  const toolbar = h("div", { className: "dshc-toolbar" }, [
    h("h3", { className: "dshc-title", key: "title" }, t("section.title")),
    h("div", { className: "dshc-tabs", key: "tabs" }, VIEWS.map((name) => h("button", {
      key: name, type: "button", className: "dshc-tab" + (view === name ? " on" : ""), onClick: () => setView(name)
    }, t("view." + name)))),
    h("span", { className: "dshc-spacer", key: "spacer" }),
    h("span", { className: "dshc-monthhead", key: "period" }, title),
    h(Btn, { key: "prev", onClick: () => step(-1), "aria-label": t("action.prev") }, "\u2039"),
    h(Btn, { key: "today", onClick: () => setAnchor(new Date()) }, t("action.today")),
    h(Btn, { key: "next", onClick: () => step(1), "aria-label": t("action.next") }, "\u203a"),
    h(Btn, { key: "conn", onClick: () => setConnOpen(true) }, t("conn.button")),
    demo === true
      ? h(Btn, { key: "exitdemo", onClick: () => setDemo(false) }, t("action.exitDemo"))
      : h(Btn, { key: "reload", onClick: reload }, t("action.refresh")),
    h(Btn, { key: "new", variant: "primary", onClick: () => setDraft(draftAt(anchor)) }, t("action.new"))
  ]);

  const body = () => {
    if (demo === false && configured === false) {
      return h("div", { className: "dshc-empty" }, [
        h("h3", null, t("state.notConfigured")),
        h("p", null, t("state.notConfiguredHint")),
        h("div", { style: { marginTop: "12px", display: "flex", gap: "8px", justifyContent: "center" } }, [
          h(Btn, { key: "cfg", variant: "primary", onClick: () => setConnOpen(true) }, t("conn.button")),
          h(Btn, { key: "demo", onClick: () => setDemo(true) }, t("action.demo"))
        ])
      ]);
    }
    if (configured === null) return h("div", { className: "dshc-grid" }, Array.from({ length: 7 }, (_, i) => h("div", { className: "dshc-skel", key: i })));
    if (data.loading === true && data.events.length === 0) {
      return h("div", { className: "dshc-grid" }, Array.from({ length: 14 }, (_, i) => h("div", { className: "dshc-skel", key: i })));
    }
    if (view === "week") return h(WeekView, { anchor, events: data.events, onPick: openEvent, onCreateAt: createAt });
    if (view === "agenda") return h(AgendaView, { events: data.events, onPick: openEvent, onCreateAt: createAt });
    return h(MonthView, { anchor, events: data.events, onPick: openEvent, onCreateAt: createAt });
  };

  const openEvent = (event) => { setConfirmDelete(false); setSelected(event); };
  const createAt = (day, hour) => setDraft(draftAt(day, hour));

  return h("div", { className: "dshc-root" }, [
    h("div", { className: "dshc-shell" }, [
      banner !== null ? h("div", { className: "dshc-alert demo" }, banner) : null,
      demo === true ? h("div", { className: "dshc-alert demo" }, t("demo.banner")) : null,
      data.error !== null && data.error !== undefined && demo === false && configured !== false
        ? h("div", { className: "dshc-alert error" }, [
            h("span", null, (data.error.message || t("error.load"))),
            h("span", { className: "dshc-spacer" }),
            h(Btn, { onClick: reload }, t("action.retry"))
          ])
        : null,
      compact === true ? toolbar : h("div", null, [toolbar]),
      body(),
      h("div", { className: "dshc-footer" }, [
        h("span", null, t("count.events", { n: data.events.length }) + (data.events.some((e) => e.isOccurrence) ? " · " + t("count.occurrences", { n: data.events.filter((e) => e.isOccurrence).length }) : "")),
        h("span", null, demo === true ? "" : (conn !== null && conn !== undefined && conn.configured === true ? t("conn.current", { summary: connectionSummary(conn) }) : ""))
      ])
    ]),
    selected !== null
      ? h(EventDrawer, {
          event: selected,
          events: data.events,
          busy,
          confirmDelete,
          setConfirmDelete,
          onClose: () => { setSelected(null); setConfirmDelete(false); },
          onEdit: (event) => { setSelected(null); setDraft(draftOfEvent(event)); },
          onDelete: remove
        })
      : null,
    draft !== null
      ? h(EventForm, { draft, events: data.events, busy, error: formError, onCancel: () => { setDraft(null); setFormError(null); }, onSubmit: submit })
      : null,
    connOpen === true
      ? h(ConnectionForm, {
          connection: conn,
          onClose: () => setConnOpen(false),
          onSaved: (value) => {
            if (value && value.connection) setConn(value.connection);
            setConnOpen(false);
            setDemo(false);
            reload();
            notify(t("conn.savedToast"));
          }
        })
      : null
  ]);
}

/** 月份平移：先跳到本月 1 号再加月，避免 1 月 31 日 +1 个月变成 3 月 3 日。 */
function addMonthShift(date, delta) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const shifted = new Date(first.getFullYear(), first.getMonth() + delta, 1);
  const lastDay = new Date(shifted.getFullYear(), shifted.getMonth() + 1, 0).getDate();
  return new Date(shifted.getFullYear(), shifted.getMonth(), Math.min(date.getDate(), lastDay));
}

/** 设置页里的那一节。 */
function CalendarSection() {
  return h("div", null, [
    h("h2", null, t("section.title")),
    h("p", { className: "dshc-sub" }, t("section.intro")),
    h(CalendarPanel, {})
  ]);
}

/** 对话页右下角的小按钮 + 悬浮面板（自己挂 root，不占用宿主槽位）。 */
function Launcher() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open !== true) return () => {};
    const onKey = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  const calendarIcon = h("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" }, [
    h("rect", { key: "r", x: 3, y: 5, width: 18, height: 16, rx: 3 }),
    h("path", { key: "l", d: "M3 10h18M8 3v4M16 3v4" })
  ]);
  return h("div", null, [
    h("button", {
      type: "button",
      className: "dshc-fab" + (open === true ? " on" : ""),
      title: t("nav.title"),
      "aria-label": t("nav.title"),
      onClick: () => setOpen((value) => !value)
    }, calendarIcon),
    open === true ? h("div", { className: "dshc-float" }, h(CalendarPanel, { compact: true })) : null
  ]);
}

// ───────────────────────────── 挂载 ─────────────────────────────

const inject = ["slots", "locale"];

function apply(ctx) {
  // 语言要在任何 t() 之前定下来（与 dsh-email 同款契约）。
  try { ctx.effect(() => subscribeLocale(ctx), "dsh-calendar: locale"); } catch (e) { /* 没有 effect 的宿主不该拖垮面板 */ }

  try {
    ctx.effect(() => {
      const id = "dsh-calendar/client";
      if (document.querySelector('style[data-plugin-css="' + id + '"]')) return () => {};
      const style = document.createElement("style");
      style.dataset.plugin = "dsh-calendar";
      style.dataset.pluginCss = id;
      style.textContent = CSS + CSS_EXTRA;
      document.head.appendChild(style);
      return () => { style.remove(); };
    }, "dsh-calendar: styles");
  } catch (e) { /* 无 DOM 环境（纯 node 侧冒烟）时跳过 */ }

  try {
    ctx.slots.inject("settings.section", () => ctx.slots.register({
      name: "settings.section",
      id: "dsh-calendar",
      order: 50,
      label: () => t("nav.title"),
      inject: () => ({})
    }, CalendarSection));
  } catch (e) { /* 没有 slots 服务：仍是合法的插件，只是没有设置页 */ }

  try {
    ctx.effect(() => mountLauncher(), "dsh-calendar: floating panel");
  } catch (e) { /* 同上 */ }
}

/** 把悬浮面板挂到页面上；已经挂过（HMR / 重复 apply）就复用。 */
function mountLauncher() {
  if (typeof document === "undefined" || document.body === null) return () => {};
  if (document.getElementById("dsh-calendar-root") !== null) return () => {};
  const host = document.createElement("div");
  host.id = "dsh-calendar-root";
  document.body.appendChild(host);
  let root = null;
  try {
    const ReactDomClient = require("react-dom/client");
    root = ReactDomClient.createRoot(host);
    root.render(h(Launcher, {}));
  } catch (e) {
    // 老宿主没有 react-dom/client 时不要静默留下一个空气泡：整个按钮一起撤掉。
    host.remove();
    return () => {};
  }
  return () => {
    try { if (root !== null) root.unmount(); } catch (e) { /* 卸载失败也要把节点摘掉 */ }
    host.remove();
  };
}

relocalize = () => { /* 面板是 React 树，语言切换由 subscribeLocale 触发的重渲染覆盖 */ };

exports.apply = apply;
exports.inject = inject;

return module.exports;
}});
