// Editable browser entry. Build with node scripts/build-client.mjs.
window.__ModuleLoader__.load({ id: "dsh-calendar", factory: (require) => {
        var module = { exports: {} };
        var exports = module.exports;
        "use strict";
        const React = require("react");
        let calendarHostContext;
        const { useState, useEffect, useMemo, useRef, useId } = React;
        const h = React.createElement;
        // @calendar-ui
        // Resolve against the Harness document base, including any reverse-proxy prefix.
        const ROUTE = "api/dsh-calendar/settings";
        const IMPORT_ROUTE = "api/dsh-calendar/import";
        /** 三视图；order 决定 tab 顺序。 */
        const VIEWS = ["month", "week", "agenda"];
        const WEEKDAYS_ZH = ["一", "二", "三", "四", "五", "六", "日"];
        /** 上次用的视图：用户下次打开面板不该又跳回「月」。localStorage 不可用（隐私模式）就退回 default。 */
        const VIEW_STORAGE_KEY = "dsh-calendar:view";
        function loadStoredView() {
            try {
                const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
                return VIEWS.indexOf(stored) === -1 ? "month" : stored;
            }
            catch (error) {
                return "month";
            }
        }
        function storeView(view) {
            try {
                window.localStorage.setItem(VIEW_STORAGE_KEY, view);
            }
            catch (error) { /* 写不进去就算了 */ }
        }
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
                "state.notConfiguredHint": "点击“连接设置”，选择日历服务并填写账号信息，测试连接后保存即可。也可以先查看示例，了解日历的用法。",
                "state.readonly": "只读",
                "demo.banner": "示例日历为只读，可以切换视图和查看详情。点击「退出示例」后连接自己的日历，即可创建和修改日程。",
                "field.summary": "标题", "field.date": "日期", "field.start": "开始", "field.end": "结束",
                "field.allDay": "全天", "field.location": "地点", "field.description": "备注",
                "field.repeat": "重复", "field.uid": "事件 uid", "field.when": "时间", "field.duration": "时长",
                "repeat.none": "不重复", "repeat.daily": "每天", "repeat.weekly": "每周", "repeat.monthly": "每月", "repeat.yearly": "每年", "repeat.custom": "自定义 RRULE",
                "repeat.weeklyEvery": "每周（{n} 次）", "repeat.recurring": "重复", "repeat.occurrence": "系列中的一次",
                "conflict.title": "这个时段已有 {n} 个日程，会重叠：", "conflict.hint": "仍然保存？",
                "error.title": "操作失败", "error.load": "读取日历失败",
                "confirm.delete": "删除「{name}」？这个操作会同步到你的日历服务器。",
                "confirm.deleteSeries": "将删除「{name}」整个重复系列的所有场次，包含当前视图外的场次。无法撤销。",
                "form.series": "正在编辑整个重复系列，所有场次都会受影响。含取消或单独改期场次时，请到原日历客户端调整时间和规则。",
                "form.newTitle": "新建日程", "form.editTitle": "编辑日程",
                "form.required": "标题和时间都要填。",
                "day.today": "今天", "day.tomorrow": "明天", "day.yesterday": "昨天",
                "count.events": "{n} 个日程", "count.occurrences": "含 {n} 次重复展开",
                "format.duration.hm": "{h} 小时 {m} 分", "format.duration.h": "{h} 小时", "format.duration.m": "{m} 分钟", "format.duration.zero": "0 分钟",
                "format.allday": "全天",
                "drag.hint": "提示：周视图里可以直接拖动日程改期 —— 上下拖改时间、左右拖换天，拖块底部改时长；键盘 ↑/↓ 挪 15 分钟、Shift+↑/↓ 挪 1 小时、←/→ 挪一天。",
                "drag.drop": "松手即改到这里",
                "drag.conflict": "与 {n} 个日程重叠",
                "drag.keep": "仍可松手",
                "drag.moveTitle": "可拖动改期",
                "drag.resizeTitle": "拖动改时长",
                "move.recurringUnsupported": "重复日程暂不支持拖动改期：请在详情里用「编辑」（拖动会重锚系列起点，早于该次的实例会消失）。",
                "move.tooLong": "超过 24 小时的日程暂不支持拖动改期。",
                "move.saved": "已改期",
                "move.undo": "撤销",
                "move.failed": "改期失败：{message}",
                "conn.button": "连接设置",
                "conn.title": "CalDAV 连接设置",
                "conn.intro": "测试连接不会修改日历。连接成功后，点击“保存并启用”。",
                "conn.provider": "服务商",
                "provider.custom": "自建 CalDAV",
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
                "conn.keep": "已配置，留空不改",
                "conn.test": "测试连接",
                "conn.testing": "正在连接…",
                "conn.save": "保存并启用",
                "conn.saving": "保存中…",
                "conn.ok": "连接成功：未来 30 天读到 {n} 个日程",
                "conn.okSample": "（例如：{sample}）",
                "conn.fail": "连接失败",
                "conn.savedToast": "连接已保存，工具下一次调用就用它",
                "conn.noSettings": "当前无法保存连接设置。请检查 DSH 与日历插件是否已更新，再重新打开此页面。",
                "conn.storageFallback": "连接信息保存在运行 DSH 的设备上，保存后立即生效。",
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
                "hint.caldavUrl.icloud": "已知集合地址时可以手动填写。公开订阅链接不能用于写入。",
                "hint.username.icloud": "你的 Apple ID 邮箱",
                "hint.password.icloud": "必须用 App 专用密码，不是 Apple ID 登录密码",
                "hint.host.nextcloud": "含 https://，结尾不要带 /",
                "hint.user.nextcloud": "拼 CalDAV 地址用的用户名（通常与登录名相同）",
                "hint.username.nextcloud": "用于认证的账号名；与上一栏不同时才需要分别填",
                "hint.calendar.nextcloud": "日历名，个人日历默认是 personal",
                "hint.caldavUrl.custom": "完整日历集合 URL，结尾的 / 别丢",
                "hint.username.custom": "登录账号 / 邮箱",
                "steps.google": ["在 Google Cloud 控制台新建项目，并启用「Google Calendar API」", "「凭据」→ 创建凭据 → OAuth 客户端 ID，类型选「桌面应用」，拿到 clientId 与 clientSecret", "打开 OAuth Playground（齿轮里勾 Use your own OAuth credentials，填上面的 clientId / clientSecret），授权 scope https://www.googleapis.com/auth/calendar，换取 refreshToken", "日历 ID 一般就是你的 Gmail 地址；四格填完点「测试连接」"],
                "steps.icloud": ["在 Apple 账户的「登录与安全」中生成 App 专用密码", "填写 Apple 账户和 App 专用密码，点击「发现日历」", "选择日历，再测试并保存连接"],
                "steps.nextcloud": ["服务器地址填 https://cloud.example.com（结尾不带 /）", "用户名 = 登录名；日历名在「日历」应用左侧能看到，个人日历默认叫 personal", "密码用 App 密码或登录密码，填完点「测试连接」"],
                "steps.custom": ["在服务商后台找到你日历的集合 URL（以 / 结尾），例如 https://cloud.example.com/remote.php/dav/calendars/用户名/日历名/", "账号填登录名，密码填授权码 / App 密码，填完点「测试连接」"],
                "conn.googleHint": "Google 必须用 OAuth：clientSecret 与 refreshToken 由一次授权换成，README 里有换取步骤；Google 不接受应用专用密码。",
                "conn.icloudHint": "用 Apple 账户和 App 专用密码发现日历。",
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
                "state.notConfiguredHint": "Open Connection settings, choose your calendar service and enter your account details, then test and save the connection. You can also explore the sample calendar first.",
                "state.readonly": "read-only",
                "demo.banner": "This sample calendar is read-only. Switch views and open event details. Exit the sample and connect your calendar to create or edit events.",
                "field.summary": "Title", "field.date": "Date", "field.start": "Start", "field.end": "End",
                "field.allDay": "All day", "field.location": "Location", "field.description": "Notes",
                "field.repeat": "Repeats", "field.uid": "Event uid", "field.when": "When", "field.duration": "Duration",
                "repeat.none": "Does not repeat", "repeat.daily": "Daily", "repeat.weekly": "Weekly", "repeat.monthly": "Monthly", "repeat.yearly": "Yearly", "repeat.custom": "Custom RRULE",
                "repeat.weeklyEvery": "Weekly ({n} times)", "repeat.recurring": "Recurring", "repeat.occurrence": "One occurrence of a series",
                "conflict.title": "This slot already has {n} event(s); they overlap:", "conflict.hint": "Save anyway?",
                "error.title": "Something failed", "error.load": "Could not load the calendar",
                "confirm.delete": "Delete「{name}」? This is pushed to your calendar server.",
                "confirm.deleteSeries": "Delete every occurrence of {name}, including dates outside this view? This cannot be undone.",
                "form.series": "Editing the entire recurring series. All occurrences are affected. If it has cancelled or rescheduled occurrences, change times and rules in your original calendar app.",
                "form.newTitle": "New event", "form.editTitle": "Edit event",
                "form.required": "A title and a time range are required.",
                "day.today": "Today", "day.tomorrow": "Tomorrow", "day.yesterday": "Yesterday",
                "count.events": "{n} events", "count.occurrences": "{n} expanded occurrences",
                "format.duration.hm": "{h}h {m}m", "format.duration.h": "{h}h", "format.duration.m": "{m}m", "format.duration.zero": "0m",
                "format.allday": "All day",
                "drag.hint": "Tip: drag events in the week view to reschedule — up/down changes the time, left/right changes the day, the bottom edge changes the duration. Keyboard: ↑/↓ moves 15 min, Shift+↑/↓ an hour, ←/→ a day.",
                "drag.drop": "release to drop here",
                "drag.conflict": "overlaps {n} event(s)",
                "drag.keep": "you can still drop it",
                "drag.moveTitle": "drag to reschedule",
                "drag.resizeTitle": "drag to resize",
                "move.recurringUnsupported": "Recurring events cannot be dragged yet — use Edit in the details drawer (dragging would re-anchor the series and drop earlier occurrences).",
                "move.tooLong": "Events longer than 24 hours cannot be dragged yet.",
                "move.saved": "Rescheduled",
                "move.undo": "Undo",
                "move.failed": "Could not reschedule: {message}",
                "conn.button": "Connection",
                "conn.title": "CalDAV connection",
                "conn.intro": "Testing the connection does not change your calendar. Once it succeeds, click Save and enable.",
                "conn.provider": "Provider",
                "provider.custom": "Custom CalDAV",
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
                "conn.keep": "configured — leave blank to keep",
                "conn.test": "Test connection",
                "conn.testing": "Connecting…",
                "conn.save": "Save and enable",
                "conn.saving": "Saving…",
                "conn.ok": "Connected: {n} events in the next 30 days",
                "conn.okSample": " (e.g. {sample})",
                "conn.fail": "Connection failed",
                "conn.savedToast": "Saved — the tools pick it up on their next call",
                "conn.noSettings": "Connection settings cannot be saved right now. Check that DSH and the calendar plugin are up to date, then reopen this page.",
                "conn.storageFallback": "Connection details are stored on the device running DSH. Saved changes take effect immediately.",
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
                "hint.caldavUrl.icloud": "Enter a collection URL if you already have one. Public subscription links are read-only.",
                "hint.username.icloud": "your Apple ID email",
                "hint.password.icloud": "an app-specific password, not your Apple ID password",
                "hint.host.nextcloud": "include https:// and drop any trailing /",
                "hint.user.nextcloud": "the username used to build the CalDAV URL",
                "hint.username.nextcloud": "the account used to authenticate; fill it separately only when it differs",
                "hint.calendar.nextcloud": "calendar name; the personal one is usually called personal",
                "hint.caldavUrl.custom": "the full collection URL — keep the trailing slash",
                "hint.username.custom": "login account / email",
                "steps.google": ["Create a project in the Google Cloud console and enable the Google Calendar API", "Credentials → Create credentials → OAuth client ID, type Desktop app; copy clientId and clientSecret", "Open the OAuth Playground (gear icon: Use your own OAuth credentials, paste clientId/clientSecret), authorize scope https://www.googleapis.com/auth/calendar and exchange a refreshToken", "The calendar ID is usually your Gmail address; then hit Test connection"],
                "steps.icloud": ["Create an app-specific password in your Apple Account under Sign-In and Security", "Enter your Apple Account and app-specific password, then select Discover calendars", "Choose a calendar, then test and save your connection"],
                "steps.nextcloud": ["Server: https://cloud.example.com (no trailing slash)", "Username = your login; the calendar name is shown in the Calendar app (personal by default)", "Use an app password or your login password, then hit Test connection"],
                "steps.custom": ["Find your calendar collection URL in the provider's settings (it ends with /), e.g. https://cloud.example.com/remote.php/dav/calendars/user/calendar/", "Fill the login account and an app password / token, then Test connection"],
                "conn.googleHint": "Google requires OAuth: exchange clientSecret and refreshToken once (see the README); Google does not accept app passwords.",
                "conn.icloudHint": "Discover calendars using your Apple Account and an app-specific password.",
                "conn.nextcloudHint": "Nextcloud needs the server URL, username and calendar name; any app password works.",
                "conn.customHint": "For a self-hosted CalDAV give the full collection URL (keep the trailing slash), e.g. https://cloud.example.com/remote.php/dav/calendars/user/calendar/."
            }
        };
        var UI_LANG = "zh";
        var relocalize = null;
        var activeLocaleService = null;
        // Backend guidance is localized separately from event titles and source content.
        const BACKEND_EN = {
            "请先选择 iCloud 服务商。": "Select iCloud as the calendar provider.",
            "请填写有效的 Apple 账户。": "Enter a valid Apple Account.",
            "iCloud 认证失败，请检查 Apple 账户与 App 专用密码。": "iCloud sign-in failed. Check your Apple Account and app-specific password.",
            "无法连接 iCloud，请检查网络或代理后重试。": "Could not connect to iCloud. Check your network or proxy and retry.",
            "iCloud 日历发现请求失败。": "iCloud calendar discovery failed.",
            "iCloud 日历发现已取消或超时。": "iCloud calendar discovery was cancelled or timed out.",
            "发现日历时收到不受信任的 iCloud 地址。": "Calendar discovery received an untrusted iCloud address.",
            "没有找到可选择的 iCloud 日历。": "No iCloud calendars are available to select.",
            "iCloud 未返回日历账户地址。": "iCloud did not return a calendar account address.",
            "iCloud 未返回日历目录。": "iCloud did not return a calendar directory.",
            "iCloud 返回了无法读取的日历列表。": "iCloud returned an unreadable calendar list.",
            "iCloud 返回的日历列表过大。": "The iCloud calendar list is too large.",
            "请在 DSH 中配置日程解析模型。": "Configure a DSH model to extract event details.",
            "请选择可用的 DSH 模型。": "Select an available DSH model.",
            "请选择支持图片输入的 DSH 模型。": "Select a DSH model with image input.",
            "请粘贴日程文字或选择截图。": "Paste event text or choose a screenshot.",
            "请使用 PNG、JPEG 或 WebP 截图。": "Use a PNG, JPEG, or WebP screenshot.",
            "截图超过 2 MiB，请裁剪后重试。": "The screenshot exceeds 2 MiB. Crop it and try again.",
            "日程解析已取消或超时。": "Event extraction was cancelled or timed out.",
            "无法识别当前时区。": "The current time zone could not be resolved.",
            "无法读取截图附件。": "Could not read the screenshot.",
            "无法使用所选 DSH 模型，请检查模型设置后重试。": "Could not use the selected DSH model. Check the model settings and retry.",
            "模型未完成日程解析，请重试。": "The model did not finish extracting event details. Try again.",
            "模型未返回可用的日程草稿。": "The model did not return a usable event draft.",
            "未从材料中识别到日程。": "No event could be identified in the supplied material.",
            '系列含已取消、额外或单独改期的场次，不能整体改开始时间、全天类型或重复规则；请在原日历客户端编辑，现有日程未改动。': 'This series has cancelled, extra or rescheduled occurrences. Change its start time, all-day type or recurrence rule in the original calendar app. No event was changed.',
            '这是整个重复系列。请先向用户说明影响，确认后显式传 scope="series"；当前不支持只改某一次。': 'This action changes the entire recurring series. Explain its impact, then use scope="series" after confirmation. Editing just one occurrence is unsupported.',
            '这是整个重复系列。请先向用户说明影响，确认后显式传 scope="series"；当前不支持只删某一次。': 'This action deletes the entire recurring series. Explain its impact, then use scope="series" after confirmation. Deleting just one occurrence is unsupported.',
            '找不到或无法解析日程，请刷新日历后重试。': 'The event is missing or could not be parsed. Refresh the calendar and try again.',
            '无法解析原日程，更新已取消；请在原日历客户端检查。': 'The original event could not be parsed. No update was made. Check it in the original calendar app.',
            "日期格式不合法": "Invalid date format.",
            "日程包含不存在的日期或时间": "This event contains an invalid date or time.",
            "请先选择或粘贴 ICS 文件内容": "Choose an ICS file or paste its content first.",
            "ICS 文件超过 256 KiB，请分批导出": "The ICS file exceeds 256 KiB. Export smaller batches.",
            "ICS 结构不合法或嵌套过深": "The ICS structure is invalid or nested too deeply.",
            "ICS 文件不完整": "The ICS file is incomplete.",
            "无法读取 ICS，请从日历应用重新导出": "Could not read the ICS file. Export it again from your calendar app.",
            "暂不支持 PERIOD 类型的 RDATE，请改用日期列表后导入": "PERIOD RDATE values are unsupported. Export a list of dates instead.",
            "全天日期不能含 TZID": "All-day dates must not contain TZID.",
            "文件含未标注时区的时间，请选择解释时区后重新预览": "This file contains times without a timezone. Choose an interpretation timezone and preview again.",
            "UTC 时间不能同时标注 TZID": "UTC timestamps must not also contain TZID.",
            "原文件缺少 DTSTAMP，导入时补齐": "DTSTAMP is missing and will be added during import.",
            "作为私人日程复制，不导入参与者或发送邀请": "Imported as a private copy. Attendees are omitted and no invitations are sent.",
            "仅保留屏幕提醒，已移除其他提醒动作": "Only display reminders are retained; other alarm actions were removed.",
            "开始与结束必须同时为全天日期或具体时间": "Start and end must both be all-day dates or both be timestamps.",
            "日程或重复例外的结束时间早于开始时间": "The event or recurring exception ends before it starts.",
            "日程无法解析": "Could not parse this event.",
            "结束时间早于开始时间": "End time precedes start time.",
            "重复规则 UNTIL 需要 UTC 时间，请重新导出": "The recurrence UNTIL must use UTC. Export the event again.",
            "日程格式不合法": "Invalid event format.",
            "日历连接已改变，请重新预览": "The calendar connection changed. Preview again.",
            "请先核对预览，再确认导入": "Review the preview before confirming import.",
            "预览已过期或插件已重启，请重新预览": "The preview expired or the plugin restarted. Preview again.",
            "每次请选择 1–20 个日程系列，其余可分批导入": "Select 1–20 event series per batch.",
            "选择包含不可导入的日程，请重新预览": "Some selected events cannot be imported. Preview again.",
            "另一批日程正在导入，请稍后重试": "Another batch is importing. Try again after it finishes.",
            "不支持此导入操作": "Unsupported import operation.",
            "请求必须是对象": "The request must be an object."
        };
        function backendMessage(error) {
            const message = typeof error === 'string' ? error : error?.message || String(error || '');
            if (UI_LANG !== 'en')
                return message;
            if (error?.status === 401)
                return 'Your DSH session expired. Reopen DSH and try again.';
            if (BACKEND_EN[message])
                return BACKEND_EN[message];
            if (!/[\u3400-\u9fff]/.test(message))
                return message;
            const timezone = message.match(/^(文件重复定义时区|时区定义不完整|时区规则的 DTSTART 必须是本地时间|时区偏移不合法|缺少时区定义)：(.+)$/);
            if (timezone)
                return ({ '文件重复定义时区': 'Duplicate timezone definition', '时区定义不完整': 'Incomplete timezone definition', '时区规则的 DTSTART 必须是本地时间': 'Timezone DTSTART must use local time', '时区偏移不合法': 'Invalid timezone offset', '缺少时区定义': 'Missing timezone definition' })[timezone[1]] + ': ' + timezone[2];
            const floating = message.match(/^原文件未标注时区，按 (.+) 解释$/);
            if (floating)
                return 'No timezone in the source; interpreted as ' + floating[1] + '.';
            if (/OAuth|Google|凭据|未配置|尚未配置|没有配置|连接设置/.test(message))
                return 'Calendar credentials are incomplete. Open Connection settings and configure the calendar account; the DSH model API key cannot be used here.';
            if (/时区/.test(message))
                return 'Invalid or missing timezone. Choose an interpretation timezone or export a file with VTIMEZONE.';
            if (/VCALENDAR|VERSION|VEVENT/.test(message))
                return 'Use a valid iCalendar 2.0 file containing VEVENT entries.';
            if (/UID|重复/.test(message))
                return 'Check event UIDs and recurrence definitions, then export the file again.';
            if (/冲突|修改|改变/.test(message))
                return 'The calendar or event changed. Reload it and review your input before retrying.';
            return 'The calendar operation failed. Check the connection and source file, then try again.';
        }
        const languageListeners = new Set();
        function useUILanguage() {
            const [, render] = useState(UI_LANG);
            useEffect(() => { const update = () => render(UI_LANG); languageListeners.add(update); update(); return () => languageListeners.delete(update); }, []);
        }
        /** 宿主 locale 服务：get('locale') 是正规读法，ctx.locale 兜旧宿主，都没有就是没有。 */
        function localeServiceOf(ctx) {
            try {
                if (typeof ctx.get === "function") {
                    const viaGet = ctx.get("locale");
                    if (viaGet !== undefined && viaGet !== null)
                        return viaGet;
                }
            }
            catch (e) { /* 落到下面那条路 */ }
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
            activeLocaleService = service;
            if (service === null)
                return () => { };
            const apply = () => {
                try {
                    if (typeof service.getSnapshot === "function") {
                        UI_LANG = localeToLang(service.getSnapshot().active);
                    }
                }
                catch (e) {
                    UI_LANG = "zh";
                }
                if (typeof relocalize === "function") {
                    try {
                        relocalize();
                    }
                    catch (e) { /* 重绘失败不该断订阅链 */ }
                }
            };
            apply();
            try {
                if (typeof service.subscribe !== "function")
                    return () => { };
                const off = service.subscribe(apply);
                return typeof off === "function" ? off : () => { };
            }
            catch (e) {
                return () => { };
            }
        }
        /** 文案：{name} 形式的占位符按 params 替换，缺参时保留原样（宁可露出花括号也不吞字）。 */
        function t(key, params) {
            const dict = UI[UI_LANG] || UI.zh;
            let text = dict[key];
            if (text === undefined)
                text = (UI.zh[key] !== undefined ? UI.zh[key] : key);
            if (params === undefined)
                return text;
            return text.replace(/\{(\w+)\}/g, (whole, name) => Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : whole);
        }
        /** 调插件自己的路由；错误码原样带出，方便上层区分「没配置」与「服务器拒绝」。 */
        const API_TIMEOUT_MS = 15000;
        async function api(action, payload, signal, route = ROUTE) {
            const init = { credentials: "same-origin", method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ action }, payload)) };
            // 请求必须有上限：挂起的 Promise 会让乐观覆盖一直盖着、撤销条永不出现，
            // 表现就是「界面改了、服务器没改」而用户以为成功。超时按失败处理（调用方会回滚并对账）。
            if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
                if (action === "suggest") init.signal = AbortSignal.timeout(65000);
                else if (action === "availability" || action === "discoverICloud" || action === "models") init.signal = AbortSignal.timeout(25000);
                else init.signal = AbortSignal.timeout(API_TIMEOUT_MS);
            }
            if (signal) init.signal = init.signal && typeof AbortSignal.any === 'function' ? AbortSignal.any([init.signal, signal]) : signal;
            const res = await fetch(route, init);
            let body = null;
            try {
                body = await res.json();
            }
            catch (e) {
                body = null;
            }
            if (!res.ok || !body || body.ok !== true) {
                const message = body?.error?.message || body?.message || ("HTTP " + res.status);
                const error = new Error(message);
                error.status = res.status;
                error.code = body && body.error ? body.error.code : undefined;
                error.message = backendMessage(error);
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
            if (UI_LANG === "en")
                return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
            return date.getFullYear() + " 年 " + (date.getMonth() + 1) + " 月 " + date.getDate() + " 日" + (withYear ? "" : "");
        }
        function formatMonthTitle(date) { return UI_LANG === "en" ? date.toLocaleDateString("en-GB", { year: "numeric", month: "long" }) : date.getFullYear() + " 年 " + (date.getMonth() + 1) + " 月"; }
        function formatWeekTitle(date) {
            const from = startOfWeek(date), to = addDays(from, 6);
            if (UI_LANG === "en")
                return formatDay(from) + " – " + formatDay(to);
            return formatMonthTitle(from) + " " + from.getDate() + "–" + (to.getMonth() === from.getMonth() ? "" : (to.getMonth() + 1) + " 月 ") + to.getDate() + " 日";
        }
        function relativeDay(date) {
            const diff = daysBetween(new Date(), date);
            if (diff === 0)
                return t("day.today");
            if (diff === 1)
                return t("day.tomorrow");
            if (diff === -1)
                return t("day.yesterday");
            return UI_LANG === "en" ? date.toLocaleDateString("en-GB", { weekday: "short" }) : "周" + WEEKDAYS_ZH[isoWeekday(date) - 1];
        }
        function formatWhen(event) {
            if (event.allDay)
                return t("format.allday") + " · " + formatDay(startDate(event));
            const s = startDate(event), e = endDate(event);
            const sameDay = dayKey(s) === dayKey(e);
            return formatDay(s) + " " + hhmm(s) + "–" + (sameDay ? "" : formatDay(e) + " ") + hhmm(e);
        }
        function formatDuration(event) {
            if (event.allDay) {
                const days = Math.max(1, daysBetween(startDate(event), endDate(event)));
                return days === 1 ? t("format.allday") : days + (UI_LANG === "en" ? " days" : " 天");
            }
            const minutes = Math.max(0, Math.round((endDate(event) - startDate(event)) / 60000));
            const hours = Math.floor(minutes / 60), rest = minutes % 60;
            if (hours > 0 && rest > 0)
                return t("format.duration.hm", { h: hours, m: rest });
            if (hours > 0)
                return t("format.duration.h", { h: hours });
            if (rest > 0)
                return t("format.duration.m", { m: rest });
            return t("format.duration.zero");
        }
        /** RRULE 说人话：只翻译常见的 FREQ/INTERVAL/COUNT/UNTIL，认不出就原样返回。 */
        function humanRepeat(rrule) {
            if (!rrule)
                return "";
            const parts = {};
            String(rrule).split(";").forEach((piece) => {
                const i = piece.indexOf("=");
                if (i > 0)
                    parts[piece.slice(0, i).toUpperCase()] = piece.slice(i + 1);
            });
            const freq = parts.FREQ;
            if (UI_LANG === "en") {
                const units = { DAILY: ["Daily", "days"], WEEKLY: ["Weekly", "weeks"], MONTHLY: ["Monthly", "months"], YEARLY: ["Yearly", "years"] };
                if (!units[freq])
                    return rrule;
                const interval = Number(parts.INTERVAL || "1");
                const every = interval > 1 ? "Every " + interval + " " + units[freq][1] : units[freq][0];
                if (parts.COUNT)
                    return every + " (" + parts.COUNT + " occurrences)";
                if (parts.UNTIL) {
                    const raw = String(parts.UNTIL), date = raw.length >= 8 ? raw.slice(0, 4) + "-" + raw.slice(4, 6) + "-" + raw.slice(6, 8) : raw;
                    return every + ", until " + date;
                }
                return every;
            }
            const base = freq === "DAILY" ? "每天" : freq === "WEEKLY" ? "每周" : freq === "MONTHLY" ? "每月" : freq === "YEARLY" ? "每年" : "";
            if (base === "")
                return rrule;
            const interval = Number(parts.INTERVAL || "1");
            const every = interval > 1 ? "每 " + interval + (freq === "DAILY" ? " 天" : freq === "WEEKLY" ? " 周" : freq === "MONTHLY" ? " 个月" : " 年") : base;
            if (parts.COUNT)
                return every + "（共 " + parts.COUNT + " 次）";
            if (parts.UNTIL) {
                const raw = String(parts.UNTIL);
                const iso = raw.length >= 8 ? raw.slice(0, 4) + "-" + raw.slice(4, 6) + "-" + raw.slice(6, 8) : raw;
                return every + "，到 " + iso + " 为止";
            }
            return every;
        }
        /** 两个事件是否真的重叠（全天事件按当天整天算）。 */
        function overlaps(a, b) {
            if ([a,b].some(event=>event.status?.toUpperCase()==='CANCELLED'||event.transparency?.toUpperCase()==='TRANSPARENT')) return false;
            const as = startDate(a).getTime(), ae = endDate(a).getTime() || as;
            const bs = startDate(b).getTime(), be = endDate(b).getTime() || bs;
            return as < be && bs < ae;
        }
        /** 月视图的 6×7 网格起点：所在周的周一，往前补到整周。 */
        function monthGridDays(anchor) {
            const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
            const start = startOfWeek(first);
            const days = [];
            for (let i = 0; i < 42; i++)
                days.push(addDays(start, i));
            return days;
        }
        /** 一个事件落在哪几天（跨天事件在月视图里逐天显示）。 */
        function daysOfEvent(event) {
            const days = [];
            if (event.allDay) {
                const from = startDate(event);
                // 全天事件的 DTEND 是「次日零点」（iCal 语义），显示上要退一天。
                const to = addDays(endDate(event), -1);
                for (let d = startOfDay(from); d <= to; d = addDays(d, 1))
                    days.push(d);
                return days.length > 0 ? days : [from];
            }
            const from = startOfDay(startDate(event)), to = startOfDay(endDate(event));
            for (let d = from; d <= to; d = addDays(d, 1))
                days.push(d);
            return days;
        }
        /** 事件排序：全天在前，然后按开始时间。 */
        function sortForDisplay(events) {
            return events.slice().sort((a, b) => {
                if (a.allDay !== b.allDay)
                    return a.allDay ? -1 : 1;
                return startDate(a) - startDate(b);
            });
        }
        // ───────────────────────────── 宿主 UI 组件（可选） ─────────────────────────────
        /** 复制 uid：优先官方 writeClipboard（它处理了非 https 的降级），否则走 navigator。 */
        async function copyText(text) {
            try {
                if (PRIM && typeof PRIM.writeClipboard === "function") {
                    await PRIM.writeClipboard(text);
                    return true;
                }
            }
            catch (e) { /* 落到下面 */ }
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text);
                    return true;
                }
            }
            catch (e) { /* 忽略 */ }
            return false;
        }
        // ───────────────────────────── 拖拽/键盘改期的几何 ─────────────────────────────
        // 这一组是本轮唯一的「算法」：拖动、缩放手柄、键盘微调都走它们。它们不碰 DOM、不认 React，
        // 所以跨天/跨月/DST/吸附边界这些真正容易错的地方能被单测直接盯住（见 test/schedule.test.mjs）。
        /** 全天事件与定时事件共用一个「槽位」概念：某天 + 当天第几分钟 + 时长。 */
        const SNAP_MINUTES = 15;
        const RESIZE_MIN_MINUTES = 15;
        function snapMinutes(value, step) {
            const unit = typeof step === "number" && step > 0 ? step : SNAP_MINUTES;
            return Math.round(value / unit) * unit;
        }
        /** 事件 → 槽位（按浏览器本地墙钟，显示与拖拽都以用户看到的为准）。 */
        function slotFromEvent(event) {
            const start = startDate(event);
            const end = endDate(event);
            const minutes = start.getHours() * 60 + start.getMinutes();
            const durationMinutes = Math.max(RESIZE_MIN_MINUTES, Math.round((end - start) / 60000));
            return { dayKey: dayKey(start), minutes, durationMinutes, allDay: event.allDay === true };
        }
        /**
         * 槽位 + 位移 → 新槽位。
         * 位移以「天 + 分钟」给（拖动时由像素换算），跨天/跨月/跨年都靠时间戳自然进位，
         * 最后把开始时间吸附到 15 分钟并钳在当天 00:00 与「当天结束前还放得下整个时长」之间。
         */
        function moveSlot(slot, deltaDays, deltaMinutes, step) {
            // 分钟先合成「当天内 + 跨几天」，再用日历日相加 —— 不能用「天 × 1440 毫秒」当瞬时位移：
            // DST 切换日一天是 23 或 25 小时，按毫秒加会整体偏一小时（评审查出来的，中国时区看不见）。
            const total = slot.minutes + (deltaMinutes || 0);
            const dayShift = Math.floor(total / 1440);
            const minutes = total - dayShift * 1440;
            const base = new Date(slot.dayKey + "T00:00:00");
            const target = addDays(base, (deltaDays || 0) + dayShift);
            const unit = typeof step === "number" && step > 0 ? step : SNAP_MINUTES;
            // 日末钳制也要落在网格上：1440 − 时长不保证是 15 的倍数（50 分钟 → 23:10 这种脏值）。
            const latestStart = Math.max(0, Math.floor((24 * 60 - slot.durationMinutes) / unit) * unit);
            const snapped = Math.max(0, Math.min(snapMinutes(minutes, unit), latestStart));
            return { dayKey: dayKey(target), minutes: snapped, durationMinutes: slot.durationMinutes, allDay: slot.allDay };
        }
        /** 拖拽像素位移 → 槽位位移（横向一格 = 一天，纵向按小时像素换算成分钟）。 */
        function slotFromDrag(slot, drag, step) {
            const hourPx = typeof drag.hourPx === "number" && drag.hourPx > 0 ? drag.hourPx : 44;
            const columns = Math.round(drag.columns || 0);
            const unit = typeof step === "number" && step > 0 ? step : SNAP_MINUTES;
            const rawMinutes = ((drag.pixelsY || 0) / hourPx) * 60;
            const deltaMinutes = Math.round(rawMinutes / unit) * unit;
            return moveSlot(slot, columns, deltaMinutes, unit);
        }
        /** 缩放手柄：只改时长，不改开始时间（最短 15 分钟，最长到当天结束）。 */
        function resizeSlot(slot, deltaMinutes, step) {
            const unit = typeof step === "number" && step > 0 ? step : SNAP_MINUTES;
            // 只吸附**位移量**：50 分钟的日程碰一下手柄（位移 0）不该被吸成 45。
            // 上限就是 24 小时 —— 允许拖过午夜（此前按「当天还剩多少」压缩，23:30–00:30 一碰就变 30 分钟）。
            const next = slot.durationMinutes + snapMinutes(deltaMinutes || 0, unit);
            return { dayKey: slot.dayKey, minutes: slot.minutes, durationMinutes: Math.max(RESIZE_MIN_MINUTES, Math.min(next, 24 * 60)), allDay: slot.allDay };
        }
        /** 槽位 → 提交给服务器的 start/end（本地墙钟换算成 UTC 秒级 ISO）。 */
        function rangeOfSlot(slot) {
            const start = new Date(slot.dayKey + "T00:00:00");
            start.setMinutes(slot.minutes);
            const end = new Date(start.getTime() + slot.durationMinutes * 60000);
            return { start: isoOf(start), end: isoOf(end) };
        }
        /** 落点与哪些已有日程重叠（拖动中用来把幽灵块描成黄色）。 */
        function conflictsForSlot(events, slot, uid) {
            const range = rangeOfSlot(slot);
            const pseudo = { uid: "__drag", summary: "", start: range.start, end: range.end, allDay: slot.allDay === true };
            return events.filter((event) => event.uid !== uid && overlaps(event, pseudo));
        }
        /**
         * 指针 x（视口坐标）→ 列号。坐标必须来自 getBoundingClientRect ——
         * offsetLeft 是相对 offsetParent 的，浮层面板里与 clientX 不是一个坐标系（评审抓到的坑）。
         * 找不到列就返回 undefined，调用方按「不换天」处理。
         */
        function columnIndexFromRects(clientX, rects) {
            for (const rect of rects) {
                if (clientX >= rect.left && clientX < rect.left + rect.width)
                    return rect.index;
            }
            return undefined;
        }
        /** 重复日程（系列本身 or 某次实例）：CalDAV 里整个系列是一个对象，拖动会改整条。 */
        function isRecurring(event) {
            return event.rrule !== undefined || event.isOccurrence === true || event.seriesStart !== undefined;
        }
        // ───────────────────────────── 小部件 ─────────────────────────────
        /** 事件属于哪一类：影响左侧色条（全天绿 / 重复黄 / 普通蓝）。 */
        function eventClass(event) {
            return event.allDay ? styles.allday : isRecurring(event) ? styles.recurring : undefined;
        }
        function eventKey(event) {
            return event.uid + "@" + event.start;
        }
        function Chip(props) {
            const { event, onClick, conflicted } = props;
            return h("button", {
                type: "button",
                className: clsx(styles["dshc-chip"], eventClass(event), conflicted && styles.conflicted),
                title: event.summary,
                onClick: (e) => { e.stopPropagation(); onClick(event); }
            },
                event.allDay ? null : h("span", { className: "t" }, hhmm(startDate(event))),
                h("span", null, event.summary)
            );
        }
        /** 议程里的一行：时间列 + 标题/地点 + 重复角标。 */
        function Row(props) {
            const { event, onClick, conflicted } = props;
            const meta = [];
            if (event.location)
                meta.push(event.location);
            if (event.rrule)
                meta.push(humanRepeat(event.rrule));
            else if (event.isOccurrence)
                meta.push(t("repeat.occurrence"));
            return h("div", {
                className: clsx(styles["dshc-row"], conflicted && styles.conflicted),
                "data-dsh-row": "",
                "data-active": "false"
            },
                h("button", { type: "button", className: styles.rowTrigger, onClick: () => onClick(event) },
                    h("span", { className: "dsh-pixel-cursor", "aria-hidden": "true" }, "▶"),
                    h("span", { className: styles["dshc-time"] }, event.allDay ? t("format.allday") : (hhmm(startDate(event)) + "–" + hhmm(endDate(event)))),
                    h("span", { className: styles["dshc-main"] },
                        h("span", { className: styles["dshc-name"] }, event.summary),
                        meta.length > 0 ? h("span", { className: styles["dshc-meta"] }, meta.join(" · ")) : null
                    )
                ),
                h("div", { className: clsx("dsh-row-actions", styles.rowActions) },
                    h(IconButton, { icon: "edit", label: calendarText("查看或编辑日程", "Inspect or edit event"), onClick: () => onClick(event) })
                )
            );
        }
        /** 月视图：6×7 网格；每格最多 3 条，多的收成「+N」。 */
        function MonthView(props) {
            const { anchor, events, onPick, onCreateAt, conflicted } = props;
            const days = monthGridDays(anchor);
            const today = dayKey(new Date());
            const byDay = {};
            for (const event of events) {
                for (const day of daysOfEvent(event)) {
                    const key = dayKey(day);
                    if (!byDay[key])
                        byDay[key] = [];
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
                    className: clsx(styles["dshc-cell"], day.getMonth() !== anchor.getMonth() && styles.out, key === today && "today"),
                    // 读屏只会念出格子里的日期数字，不说这一格是干什么的；补上「哪天 + 新建」的完整名字。
                    "aria-label": formatDay(day, { withYear: true }) + " · " + t("action.new"),
                    "aria-current": key === today ? "date" : undefined,
                    onClick: () => onCreateAt(day),
                    onKeyDown: (e) => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onCreateAt(day);
                    } },
                    title: t("action.new")
                },
                    h("div", { className: styles["dshc-daynum"] }, h("b", null, day.getDate())),
                    shown.map((event) => h(Chip, { key: eventKey(event), event, onClick: onPick, conflicted: conflicted?.has(event) })),
                    rest > 0 ? h("div", { className: styles["dshc-more"] }, "+" + rest) : null
                ));
            }
            return h("div", null,
                h("div", { className: styles["dshc-grid"] }, WEEKDAYS_ZH.map((d, i) => h("div", { className: styles["dshc-dow"], key: d }, weekDayLabel(i)))),
                h("div", { className: styles["dshc-grid"] }, cells)
            );
        }
        /**
         * 周视图：7 列 × 24 小时网格。除了画日程，它还负责改期：
         *   · 拖动事件块：上下改时间、左右换天（15 分钟吸附）；
         *   · 拖块底部 6px 的缩放手柄：只改时长；
         *   · 拖动中画幽灵落点，与已有日程重叠时描成黄色（允许重叠，只是提醒）；
         *   · 拖到容器上下边缘自动滚动，长会议不用先滚再拖；
         *   · 键盘：Tab 聚焦后 ↑/↓ 挪 15 分钟、Shift+↑/↓ 挪 1 小时、←/→ 挪一天、Enter 打开详情、拖动中 Esc 取消。
         * 几何计算全在纯函数里（slotFromDrag / resizeSlot / moveSlot / columnIndexFromRects），这里只做指针与 DOM 的事。
         *
         * 两个坑写在这里免得后人再踩：
         *   1. 列判定必须用 getBoundingClientRect：offsetLeft 是相对 offsetParent 的，浮层面板里与 clientX 不同坐标系；
         *   2. window 监听器只在挂载时注册一次，通过 impl ref 调用「最新实现」；
         *      按渲染闭包挂/摘会出现「摘不掉 → 卸载后 pointerup 替用户提交一次改期」。
         */
        function WeekView(props) {
            const { anchor, events, onPick, onCreateAt, onReschedule, conflicted } = props;
            /** 示例模式下没有 onReschedule：不做改期，也不显示拖拽提示。 */
            const canEdit = typeof onReschedule === "function";
            const HOUR_PX = 44;
            const start = startOfWeek(anchor);
            const days = [];
            for (let i = 0; i < 7; i++)
                days.push(addDays(start, i));
            const today = dayKey(new Date());
            const allDay = sortForDisplay(events.filter((e) => e.allDay));
            const timed = events.filter((e) => !e.allDay);
            // 默认落在 07:00：半夜那几格基本没人看，但需要时还能往上滚（不裁剪任何事件）。
            const scroller = useRef(null);
            useEffect(() => {
                const node = scroller.current;
                if (node === null || node === undefined)
                    return;
                node.scrollTop = 7 * HOUR_PX;
            }, [dayKey(anchor)]);
            /** 拖拽位置放 ref：每帧 setState 会让整棵树重渲染，拖动会顿。 */
            const dragRef = useRef(null);
            const suppressClick = useRef(false);
            const [ghost, setGhost] = useState(null);
            /** 每列的**视口**矩形（见文件头注释第 1 条）。 */
            const columnRects = () => {
                const node = scroller.current;
                if (node === null || node === undefined)
                    return [];
                return days.map((day, index) => {
                    const column = node.querySelector('[data-day="' + dayKey(day) + '"]');
                    if (column === null)
                        return { dayKey: dayKey(day), index, left: 0, width: 0 };
                    const rect = column.getBoundingClientRect();
                    return { dayKey: dayKey(day), index, left: rect.left, width: rect.width };
                });
            };
            const scrollTopNow = () => {
                const node = scroller.current;
                return node === null || node === undefined ? 0 : node.scrollTop;
            };
            const isOwnPointer = (pointerEvent) => {
                const drag = dragRef.current;
                if (drag === null)
                    return false;
                return pointerEvent.pointerId === undefined || drag.pointerId === undefined || pointerEvent.pointerId === drag.pointerId;
            };
            const stopDrag = (commit) => {
                stopAutoScroll();
                const drag = dragRef.current;
                dragRef.current = null;
                setGhost(null);
                if (drag === null)
                    return;
                const moved = drag.moved === true;
                if (moved === true) {
                    // 拖动之后浏览器通常会补一个 click，用它把「抑制」消费掉；
                    // 但如果松手在空白处（没有 click），下个事件循环必须清掉 —— 否则会吞掉将来某次正常点击。
                    suppressClick.current = true;
                    setTimeout(() => { suppressClick.current = false; }, 0);
                }
                if (commit !== false && moved === true && canEdit === true) {
                    const slot = drag.previewSlot === undefined ? drag.slot : drag.previewSlot;
                    // 没有落点就不提交：比如纵向拖出本周（跨到下周）时幽灵没地方画，这时盲提交会让事件从视图消失。
                    // 用 dragRef 上的同步标记，而不是 React state（见 applyPreviewAt 的注释）。
                    if (drag.previewVisible === true)
                        onReschedule(drag.event, rangeOfSlot(slot), drag.mode);
                }
            };
            /** 由指针位置算落点、画幽灵（只管几何，不碰边缘滚动的调度）。 */
            const applyPreviewAt = (clientX, clientY, drag) => {
                // 容器自己滚动过的话，指针下方的**内容**坐标变了：不补这一项，幽灵块会落后于指针，
                // 松手落点也跟着偏（误差 = 滚动量，可达数小时）。
                const scrolled = scrollTopNow() - drag.startScrollTop;
                const dx = clientX - drag.startX;
                const dy = clientY - drag.startY + scrolled;
                if (drag.moved !== true && Math.abs(dx) < 5 && Math.abs(dy) < 5)
                    return;
                drag.moved = true;
                const ownIndex = drag.columns.findIndex((column) => column.dayKey === drag.slot.dayKey);
                const targetIndex = columnIndexFromRects(clientX, drag.columns);
                // 横向只允许在本周 7 天内换天：跨到下周会让幽灵无处渲染、事件从当前视图消失。
                const rawColumns = targetIndex === undefined || ownIndex === -1 ? 0 : targetIndex - ownIndex;
                const columns = ownIndex === -1 ? 0 : Math.max(-ownIndex, Math.min(6 - ownIndex, rawColumns));
                const slot = drag.mode === "resize"
                    ? resizeSlot(drag.slot, (dy / HOUR_PX) * 60, SNAP_MINUTES)
                    : slotFromDrag(drag.slot, { columns, pixelsY: dy, hourPx: HOUR_PX }, SNAP_MINUTES);
                drag.previewSlot = slot;
                // 可见性判断必须同步落在 dragRef 上：pointermove 与 pointerup 可能在同一批次里，
                // 此时读 React state（ghost）拿到的是旧值，会导致「拖了却不提交」。
                drag.previewVisible = days.some((day) => dayKey(day) === slot.dayKey);
                setGhost({ uid: drag.uid, slot, conflicts: conflictsForSlot(events, slot, drag.uid).length });
            };
            /**
             * 边缘自动滚动：用 rAF 持续滚，而不是「每次 pointermove 滚一小步」。
             * 前者指针停在边缘不动也会继续滚（这才是「长会议不用先滚再拖」），
             * 后者只在指针移动时滚，用户会觉得网格在滚、事件却不跟手。
             */
            const autoScroll = useRef({ raf: 0, x: 0, y: 0 });
            const stopAutoScroll = () => {
                if (autoScroll.current.raf !== 0) {
                    window.cancelAnimationFrame(autoScroll.current.raf);
                    autoScroll.current.raf = 0;
                }
            };
            const stepAutoScroll = () => {
                autoScroll.current.raf = 0;
                const drag = dragRef.current;
                const node = scroller.current;
                if (drag === null || node === null || node === undefined)
                    return;
                const rect = node.getBoundingClientRect();
                const y = autoScroll.current.y;
                let delta = 0;
                if (y < rect.top + 40)
                    delta = -Math.min(24, (rect.top + 40 - y) / 3);
                else if (y > rect.bottom - 40)
                    delta = Math.min(24, (y - (rect.bottom - 40)) / 3);
                if (delta === 0)
                    return; // 指针离开边缘：循环自然停下，下次移动会再起
                node.scrollTop += delta;
                applyPreviewAt(autoScroll.current.x, y, drag); // 滚动后重算落点（含滚动补偿）
                autoScroll.current.raf = window.requestAnimationFrame(stepAutoScroll);
            };
            const ensureAutoScroll = (pointerEvent) => {
                autoScroll.current.x = pointerEvent.clientX;
                autoScroll.current.y = pointerEvent.clientY;
                const node = scroller.current;
                if (node === null || node === undefined)
                    return;
                const rect = node.getBoundingClientRect();
                const nearEdge = pointerEvent.clientY < rect.top + 40 || pointerEvent.clientY > rect.bottom - 40;
                if (nearEdge === true && autoScroll.current.raf === 0)
                    autoScroll.current.raf = window.requestAnimationFrame(stepAutoScroll);
            };
            const updatePreview = (pointerEvent) => {
                const drag = dragRef.current;
                if (drag === null)
                    return;
                // 鼠标在窗口外松开时浏览器可能不派发 pointerup：按键已经松了就当作取消，
                // 免得「卡住的拖拽」在回到窗口后被下一次移动继续更新、下一次松开就替用户提交。
                if (drag.moved === true && pointerEvent.buttons === 0) {
                    stopDrag(false);
                    return;
                }
                applyPreviewAt(pointerEvent.clientX, pointerEvent.clientY, drag);
                ensureAutoScroll(pointerEvent);
            };
            /**
             * window 监听器只在挂载时注册一次，通过 impl ref 调「最新实现」。
             * 这样既不会因为渲染闭包更换而摘不掉（那会导致卸载后 pointerup 真的发一次 update），
             * 也不会读到过期的 state。
             */
            const impl = useRef({});
            impl.current = { stopDrag, updatePreview, isOwnPointer };
            useEffect(() => {
                const onMove = (pointerEvent) => { if (dragRef.current !== null && impl.current.isOwnPointer(pointerEvent) === true)
                    impl.current.updatePreview(pointerEvent); };
                const onUp = (pointerEvent) => { if (dragRef.current !== null && impl.current.isOwnPointer(pointerEvent) === true)
                    impl.current.stopDrag(true); };
                const onCancel = () => { if (dragRef.current !== null)
                    impl.current.stopDrag(false); };
                const onKey = (keyEvent) => { if (keyEvent.key === "Escape" && dragRef.current !== null) {
                    keyEvent.preventDefault();
                    keyEvent.stopPropagation();
                    impl.current.stopDrag(false);
                } };
                const onBlur = () => { if (dragRef.current !== null)
                    impl.current.stopDrag(false); };
                window.addEventListener("pointermove", onMove);
                window.addEventListener("pointerup", onUp);
                window.addEventListener("pointercancel", onCancel);
                // 捕获阶段：保证「取消拖动」先于浮层面板的 document Esc（否则会顺手把面板也关了）。
                window.addEventListener("keydown", onKey, true);
                window.addEventListener("blur", onBlur);
                return () => {
                    window.removeEventListener("pointermove", onMove);
                    window.removeEventListener("pointerup", onUp);
                    window.removeEventListener("pointercancel", onCancel);
                    window.removeEventListener("keydown", onKey, true);
                    if (autoScroll.current.raf !== 0) {
                        window.cancelAnimationFrame(autoScroll.current.raf);
                        autoScroll.current.raf = 0;
                    }
                    window.removeEventListener("blur", onBlur);
                    dragRef.current = null; // 卸载时不能留着半截拖拽状态
                };
            }, []);
            const beginDrag = (event, pointerEvent, mode) => {
                if (canEdit !== true)
                    return; // 示例模式：不落盘就不给拖
                if (pointerEvent.button !== undefined && pointerEvent.button !== 0)
                    return;
                if (dragRef.current !== null)
                    return; // 已经有一根指针在拖，忽略第二根
                suppressClick.current = false;
                try {
                    if (typeof pointerEvent.currentTarget.setPointerCapture === "function")
                        pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId);
                }
                catch (error) { /* 不支持就算了，window 监听器兜底 */ }
                dragRef.current = {
                    uid: event.uid,
                    event,
                    pointerId: pointerEvent.pointerId,
                    mode: mode === "resize" ? "resize" : "move",
                    slot: slotFromEvent(event),
                    startX: pointerEvent.clientX,
                    startY: pointerEvent.clientY,
                    startScrollTop: scrollTopNow(),
                    moved: false,
                    columns: columnRects(),
                };
            };
            /** 键盘改期：与拖拽走同一套纯函数，所以行为一致（且不用鼠标也能用）。 */
            const onKeyDown = (event, keyEvent) => {
                if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                    keyEvent.preventDefault();
                    onPick(event);
                    return;
                }
                if (canEdit !== true)
                    return;
                const slot = slotFromEvent(event);
                let deltaDays = 0;
                let deltaMinutes = 0;
                if (keyEvent.key === "ArrowUp")
                    deltaMinutes = keyEvent.shiftKey ? -60 : -SNAP_MINUTES;
                else if (keyEvent.key === "ArrowDown")
                    deltaMinutes = keyEvent.shiftKey ? 60 : SNAP_MINUTES;
                else if (keyEvent.key === "ArrowLeft")
                    deltaDays = -1;
                else if (keyEvent.key === "ArrowRight")
                    deltaDays = 1;
                else
                    return;
                keyEvent.preventDefault();
                onReschedule(event, rangeOfSlot(moveSlot(slot, deltaDays, deltaMinutes, SNAP_MINUTES)), "move");
            };
            const hoursColumn = h("div", { key: "__hours" }, [h("div", { className: styles["dshc-dayhead"], key: "h" }, "\u00a0")].concat(Array.from({ length: 24 }, (_, hour) => h("div", { className: styles["dshc-hour"], key: "h" + hour }, hour === 0 ? "" : pad2(hour) + ":00"))));
            const dayColumns = days.map((day) => {
                const key = dayKey(day);
                const dayTimed = timed.filter((event) => daysOfEvent(event).some((d) => dayKey(d) === key));
                const laneEnds = [];
                const placed = dayTimed.slice().sort((a, b) => startDate(a) - startDate(b)).map((event) => {
                    const from = startDate(event), to = endDate(event);
                    let lane = laneEnds.findIndex((endMs) => endMs <= from.getTime());
                    if (lane === -1) {
                        lane = laneEnds.length;
                        laneEnds.push(0);
                    }
                    laneEnds[lane] = to.getTime();
                    return { event, lane };
                });
                const laneCount = Math.max(1, laneEnds.length);
                const laneStyle = (lane) => ({ left: "calc(" + (lane * (100 / laneCount)) + "% + 2px)", width: "calc(" + (100 / laneCount) + "% - 4px)" });
                const blocks = placed.map(({ event, lane }) => {
                    const from = startDate(event), to = endDate(event);
                    const top = (from.getHours() * 60 + from.getMinutes()) * (HOUR_PX / 60);
                    const height = Math.max(18, ((to - from) / 60000) * (HOUR_PX / 60));
                    const dragging = ghost !== null && ghost.uid === event.uid;
                    return h("div", {
                        key: eventKey(event),
                        role: "button",
                        tabIndex: 0,
                        "data-uid": event.uid,
                        className: clsx(styles["dshc-slot"], eventClass(event), canEdit && styles.movable, dragging && styles.dragging, conflicted?.has(event) && styles.conflicted),
                        style: Object.assign({ top: top + "px", height: height + "px" }, laneStyle(lane)),
                        title: event.summary + " " + hhmm(from) + "\u2013" + hhmm(to) + (canEdit === true ? " · " + t("drag.moveTitle") : ""),
                        onPointerDown: (e) => beginDrag(event, e, "move"),
                        onKeyDown: (e) => onKeyDown(event, e),
                        onClick: (clickEvent) => {
                            // slot 是 daycol 的子节点：不挡住冒泡的话，点事件会同时触发 daycol 的「新建」。
                            clickEvent.stopPropagation();
                            if (suppressClick.current === true) {
                                suppressClick.current = false;
                                return;
                            }
                            onPick(event);
                        }
                    }, h("div", { className: styles["dshc-slot-title"] }, event.summary), h("div", { className: styles["dshc-slot-time"] }, hhmm(from) + "\u2013" + hhmm(to)), canEdit === true ? h("div", { className: styles["dshc-resize"], title: t("drag.resizeTitle"), onPointerDown: (e) => { e.stopPropagation(); beginDrag(event, e, "resize"); } }) : null);
                });
                const ghostBlock = ghost !== null && ghost.slot.dayKey === key
                    ? h("div", {
                        className: clsx(styles["dshc-slot"], styles["dshc-ghost"], ghost.conflicts > 0 && styles.warn),
                        style: Object.assign({ top: (ghost.slot.minutes * (HOUR_PX / 60)) + "px", height: Math.max(18, ghost.slot.durationMinutes * (HOUR_PX / 60)) + "px" }, laneStyle(0)),
                        key: "__ghost"
                    }, h("div", { className: styles["dshc-slot-title"] }, ghost.conflicts > 0 ? t("drag.conflict", { n: ghost.conflicts }) + " · " + t("drag.keep") : t("drag.drop")), h("div", { className: styles["dshc-slot-time"] }, pad2(Math.floor(ghost.slot.minutes / 60)) + ":" + pad2(ghost.slot.minutes % 60) + " \u2192 " + pad2(Math.floor((ghost.slot.minutes + ghost.slot.durationMinutes) / 60)) + ":" + pad2((ghost.slot.minutes + ghost.slot.durationMinutes) % 60)))
                    : null;
                const hourSlots = Array.from({ length: 24 }, (_, hour) => h("button", {
                    key: hour, type: "button", className: styles.hourSlot, "data-hour": hour,
                    "aria-label": formatDay(day, { withYear: true }) + " " + pad2(hour) + ":00 · " + t("action.new"),
                    tabIndex: hour === 7 ? 0 : -1,
                    onClick: () => {
                        if (suppressClick.current) { suppressClick.current = false; return; }
                        onCreateAt(day, hour);
                    },
                    onKeyDown: event => {
                        const change = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
                        if (change === 0) return;
                        event.preventDefault();
                        event.currentTarget.parentElement.querySelector('[data-hour="' + (hour + change) + '"]')?.focus();
                    }
                }));
                return h("div", { key },
                    h("div", { className: clsx(styles["dshc-dayhead"], key === today && "today"), "aria-current": key === today ? "date" : undefined },
                        weekDayLabel(isoWeekday(day) - 1), h("b", null, day.getDate())
                    ),
                    h("div", {
                        className: clsx(styles["dshc-daycol"], key === today && "today"), "data-day": key,
                        onClick: clickEvent => {
                            if (clickEvent.target !== clickEvent.currentTarget)
                                return;
                            if (suppressClick.current) { suppressClick.current = false; return; }
                            onCreateAt(day);
                        }
                    }, hourSlots, blocks, ghostBlock)
                );
            });
            return h("div", { className: styles.weekView }, allDay.length > 0
                ? h("div", { className: styles.allDayList }, allDay.map((event) => h(Row, { key: eventKey(event), event, onClick: onPick, conflicted: conflicted?.has(event) })))
                : null, h("div", { className: "dshc-week", ref: scroller }, hoursColumn, dayColumns), canEdit === true ? h("div", { className: styles["dshc-draghint"] }, t("drag.hint")) : null);
        }
        /** 议程视图：从今天起按天分组，最像「接下来要干什么」。 */
        function AgendaView(props) {
            const { events, onPick, onCreateAt, conflicted } = props;
            const groups = [];
            const index = {};
            for (const event of sortForDisplay(events)) {
                const day = startOfDay(startDate(event));
                const key = dayKey(day);
                if (index[key] === undefined) {
                    index[key] = groups.length;
                    groups.push({ day, key, items: [] });
                }
                groups[index[key]].items.push(event);
            }
            if (groups.length === 0)
                return h(EmptyState, { title: t("state.empty"), action: h(Btn, { icon: "plus", variant: "primary", onClick: () => onCreateAt(new Date()) }, t("action.new")) });
            return h("div", { className: styles["dshc-agenda"] }, groups.map((group) => h("div", { className: styles["dshc-daygroup"], key: group.key },
                h("div", { className: styles["dshc-daylabel"] },
                    h("b", { "data-dsh-serif": "" }, formatDay(group.day)),
                    h("span", { className: styles["dshc-sub"] }, relativeDay(group.day)),
                    h("span", { className: styles["dshc-spacer"] }),
                    h(Btn, { variant: "ghost", onClick: () => onCreateAt(group.day) }, t("action.new"))
                ),
                group.items.map((event) => h(Row, { key: eventKey(event), event, onClick: onPick, conflicted: conflicted?.has(event) }))
            )));
        }
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
                { uid: "demo://allday", summary: "📦 项目上线日", start: dateOnly(0), end: dateOnly(1), allDay: true, description: "确认发布说明并完成上线检查", location: "线上", isOccurrence: false },
                { uid: "demo://review", summary: "产品评审会", start: at(0, 10, 0), end: at(0, 11, 0), allDay: false, location: "会议室 A", description: "议程：体验反馈与本周计划", isOccurrence: false },
                { uid: "demo://one-on-one", summary: "1:1 同步", start: at(0, 15, 0), end: at(0, 15, 30), allDay: false, location: "线上", isOccurrence: false },
                { uid: "demo://standup", summary: "每周站会", start: at(1, 9, 30), end: at(1, 9, 50), allDay: false, rrule: "FREQ=WEEKLY;COUNT=6", location: "线上", isOccurrence: false },
                { uid: "demo://standup@2", summary: "每周站会", start: at(8, 9, 30), end: at(8, 9, 50), allDay: false, location: "线上", isOccurrence: true, seriesStart: at(1, 9, 30) },
                { uid: "demo://sync", summary: "与同事同步", start: at(2, 16, 0), end: at(2, 16, 30), allDay: false, location: "线上", description: "同步进度与下一步安排", isOccurrence: false }
            ];
        }
        /** 拉一个时间窗的事件；demo 为真时用示例数据，不打网络。 */
        function useCalendarData(range, reloadToken, demo, configured) {
            const [state, setState] = useState({ loading: true, error: null, events: [], configured: true });
            useEffect(() => {
                if (demo === true) {
                    setState({ loading: false, error: null, events: demoEvents(), configured: true });
                    return () => { };
                }
                if (configured !== true) {
                    setState({ loading: configured === null, error: null, events: [], configured: false });
                    return () => { };
                }
                let alive = true;
                setState((prev) => ({ loading: true, error: null, events: prev.events, configured: prev.configured }));
                api("list", { start: range.start, end: range.end, expand: true, maxOccurrences: 300 })
                    .then((value) => { if (alive)
                    setState({ loading: false, error: null, events: (value && value.events) || [], configured: true }); })
                    .catch((error) => { if (alive)
                    setState({ loading: false, error, events: [], configured: error && error.code !== "not-configured" }); });
                return () => { alive = false; };
            }, [range.start, range.end, reloadToken, demo, configured]);
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
            const draft = {
                uid: event.uid,
                isSeries: isRecurring(event),
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
            if (!allDay) draft.sourceRange = { date: draft.date, startTime: draft.startTime, endTime: draft.endTime, start: isoOf(s), end: isoOf(rawEnd) };
            return draft;
        }
        /** 新建表单：默认落在被点的那一天，上午 10:00–11:00（日历产品的惯例）。 */
        function draftAt(date, hour) {
            const d = date || new Date();
            if (typeof hour === "number") {
                const start = startOfDay(d);
                start.setHours(hour);
                return draftOfEvent({ start: isoOf(start), end: isoOf(new Date(+start + 3600000)), allDay: false });
            }
            return {
                uid: undefined,
                summary: "",
                date: dayKey(d),
                startTime: "10:00",
                endTime: "11:00",
                allDay: false,
                location: "",
                description: "",
                repeat: "",
                rrule: ""
            };
        }
        function repeatKeyOf(rrule) {
            if (!rrule)
                return "";
            const freq = /FREQ=([A-Z]+)/i.exec(rrule);
            if (!freq)
                return "custom";
            const value = freq[1].toUpperCase();
            const simple = rrule.replace(/FREQ=[A-Z]+;?/i, "").replace(/^;|;$/g, "");
            if (simple !== "")
                return "custom";
            if (value === "DAILY")
                return "daily";
            if (value === "WEEKLY")
                return "weekly";
            if (value === "MONTHLY")
                return "monthly";
            if (value === "YEARLY")
                return "yearly";
            return "custom";
        }
        function rruleForRepeat(repeat) {
            if (repeat === "daily")
                return "FREQ=DAILY";
            if (repeat === "weekly")
                return "FREQ=WEEKLY";
            if (repeat === "monthly")
                return "FREQ=MONTHLY";
            if (repeat === "yearly")
                return "FREQ=YEARLY";
            return "";
        }
        /** 草稿 → 后端字段（全天走 DATE，定时走本地时间换算出的 UTC 秒级 ISO）。 */
        function fieldsOfDraft(draft) {
            const fields = { summary: draft.summary.trim(), location: draft.location.trim(), description: draft.description.trim(), ...(draft.isSeries ? { scope: "series" } : {}) };
            if (draft.allDay === true) {
                fields.start = draft.date;
                fields.end = dayKey(addDays(new Date(draft.date + "T00:00:00"), 1));
                fields.allDay = true;
            }
            else {
                if (!/^\d{2}:\d{2}$/.test(draft.startTime || '') || !/^\d{2}:\d{2}$/.test(draft.endTime || '')) throw new Error(calendarText('请补全起止时间','Complete the start and end times'));
                const start = new Date(draft.date + "T" + (draft.startTime || "00:00") + ":00");
                const end = new Date(draft.date + "T" + (draft.endTime || "00:00") + ":00");
                const source = draft.sourceRange, sameDate = source && source.date === draft.date;
                fields.start = sameDate && source.startTime === draft.startTime ? source.start : isoOf(start);
                fields.end = sameDate && source.endTime === draft.endTime ? source.end : isoOf(end);
                fields.allDay = false;
            }
            const rrule = draft.repeat === "custom" ? (draft.rrule || "").trim() : rruleForRepeat(draft.repeat);
            if (rrule !== "")
                fields.rrule = rrule;
            else if (draft.uid !== undefined)
                fields.rrule = "";
            return fields;
        }
        /** 草稿算出来的临时事件，用来做冲突检测（不落盘）。 */
        function asPseudoEvent(draft) {
            try {
                const fields = fieldsOfDraft(draft);
                return { uid: "__draft", summary: fields.summary || "(未命名)", start: fields.start, end: fields.end, allDay: draft.allDay === true };
            } catch { return null; }
        }
        // ───────────────────────────── 连接设置 ─────────────────────────────
        /** 每个服务商要填哪些格子。顺序就是表单里的顺序。 */
        const PROVIDER_FIELDS = {
            google: ["calendarId", "clientId", "clientSecret", "refreshToken", "tokenUrl", "proxyUrl"],
            icloud: ["username", "password", "proxyUrl"],
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
            for (const key of Object.keys(FIELD_LABEL))
                out[key] = "";
            if (connection) {
                for (const key of Object.keys(out)) {
                    if (typeof connection[key] === "string")
                        out[key] = connection[key];
                }
            }
            return out;
        }
        /** 「当前：icloud · 你@icloud.com」里的那半句。 */
        function connectionSummary(connection) {
            if (connection === null || connection === undefined)
                return "";
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
            const { connection, onClose, onSaved, inline, onBusy } = props;
            const formId = useId();
            const [form, setForm] = useState(() => connectionDraftOf(connection));
            const [busy, setBusy] = useState("");
            const [result, setResult] = useState(null);
            const [calendars, setCalendars] = useState([]);
            const maySave = connection?.settingsAvailable !== false;
            useEffect(() => {
                onBusy?.(busy !== "");
                return () => onBusy?.(false);
            }, [busy, onBusy]);
// Update protection: dsh-calendar.connection
__stardustUpdatesGuard(React, "dsh-calendar.connection", { dirty: JSON.stringify(form) !== JSON.stringify(connectionDraftOf(connection)), busy: !!busy });

            const patch = (fields) => {
                setForm((prev) => Object.assign({}, prev, fields));
                setResult(null);
            };
            const iCloud = form.provider === "icloud";
            const savedICloudPassword = connection?.provider === "icloud" && connection.hasPassword
                && (form.username || "").trim().toLowerCase() === (connection.username || "").trim().toLowerCase();
            const mayDiscover = (form.username || "").trim() !== "" && (!!form.password?.trim() || savedICloudPassword);
            const canConnect = !!form.provider && (!iCloud || (mayDiscover && !!form.caldavUrl?.trim()));
            const changeProvider = provider => {
                if (provider === form.provider) return;
                setCalendars([]);
                patch(provider === "icloud" || iCloud ? { provider, caldavUrl: "", password: "" } : { provider });
            };
            const changeField = (key, value) => {
                if (iCloud && ["username", "password", "proxyUrl"].includes(key)) setCalendars([]);
                patch(iCloud && key === "username" ? { username: value, caldavUrl: "", password: "" } : { [key]: value });
            };
            const visible = PROVIDER_FIELDS[form.provider] || [];
            const payload = () => {
                const out = {};
                for (const key of Object.keys(FIELD_LABEL)) {
                    const value = form[key];
                    if (typeof value !== "string")
                        continue;
                    // 密钥留空 = 保持已存的那一份；其余字段空串服务端也按「保持不变」处理。
                    if (SECRET_FIELDS.indexOf(key) !== -1 && value.trim() === "")
                        continue;
                    out[key] = value.trim();
                }
                if (form.provider !== "")
                    out.provider = form.provider;
                if (form.provider === "google")
                    out.authMethod = "oauth";
                else if (form.provider !== "" && connection && form.provider !== connection.provider)
                    out.authMethod = "basic";
                return out;
            };
            const discover = async () => {
                setBusy("discover");
                setResult(null);
                setCalendars([]);
                try {
                    const value = await api("discoverICloud", payload());
                    setCalendars(value.calendars);
                    setResult({ ok: true, text: calendarText("请选择要连接的日历。", "Choose the calendar you want to connect.") });
                }
                catch (error) { setResult({ ok: false, text: backendMessage(error) }); }
                finally { setBusy(""); }
            };
            const test = async () => {
                setBusy("test");
                setResult(null);
                try {
                    const value = await api("testConnection", payload());
                    const sample = (value.sample || []).join("、");
                    setResult({ ok: true, text: t("conn.ok", { n: value.count }) + (sample === "" ? "" : t("conn.okSample", { sample })) });
                }
                catch (error) {
                    setResult({ ok: false, text: backendMessage(error) });
                }
                finally {
                    setBusy("");
                }
            };
            const save = async () => {
                setBusy("save");
                setResult(null);
                try {
                    onSaved(await api("saveConnection", Object.assign({}, payload(), { test: true })));
                }
                catch (error) {
                    setResult({ ok: false, text: backendMessage(error) });
                }
                finally {
                    setBusy("");
                }
            };
            const disconnect = async () => {
                setBusy("disconnect");
                setResult(null);
                try {
                    onSaved(await api("disconnectConnection", { expectedRevision: connection?.revision }));
                } catch (error) {
                    setResult({ ok: false, text: backendMessage(error) });
                } finally {
                    setBusy("");
                }
            };
            const title = t("conn.title");
            const renderField = key => {
                const secret = SECRET_FIELDS.includes(key);
                const saved = { password: "hasPassword", clientSecret: "hasClientSecret", refreshToken: "hasRefreshToken" }[key];
                const mayKeep = iCloud && key === "password" ? savedICloudPassword : saved && connection?.[saved];
                const hintKey = FIELD_HINT[form.provider]?.[key];
                return h("div", {
                    key, className: clsx(styles["dshc-field"], ["caldavUrl", "host", "tokenUrl", "proxyUrl"].includes(key) && styles.fullField)
                },
                    h("label", { htmlFor: formId + "-" + key }, t(FIELD_LABEL[key])),
                    h(Txt, {
                        id: formId + "-" + key, type: secret ? "password" : "text", disabled: busy !== "",
                        value: form[key] || "", placeholder: mayKeep ? t("conn.keep") : "",
                        onChange: event => changeField(key, event.target.value)
                    }),
                    hintKey ? h("div", { className: styles["dshc-sub"] }, t(hintKey)) : null
                );
            };
            const calendarLabel = calendarText("选择日历", "Choose a calendar");
            const body = h(React.Fragment, null,
                h("p", { className: styles.pageIntro }, t("conn.intro")),
                h("p", { className: styles.pageIntro }, t("conn.credentials")),
                maySave ? null : h("div", { className: clsx(styles["dshc-alert"], styles.warn) }, t("conn.noSettings")),
                h("div", { className: styles["dshc-field"] },
                    h("label", { htmlFor: formId + "-provider" }, t("conn.provider")),
                    h(Picker, {
                        id: formId + "-provider", label: t("conn.provider"), value: form.provider, disabled: busy !== "",
                        options: [{ id: "", label: t("conn.needProvider") }].concat(PROVIDER_NAMES.map(id => ({
                            id, label: { google: "Google CalDAV OAuth", icloud: "iCloud", nextcloud: "Nextcloud", custom: t("provider.custom") }[id]
                        }))),
                        onChange: changeProvider
                    })
                ),
                PROVIDER_HINT[form.provider] ? h("p", { className: styles.pageIntro }, t(PROVIDER_HINT[form.provider])) : null,
                form.provider ? h("details", { className: styles["dshc-steps"] },
                    h("summary", null, t("conn.steps")),
                    h("ol", null, (UI[UI_LANG]["steps." + form.provider] || []).map((line, index) => h("li", { key: index }, line))),
                    h("div", { className: styles.helpLinks }, (PROVIDER_LINKS[form.provider] || []).map(link => h("a", {
                        key: link.href, href: link.href, target: "_blank", rel: "noreferrer", className: styles["dshc-link"]
                    }, t(link.key))))
                ) : null,
                h("div", { className: styles.formGrid }, visible.map(renderField)),
                iCloud ? h("div", { className: styles["dshc-field"] },
                    h("div", null, h(Btn, { onClick: discover, disabled: busy !== "" || !mayDiscover },
                        busy === "discover" ? calendarText("正在发现…", "Discovering…") : calendarText("发现日历", "Discover calendars")
                    )),
                    calendars.length > 0 ? h(Picker, {
                        id: formId + "-icloud-calendars", label: calendarLabel,
                        value: calendars.some(calendar => calendar.url === form.caldavUrl) ? form.caldavUrl : "",
                        options: [{ id: "", label: calendarLabel }].concat(calendars.map((calendar, index) => ({
                            id: calendar.url,
                            label: calendar.name || calendarText("日历 ", "Calendar ") + (index + 1)
                        }))),
                        disabled: busy !== "", onChange: caldavUrl => patch({ caldavUrl })
                    }) : null,
                    h("details", { className: styles["dshc-steps"] },
                        h("summary", null, calendarText("手动填写日历地址", "Enter a calendar URL manually")),
                        renderField("caldavUrl")
                    )
                ) : null,
                result ? h("div", {
                    className: clsx(styles["dshc-alert"], result.ok ? styles.success : styles.error), role: result.ok ? "status" : "alert"
                }, (result.ok ? "✓ " : t("conn.fail") + "：") + result.text) : null,
                connection?.settingsKind === "file" ? h("p", { className: styles.pageIntro }, t("conn.storageFallback")) : null
            );
            const actions = h("div", { className: styles["dshc-actions"] },
                h(Btn, { variant: "ghost", onClick: onClose, disabled: busy !== "" }, t("action.cancel")),
                connection?.configured && maySave ? h(Btn, { variant: "ghost", onClick: disconnect, disabled: busy !== "" },
                    busy === "disconnect" ? calendarText("正在断开…", "Disconnecting…") : calendarText("断开连接", "Disconnect")) : null,
                h(Btn, { onClick: test, disabled: busy !== "" || !canConnect }, busy === "test" ? t("conn.testing") : t("conn.test")),
                h(Btn, { variant: "primary", onClick: save, disabled: busy !== "" || !canConnect || !maySave },
                    busy === "save" ? t("conn.saving") : connection?.disconnected ? calendarText("重新连接", "Reconnect") : t("conn.save"))
            );
            if (inline) return h("section", { className: styles.workspacePage, "aria-label": title, "aria-busy": !!busy },
                h("div", { className: styles.pageInner },
                    h("h2", { className: styles.pageHeading }, title),
                    h("div", { className: styles.card }, body, actions)
                )
            );
            return h(Dlg, { open: true, onClose: () => { if (!busy) onClose(); }, title, children: body, footer: actions });
        }
        // ───────────────────────────── 主面板 ─────────────────────────────
        // ───────────────────────────── 浮层 Esc 的模块级栈 ─────────────────────────────
        // 一个页面可能同时有多个 CalendarPanel（设置页一节 + 对话页悬浮面板）。如果各自往
        // document 挂捕获监听，stopPropagation 拦不住同阶段的其他监听 —— 一次 Esc 会连关
        // 两层；用全局 querySelector 兜底也会被另一个面板的浮层误触发。这里共用一个捕获
        // 监听，按「焦点所在 root / 最近打开的层」只关一层。
        const LAYER_ESCAPE_STACK = [];
        let layerEscapeListener = null;
        function panelRootOf(node) {
            if (node === null || node === undefined || typeof node.closest !== "function")
                return null;
            return node.closest(".dshc-root");
        }
        /** 目标是否位于别的宿主浮层内（那类浮层会自己处理 Esc）。 */
        function isForeignHostLayer(node) {
            if (node === null || node === undefined || typeof node.closest !== "function")
                return false;
            const layer = node.closest('[role="dialog"], [role="alertdialog"]');
            if (layer === null)
                return false;
            if (layer.closest(".dshc-root") !== null)
                return false;
            if (layer.querySelector('[data-dshc-scope="1"]') !== null)
                return false;
            return true;
        }
        /** 是否有别的宿主浮层盖在上面：有就把 Esc 让给宿主，别关下面的日历层。 */
        function hasForeignHostDialog() {
            const dialogs = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
            for (let i = 0; i < dialogs.length; i++) {
                const layer = dialogs[i];
                if (layer.closest(".dshc-root") !== null)
                    continue;
                if (layer.querySelector('[data-dshc-scope="1"]') !== null)
                    continue;
                if (layer.hidden === true || layer.getAttribute("aria-hidden") === "true")
                    continue;
                if (typeof window !== "undefined" && window !== null && typeof window.getComputedStyle === "function") {
                    const style = window.getComputedStyle(layer);
                    if (style.display === "none" || style.visibility === "hidden")
                        continue;
                }
                return true;
            }
            return false;
        }
        function registerLayerEscape(root, closeTop) {
            const entry = { root, closeTop };
            LAYER_ESCAPE_STACK.push(entry);
            if (layerEscapeListener === null) {
                layerEscapeListener = (event) => {
                    if (event.key !== "Escape" || event.isComposing === true)
                        return;
                    const target = event.target;
                    if (target?.closest?.('[role="menu"], [aria-haspopup="menu"][aria-expanded="true"]')) return;
                    // 上层有别的宿主浮层（不是本插件渲染的）时，Esc 归它；
                    // 普通宿主元素（不在任何浮层里）仍然兜底关我们自己的层。
                    if (hasForeignHostDialog() || isForeignHostLayer(target))
                        return;
                    const root = panelRootOf(target);
                    let owner = null;
                    if (root !== null) {
                        for (let i = LAYER_ESCAPE_STACK.length - 1; i >= 0; i--) {
                            const candidate = LAYER_ESCAPE_STACK[i];
                            if (candidate.root !== null && candidate.root.contains(target)) {
                                owner = candidate;
                                break;
                            }
                        }
                    }
                    if (owner === null)
                        owner = LAYER_ESCAPE_STACK[LAYER_ESCAPE_STACK.length - 1] || null;
                    if (owner === null)
                        return;
                    event.preventDefault();
                    event.stopPropagation();
                    owner.closeTop();
                };
                document.addEventListener("keydown", layerEscapeListener, true);
            }
            return () => {
                const index = LAYER_ESCAPE_STACK.indexOf(entry);
                if (index >= 0)
                    LAYER_ESCAPE_STACK.splice(index, 1);
                if (LAYER_ESCAPE_STACK.length === 0 && layerEscapeListener !== null) {
                    document.removeEventListener("keydown", layerEscapeListener, true);
                    layerEscapeListener = null;
                }
            };
        }
        Object.assign(UI.zh, {
            "conn.credentials": "这里填写日历服务的凭据。DSH 的模型 API 密钥不能用于日历登录；Google 使用 OAuth 授权，iCloud 使用应用专用密码。",
            "import.open": "导入 ICS", "import.title": "从 ICS 文件导入日程", "import.intro": "先核对预览，再导入选中的日程。已有相同 UID 的记录会跳过。",
            "import.file": "选择 ICS 文件", "import.paste": "或粘贴 ICS 内容", "import.timezone": "未标注时区的时间按", "import.chooseZone": "请主动选择时区", "import.preview": "预览与检查",
            "import.busy": "正在处理…", "import.close": "关闭导入", "import.select": "选择下一批（最多 20 条）", "import.clear": "清除选择", "import.commit": "确认导入 {n} 条",
            "import.ready": "可导入", "import.blocked": "需要修正", "import.duplicate": "已存在，跳过", "import.imported": "已导入", "import.failed": "失败，可重试",
            "import.conflicts": "首场时间与 {n} 条日程重叠，请核对", "import.recurring": "重复系列 · {n} 条例外", "import.scope": "重叠提示检查首场时间，不代表整个重复系列。每批最多 20 个系列；预览保留 15 分钟。",
            "import.ignored": "另有 {n} 个非日程组件未导入。", "import.limit": "ICS 文件最大 256 KiB；每次预览最多 100 个日程系列。", "import.results": "本批：{ok} 条已导入，{duplicate} 条已存在，{failed} 条失败。",
            "import.connection": "连接设置", "import.errorSize": "文件超过 256 KiB，请分批导出。", "import.stopped": "请求已停止；重新预览可核对已写入的日程。", "import.stop": "停止本批",
            "import.retryHint": "重试只处理失败项，成功项不会重复写入。", "import.noReady": "没有可导入的日程，请检查上面的提示。"
        });
        Object.assign(UI.en, {
            "conn.credentials": "Use credentials for your calendar service here. A DSH model API key cannot sign into a calendar. Google uses OAuth authorization; iCloud uses an app-specific password.",
            "import.open": "Import ICS", "import.title": "Import events from ICS", "import.intro": "Review the preview before importing selected events. Existing UIDs are skipped.",
            "import.file": "Choose an ICS file", "import.paste": "Or paste ICS content", "import.timezone": "Interpret times without a timezone as", "import.chooseZone": "Choose a timezone explicitly", "import.preview": "Preview and check",
            "import.busy": "Working…", "import.close": "Close import", "import.select": "Select next batch (up to 20)", "import.clear": "Clear selection", "import.commit": "Confirm import of {n} events",
            "import.ready": "Ready", "import.blocked": "Needs correction", "import.duplicate": "Already exists; skipped", "import.imported": "Imported", "import.failed": "Failed; retry available",
            "import.conflicts": "The first occurrence overlaps {n} events; please review", "import.recurring": "Recurring series · {n} exceptions", "import.scope": "Overlap checks cover the first occurrence, not the whole series. Up to 20 series per batch; previews expire in 15 minutes.",
            "import.ignored": "{n} non-event components were not imported.", "import.limit": "Up to 256 KiB per file and 100 event series per preview.", "import.results": "Batch: {ok} imported, {duplicate} already present, {failed} failed.",
            "import.connection": "Connection settings", "import.errorSize": "The file exceeds 256 KiB; export smaller batches.", "import.stopped": "Request stopped. Preview again to check which events were saved.", "import.stop": "Stop batch",
            "import.retryHint": "Retry only processes failed items; successful items are not written again.", "import.noReady": "No events are ready to import. Review the messages above."
        });
        async function importApi(action, payload, signal) {
            const res = await fetch(IMPORT_ROUTE, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", "X-DSH-Calendar-Import": "1" }, body: JSON.stringify(Object.assign({ action }, payload)), signal });
            let body;
            try {
                body = await res.json();
            }
            catch (e) {
                body = null;
            }
            if (!res.ok || !body || body.ok !== true)
                throw Object.assign(new Error(backendMessage({ message: body && body.message || "HTTP " + res.status, status: res.status })), { status: res.status });
            return body.value;
        }
        function importDate(row) {
            if (!row.start)
                return "";
            if (row.allDay)
                return row.start + (row.end && row.end !== row.start ? " → " + row.end + " (" + (UI_LANG === "en" ? "exclusive end" : "结束日不计入") + ")" : "");
            let timezone = row.timezones && row.timezones[0] || "UTC";
            try {
                new Intl.DateTimeFormat("en", { timeZone: timezone });
            }
            catch (e) {
                timezone = "UTC";
            }
            const fmt = new Intl.DateTimeFormat(UI_LANG === "en" ? "en-GB" : "zh-CN", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
            return fmt.format(new Date(row.start)) + " → " + fmt.format(new Date(row.end || row.start)) + " · " + timezone;
        }
        function IcsImportPanel(props) {
            const timezoneId = useId();
            const [content, setContent] = useState(""), [timezone, setTimezone] = useState(""), [zones, setZones] = useState(["UTC", "Asia/Shanghai", "America/New_York", "Europe/London"]);
            const [preview, setPreview] = useState(null), [selected, setSelected] = useState([]), [results, setResults] = useState({}), [error, setError] = useState(""), [busy, setBusy] = useState(false);
            const controller = useRef(null), alive = useRef(true), fileSequence = useRef(0);
// Update protection: dsh-calendar.import
__stardustUpdatesGuard(React, "dsh-calendar.import", { dirty: !!content.trim(), busy });

            useEffect(() => {
                alive.current = true;
                const abort = new AbortController();
                importApi("zones", {}, abort.signal).then(v => { if (alive.current && Array.isArray(v.zones)) {
                    const common = ["Asia/Shanghai", "UTC", "Asia/Tokyo", "Europe/London", "America/New_York"];
                    setZones(common.concat(v.zones.filter(zone => !common.includes(zone))));
                } }).catch(() => { });
                return () => { alive.current = false; abort.abort(); if (controller.current)
                    controller.current.abort(); };
            }, []);
            useEffect(() => { props.onBusy(busy); return () => props.onBusy(false); }, [busy]);
            const reset = () => { setPreview(null); setSelected([]); setResults({}); setError(""); };
            const update = value => { fileSequence.current++; setContent(value); reset(); };
            const loadFile = async (event) => {
                const file = event.target.files && event.target.files[0];
                if (!file)
                    return;
                const sequence = ++fileSequence.current;
                reset();
                setContent("");
                if (file.size > 256 * 1024) {
                    setError(t("import.errorSize"));
                    return;
                }
                try {
                    const value = await file.text();
                    if (alive.current && sequence === fileSequence.current)
                        setContent(value);
                }
                catch (e) {
                    if (alive.current && sequence === fileSequence.current)
                        setError(backendMessage(e));
                }
            };
            const eligible = preview ? preview.rows.filter(row => row.status === "ready" && !["imported", "duplicate"].includes(results[row.id] && results[row.id].status)) : [];
            const run = async (committing, ids = selected) => {
                if (busy)
                    return;
                setBusy(true);
                setError("");
                const abort = new AbortController();
                controller.current = abort;
                const timer = setTimeout(() => abort.abort(), 125000);
                try {
                    const value = await importApi(committing ? "commit" : "preview", committing ? { id: preview.id, selected: ids, confirmed: true } : { ics: content, floatingTimezone: timezone }, abort.signal);
                    if (!alive.current)
                        return;
                    if (committing) {
                        const next = Object.assign({}, results);
                        value.results.forEach(row => { next[row.id] = row; });
                        setResults(next);
                        setSelected(value.results.filter(row => row.status === "failed").map(row => row.id));
                        props.onImported();
                    }
                    else {
                        setPreview(value);
                        setResults({});
                        setSelected([]);
                    }
                }
                catch (e) {
                    if (alive.current)
                        setError(abort.signal.aborted ? t("import.stopped") : backendMessage(e));
                }
                finally {
                    clearTimeout(timer);
                    controller.current = null;
                    if (alive.current)
                        setBusy(false);
                }
            };
            const count = Object.values(results);
            const failed = eligible.filter(row => results[row.id]?.status === "failed").slice(0, 20).map(row => row.id);
            const importStatusTone = { ready: styles.success, imported: styles.success, blocked: styles.warn, failed: styles.error };
            const title = t("import.title");
            const fields = h("div", { className: styles.card },
                h("div", { className: styles["dshc-field"] },
                    h("label", { htmlFor: timezoneId + "-file" }, t("import.file")),
                    h("input", { id: timezoneId + "-file", className: styles["dshc-input"], type: "file", accept: ".ics,text/calendar", disabled: busy, onChange: loadFile })
                ),
                h("div", { className: styles["dshc-field"] },
                    h("label", { htmlFor: timezoneId + "-paste" }, t("import.paste")),
                    h("textarea", { id: timezoneId + "-paste", className: clsx(styles["dshc-input"], styles.importText), value: content, rows: 5, disabled: busy, onChange: e => update(e.target.value), spellCheck: false })
                ),
                h("div", { className: styles["dshc-field"] },
                    h("label", { htmlFor: timezoneId }, t("import.timezone")),
                    h(Picker, {
                        id: timezoneId, label: t("import.timezone"), value: timezone, disabled: busy,
                        options: [{ id: "", label: t("import.chooseZone") }].concat(zones.map(id => ({
                            id, label: id === "Asia/Shanghai" ? calendarText("北京时间 · Asia/Shanghai", "Beijing time · Asia/Shanghai") : id
                        }))),
                        onChange: value => { setTimezone(value); reset(); }
                    })
                ),
                h("p", { className: styles["dshc-sub"] }, t("import.limit")),
                h("div", { className: styles["dshc-import-actions"] },
                    h(Btn, { variant: preview ? "outline" : "primary", disabled: busy || !content.trim(), onClick: () => run(false) }, busy ? t("import.busy") : t("import.preview")),
                    busy ? h(Btn, { onClick: () => controller.current?.abort() }, t("import.stop")) : null
                )
            );
            const previewCard = preview ? h("div", { className: styles.card },
                h("div", { className: styles.cardToolbar },
                    h("h3", null, t("import.preview")),
                    h("div", { className: styles["dshc-actions"] },
                        failed.length ? h(Btn, { disabled: busy || !preview.connectionReady, onClick: () => run(true, failed) },
                            calendarText("重试失败项", "Retry failed items")) : null,
                        h(Btn, { variant: "primary", disabled: busy || !preview.connectionReady || !selected.length, onClick: () => run(true) }, t("import.commit", { n: selected.length }))
                    )
                ),
                preview.connectionReady === false ? h("div", { className: clsx(styles["dshc-alert"], styles.warn) },
                    backendMessage(preview.connectionMessage), h(Btn, { onClick: props.onConnection }, t("import.connection"))) : null,
                h("p", { className: styles["dshc-sub"] }, t("import.scope")),
                preview.ignored ? h("p", null, t("import.ignored", { n: preview.ignored })) : null,
                h("div", { className: styles["dshc-import-actions"] },
                    h(Btn, { variant: "ghost", disabled: busy || !eligible.length, onClick: () => setSelected(eligible.slice(0, 20).map(row => row.id)) }, t("import.select")),
                    h(Btn, { variant: "ghost", disabled: busy || !selected.length, onClick: () => setSelected([]) }, t("import.clear"))
                ),
                h("div", { className: styles["dshc-import-rows"] }, preview.rows.map(row => {
                    const result = results[row.id], status = result?.status || row.status;
                    const checked = selected.includes(row.id);
                    const done = status === "imported" || status === "duplicate";
                    return h("div", { key: row.id, className: styles["dshc-import-row"] },
                        h("div", { className: styles["dshc-import-pick"] },
                            h(Chk, { label: row.summary, checked,
                                disabled: busy || row.status !== "ready" || done || (!checked && selected.length >= 20),
                                onChange: next => setSelected(prev => next ? prev.concat(row.id) : prev.filter(id => id !== row.id)) }),
                            h("span", { className: clsx(styles["dshc-tag"], importStatusTone[status]) }, t("import." + status))
                        ),
                        h("p", { className: styles["dshc-mono"] }, importDate(row)),
                        row.recurring ? h("p", null, t("import.recurring", { n: row.exceptions })) : null,
                        !done && row.conflicts ? h("p", { className: styles["dshc-import-warning"] }, t("import.conflicts", { n: row.conflicts })) : null,
                        !done ? row.warnings.concat(row.errors).map((message, i) => h("p", { key: i, className: styles["dshc-import-warning"] }, backendMessage(message))) : null,
                        result?.message ? h("p", { role: "alert" }, backendMessage(result.message)) : null
                    );
                })),
                count.length ? h("p", { role: "status" }, t("import.results", {
                    ok: count.filter(row => row.status === "imported").length,
                    duplicate: count.filter(row => row.status === "duplicate").length,
                    failed: count.filter(row => row.status === "failed").length
                })) : null,
                failed.length ? h("p", { className: styles["dshc-sub"] }, t("import.retryHint")) : null,
                !eligible.length && !count.length ? h("p", null, t("import.noReady")) : null
            ) : null;
            return h("section", { className: styles.workspacePage, "aria-label": title, "aria-busy": busy },
                h("div", { className: styles.pageInner },
                    h("div", { className: styles.pageHeader },
                        h("h2", { className: styles.pageHeading }, title),
                        h(IconButton, { label: t("import.close"), icon: "close", disabled: busy, onClick: props.onClose })
                    ),
                    h("p", { className: styles.pageIntro }, t("import.intro")),
                    fields,
                    error ? h("p", { className: clsx(styles["dshc-alert"], styles.error), role: "alert" }, error) : null,
                    previewCard
                )
            );
        }
        const NO_EVENTS = [];

        function CalendarPanel(props) {
            useUILanguage();
            const compact = props.compact === true;
            const workbench = props.workbench === true;
            const workspaceId = useId();
            const viewId = useId();
            const [view, setView] = useState(loadStoredView);
            const [anchor, setAnchor] = useState(() => new Date());
            const [showCalendar, setShowCalendar] = useState(true);
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
            const [tool, setTool] = useState("schedule");
            const [layout, setLayout] = useState(loadCalendarLayout);
            const [palette, setPalette] = useState(loadCalendarPalette);
            const [dshStyle, setDshStyle] = useDshStyle(React);
            const [dshFont, setDshFont] = useDshFont(React);
            const dark = useCalendarDarkMode(workbench && dshStyle === "harness");
            const appearance = useMemo(() => workbench ? calendarAppearance(layout, palette, dark ? "dark" : "light", dshStyle) : undefined,
                [workbench, layout, palette, dark, dshStyle]);
            const [utility, setUtility] = useState(null);
            const [importBusy, setImportBusy] = useState(false);
            const [availabilityBusy, setAvailabilityBusy] = useState(false);
            const [connectionBusy, setConnectionBusy] = useState(false);
            const [tour, setTour] = useState({ open: false, step: 0, manual: false });
            const [tourLayout, setTourLayout] = useState(null);
            const importOpen = tool === "import";
            const availabilityOpen = tool === "availability";
            const connectionOpen = tool === "connection";
            const layerOpen = draft !== null || selected !== null || connOpen === true || utility !== null;
            // Update protection: dsh-calendar
            __stardustUpdatesGuard(React, "dsh-calendar", { busy: busy || layerOpen || importOpen || availabilityOpen || connectionOpen });

            const rootRef = useRef(null);
            const triggerRef = useRef(null);
            const layerOpenRef = useRef(layerOpen);
            layerOpenRef.current = layerOpen;
            useEffect(() => {
                if (!workbench || compact || readCalendarTourDone()) return undefined;
                const timer = setTimeout(() => {
                    if (!readCalendarTourDone() && !layerOpenRef.current) {
                        setTour({ open: true, step: 0, manual: false });
                    }
                }, 280);
                return () => clearTimeout(timer);
            }, [workbench, compact]);
            useEffect(() => {
                if (layerOpen && tour.open) {
                    setTour(prev => ({ ...prev, open: false }));
                }
            }, [layerOpen, tour.open]);
            /** 让 Launcher 知道本面板里有没有浮层：宿主 Portal 的 Esc 不能被面板级监听抢走。 */
            useEffect(() => {
                const notify = typeof props.onLayerChange === "function" ? props.onLayerChange : null;
                if (notify !== null)
                    notify(layerOpen);
                return () => { if (notify !== null)
                    notify(false); };
            }, [layerOpen]);
            /** 面板内浮层的打开顺序：Esc 关最后打开的那个，而不是按类型硬编码。 */
            const layerOrderRef = useRef([]);
            useEffect(() => {
                const openKeys = [];
                if (selected !== null)
                    openKeys.push("selected");
                if (draft !== null)
                    openKeys.push("draft");
                if (connOpen === true)
                    openKeys.push("conn");
                if (utility !== null)
                    openKeys.push("utility");
                const kept = layerOrderRef.current.filter((key) => openKeys.indexOf(key) !== -1);
                const added = openKeys.filter((key) => kept.indexOf(key) === -1);
                layerOrderRef.current = kept.concat(added);
            }, [draft, connOpen, selected, utility]);
            /**
             * Esc 分层关闭：有浮层时只关最上面一层（表单/连接设置 > 详情抽屉）。
             * 监听走模块级的层栈 —— 多个 CalendarPanel 并存时一次 Esc 只关一层；
             * 焦点在上层宿主 Portal 里时直接让行，交给宿主自己的 Esc 语义。
             */
            useEffect(() => {
                if (layerOpen !== true)
                    return () => { };
                const root = rootRef.current;
                if (root === null)
                    return () => { };
                const closeTop = () => {
                    const order = layerOrderRef.current;
                    const top = order.length === 0 ? null : order[order.length - 1];
                    if (top === "draft") {
                        setDraft(null);
                        setFormError(null);
                        setConfirmDelete(false);
                    }
                    else if (top === "conn")
                        setConnOpen(false);
                    else if (top === "utility")
                        setUtility(null);
                    else if (top === "selected") {
                        setSelected(null);
                        setConfirmDelete(false);
                    }
                };
                return registerLayerEscape(root, closeTop);
            }, [draft, selected, connOpen, utility]);
            /** 乐观改期：uid → { start, end }。等服务器回读到同样的时间再撤掉，避免闪回。 */
            const [overrides, setOverrides] = useState({});
            const [undo, setUndo] = useState(null);
            const undoTimer = useRef(0);
            /** 每个 uid 一个串行队列：见 applyMove 的注释。 */
            const moveQueue = useRef({});
            useEffect(() => () => { if (undoTimer.current)
                clearTimeout(undoTimer.current); }, []);
            useEffect(() => {
                let alive = true;
                api("connection", {}).then((value) => { if (alive) {
                    setConn(value);
                    setConfigured(value && value.configured !== false);
                } })
                    .catch(() => { if (alive)
                    setConfigured(true); }); // 状态都问不到时按「已配置」处理，让错误条去解释
                return () => { alive = false; };
            }, [reloadToken]);
            const range = useMemo(() => rangeOf(view, anchor), [view, anchor.getFullYear(), anchor.getMonth(), anchor.getDate()]);
            const data = useCalendarData(range, reloadToken, demo, configured);
            const reload = () => setReloadToken((n) => n + 1);
            /** 渲染用的事件：把乐观改期叠加在服务器数据之上。 */
            const eventsWithMoves = useMemo(() => data.events.map((event) => {
                const override = overrides[event.uid];
                return override === undefined ? event : Object.assign({}, event, override);
            }), [data.events, overrides]);
            const visibleEvents = showCalendar || demo ? eventsWithMoves : NO_EVENTS;
            const { count: conflicts, conflicted, overlap } = useMemo(() => conflictSummary(visibleEvents), [visibleEvents]);
            const source = conn?.configured ? conn.calendar || connectionSummary(conn) : null;
            /**
             * 改期成功后把焦点还给同一个日程。
             *
             * 位置必须在 const data = useCalendarData(...) **之后**：依赖数组 [data.events] 在渲染期求值，
             * 写在前面会直接 TDZ 抛错（panel 每次渲染就崩 —— 纯函数测试抓不到，评审抓到了）。
             * 另外只在「焦点还在面板里」时才回收，免得用户在慢 reload 期间已经点到别处又被抢回来。
             */
            const focusUid = useRef(null);
            useEffect(() => {
                const uid = focusUid.current;
                if (uid === null)
                    return;
                focusUid.current = null;
                const active = document.activeElement;
                const inPanel = active === undefined || active === null || active === document.body
                    || (typeof active.closest === "function" && active.closest(".dshc-root") !== null);
                if (inPanel !== true)
                    return;
                try {
                    const selector = '.dshc-slot[data-uid="' + String(uid).replace(/"/g, '\\"') + '"]';
                    const node = document.querySelector(selector);
                    if (node !== null && typeof node.focus === "function")
                        node.focus({ preventScroll: true });
                }
                catch (error) { /* uid 里有怪字符就算了，不值得为此报错 */ }
            }, [data.events]);
            /** 服务器回读到新时间后，撤掉对应的乐观覆盖（否则会一直盖着）。 */
            useEffect(() => {
                setOverrides((prev) => {
                    const uids = Object.keys(prev);
                    if (uids.length === 0)
                        return prev;
                    const next = Object.assign({}, prev);
                    let changed = false;
                    for (const uid of uids) {
                        const stored = data.events.find((event) => event.uid === uid);
                        if (stored !== undefined && stored.start === prev[uid].start && stored.end === prev[uid].end) {
                            delete next[uid];
                            changed = true;
                        }
                    }
                    return changed ? next : prev;
                });
            }, [data.events]);
            /** 乐观改期的落盘：先动画面、再发请求；失败就把覆盖撤掉并报错。 */
            /**
             * 改期落盘：**按 uid 串行 + 合并**。
             *
             * 按住方向键会按 repeat 频率连发，直接并发发 PUT 的话：乱序可能让服务器停在中间某个时间、
             * 而先发的那次失败会把后发那次的乐观位置一起回滚掉。这里同一 uid 只跑一个请求，
             * 期间来的新落点合并成「最后一次」，跑完再接着发。
             */
            const applyMove = (event, range) => {
                const uid = event.uid;
                const shown = overrides[uid] === undefined ? { start: event.start, end: event.end } : overrides[uid];
                if (range.start === shown.start && range.end === shown.end)
                    return; // 无效位移（同一格内晃一下）不发请求
                const queue = moveQueue.current;
                if (queue[uid] === undefined)
                    queue[uid] = { running: false, next: null };
                const entry = queue[uid];
                if (entry.running === true) {
                    entry.next = range;
                    return;
                }
                entry.running = true;
                void drain(uid, event, range, entry);
            };
            /** 串行队列的驱动：失败即回滚 + 对账（超时可能已经落盘，不能假设「失败 = 没改」）。 */
            const drain = async (uid, event, firstRange, entry) => {
                const original = { uid, start: event.start, end: event.end, summary: event.summary };
                let range = firstRange;
                try {
                    for (;;) {
                        setOverrides((prev) => Object.assign({}, prev, { [uid]: { start: range.start, end: range.end } }));
                        try {
                            await api("update", { uid, start: range.start, end: range.end });
                        }
                        catch (error) {
                            setOverrides((prev) => { const next = Object.assign({}, prev); delete next[uid]; return next; });
                            notify(t("move.failed", { message: error !== null && error !== undefined && error.message ? error.message : String(error) }));
                            reload(); // 对账：超时/断连时服务器可能已经改了
                            break;
                        }
                        focusUid.current = uid;
                        // 一次「连续操作」只留一个撤销点：记录的是这段操作前的原始位置，而不是上一小步。
                        setUndo(Object.assign({ recurring: false }, original));
                        if (undoTimer.current)
                            clearTimeout(undoTimer.current);
                        undoTimer.current = setTimeout(() => setUndo(null), 5000);
                        reload();
                        if (entry.next === null)
                            break;
                        range = entry.next;
                        entry.next = null;
                    }
                }
                finally {
                    entry.running = false;
                    if (entry.next === null)
                        delete moveQueue.current[uid];
                    else {
                        const pending = entry.next;
                        entry.next = null;
                        applyMove(event, pending);
                    }
                }
            };
            /** 改期入口：重复日程先问一句（拖动会移动整个系列，这是语义雷区，不能悄悄做）。 */
            const reschedule = (event, range) => {
                if (demo === true) {
                    notify(t("demo.banner"));
                    return;
                }
                // 重复日程暂不支持拖动改期：CalDAV 里整个系列是一个对象，而 update 只能改 master 的
                // DTSTART —— 把「这次实例的目标时间」发过去等于**重锚系列起点**（早于它的实例全丢、
                // COUNT/UNTIL 语义被改，撤销也回不到原系列）。评审实测过，这里必须先挡住。
                if (isRecurring(event)) {
                    notify(t("move.recurringUnsupported"));
                    return;
                }
                // 超过 24 小时的日程：当天放不下，任何位移都会被钳到 00:00，语义不清，一并挡住。
                if (slotFromEvent(event).durationMinutes > 24 * 60) {
                    notify(t("move.tooLong"));
                    return;
                }
                applyMove(event, range);
            };
            /** 撤销：把上一次改期前的 start/end 再写回去。 */
            const undoMove = async () => {
                if (undo === null)
                    return;
                const target = undo;
                setUndo(null);
                if (undoTimer.current)
                    clearTimeout(undoTimer.current);
                const optimistic = true; // 撤销只服务单次日程（重复日程不走拖动）
                if (optimistic === true)
                    setOverrides((prev) => Object.assign({}, prev, { [target.uid]: { start: target.start, end: target.end } }));
                try {
                    await api("update", { uid: target.uid, start: target.start, end: target.end });
                    reload();
                }
                catch (error) {
                    if (optimistic === true)
                        setOverrides((prev) => { const next = Object.assign({}, prev); delete next[target.uid]; return next; });
                    notify(t("move.failed", { message: error !== null && error !== undefined && error.message ? error.message : String(error) }));
                }
            };
            /** 未连接日历时的点法：别让按钮「点了没反应」，直接打开连接设置并说明原因。 */
            const connectFirst = () => {
                setConnOpen(true);
                notify(calendarText('请先连接日历，再新建日程或查找空闲时段。', 'Connect a calendar before creating events or finding available time.'));
            };
            const notify = (text) => { setBanner(text); setTimeout(() => setBanner((current) => (current === text ? null : current)), 2200); };
            const title = view === "week" ? formatWeekTitle(anchor) : view === "agenda" ? t("view.agenda") : formatMonthTitle(anchor);
            const step = (delta) => setAnchor((current) => (view === "week" ? addDays(current, delta * 7) : addMonthShift(current, delta)));
            const submit = async (form) => {
                if (demo === true) {
                    setFormError(t("demo.banner"));
                    return;
                }
                setBusy(true);
                setFormError(null);
                try {
                    const fields = fieldsOfDraft(form);
                    if (form.uid === undefined)
                        await api("create", fields);
                    else
                        await api("update", Object.assign({ uid: form.uid }, fields));
                    setDraft(null);
                    setSelected(null);
                    reload();
                    notify(form.uid === undefined ? calendarText("已创建", "Event created") : calendarText("已保存", "Event saved"));
                }
                catch (error) {
                    setFormError(backendMessage(error));
                }
                finally {
                    setBusy(false);
                }
            };
            const remove = async (event) => {
                if (demo === true) {
                    notify(t("demo.banner"));
                    return;
                }
                setBusy(true);
                try {
                    await api("delete", { uid: event.uid, ...(isRecurring(event) ? { scope: "series" } : {}) });
                    setSelected(null);
                    setConfirmDelete(false);
                    reload();
                    setDraft(null);
                    setFormError(null);
                    notify(calendarText("已删除", "Event deleted"));
                }
                catch (error) {
                    if (draft) setFormError(backendMessage(error));
                    else setBanner(backendMessage(error));
                }
                finally {
                    setBusy(false);
                }
            };
            const toolBusy = importBusy || availabilityBusy || connectionBusy;
            const backToSchedule = () => setTool("schedule");
            const showAvailability = () => {
                if (configured === true) setTool("availability");
                else connectFirst();
            };
            const createAt = (day, hour) => {
                if (demo) {
                    notify(t("demo.banner"));
                    return;
                }
                setConfirmDelete(false);
                setFormError(null);
                setDraft(draftAt(day, hour));
            };
            const startDraft = () => configured === true ? createAt(anchor) : connectFirst();
            const finishConnection = value => {
                if (value?.connection) {
                    setConn(value.connection);
                    setConfigured(value.connection.configured === true);
                }
                setConnOpen(false);
                if (connectionOpen) backToSchedule();
                setDemo(false);
                setShowCalendar(!value?.disconnected);
                reload();
                notify(value?.disconnected ? calendarText("已断开连接，随时可以重新连接。", "Disconnected. You can reconnect anytime.") : t("conn.savedToast"));
            };
            const openEvent = event => {
                setConfirmDelete(false);
                setFormError(null);
                if (workbench && !demo && !isRecurring(event)) {
                    setDraft(draftOfEvent(event));
                } else {
                    setSelected(event);
                }
            };
            const closeReview = () => {
                setSelected(null);
                setConfirmDelete(false);
            };
            const closeDraft = () => {
                setDraft(null);
                setFormError(null);
                setConfirmDelete(false);
            };
            const editEvent = async event => {
                if (!isRecurring(event) || demo) {
                    closeReview();
                    setDraft(draftOfEvent(event));
                    return;
                }
                setBusy(true);
                try {
                    const value = await api("event", { uid: event.uid });
                    closeReview();
                    setDraft({ ...draftOfEvent(value.event), isSeries: true });
                } catch (error) {
                    setBanner(backendMessage(error));
                } finally {
                    setBusy(false);
                }
            };
            const selectView = name => { setView(name); storeView(name); };
            const views = h(Segments, {
                id: viewId, label: calendarText("日历视图", "Calendar view"),
                items: VIEWS.map(value => ({ value, label: t("view." + value) })), value: view, onChange: selectView
            });
            const period = h("div", { className: styles.period },
                view !== "agenda" ? h(Btn, { onClick: () => setAnchor(new Date()) }, t("action.today")) : null,
                view !== "agenda" ? h(IconButton, { icon: "left", label: t("action.prev"), onClick: () => step(-1) }) : null,
                view !== "agenda" ? h(IconButton, { icon: "right", label: t("action.next"), onClick: () => step(1) }) : null,
                h("strong", { className: styles["dshc-monthhead"], "data-dsh-serif": "" }, title)
            );
            const refresh = demo
                ? h(Btn, { onClick: () => setDemo(false) }, t("action.exitDemo"))
                : h(IconButton, { icon: "refresh", label: t("action.refresh"), "aria-busy": data.loading || undefined, onClick: reload });
            const availabilityLabel = calendarText("找空闲时段", "Find available time");
            const quickLabel = calendarText("日历快捷操作", "Calendar quick actions");
            const isDarwin = workbench && document.documentElement.dataset.platform === "darwin";
            const quickKey = isDarwin ? "⌘⇧K" : "Ctrl+Shift+K";
            const compactQuickKey = isDarwin ? "⌘K" : "^K";
            const layoutOptions = workbench ? calendarLayoutOptions() : [];
            const selectLayout = value => { setLayout(value); storeCalendarPreference(CALENDAR_LAYOUT_KEY, value); };
            const selectPalette = value => { setPalette(value); storeCalendarPreference(CALENDAR_PALETTE_KEY, value); };
            const reviewConflicts = () => setUtility("conflicts");
            const canCreate = !demo && configured !== null && !toolBusy;
            const closeTour = (restoreFocus = false) => {
                writeCalendarTourDone();
                setTour(prev => ({ ...prev, open: false }));
                if (restoreFocus) {
                    setTimeout(() => {
                        (triggerRef.current || rootRef.current?.querySelector?.("[data-calendar-tour-trigger]"))?.focus?.();
                    }, 0);
                }
            };
            const tourSteps = [
                {
                    id: "focus-ribbon",
                    selector: '[data-calendar-focus-ribbon="true"]',
                    fallback: '[data-tour="calendar-views"]',
                    side: "bottom",
                    title: calendarText("今日聚焦条：下一场倒计时、冲突状态与快速新建", "Today Focus Ribbon: countdown, conflicts & quick add"),
                    desc: calendarText("聚焦条常驻日历画布上方，一眼看清今天日期、下一场日程倒计时与无冲突/告警状态，支持 1 键「+ 快速新建」或回到今天；点顶栏「日历连接」可配置 iCloud / Google / CalDAV。", "The Today Focus Ribbon keeps today's date, next event countdown, conflict status, and + Quick add always in view; configure iCloud, Google OAuth, Nextcloud, or CalDAV in Connection.")
                },
                {
                    id: "layout",
                    selector: '[data-tour="calendar-layout"]',
                    fallback: ".dsh-style-switcher",
                    side: "bottom",
                    title: calendarText("Bento 默认布局 · 四种空间布局与 13 风格 / 8 字体", "Bento default layout · 4 layouts, 13 styles & 8 fonts"),
                    desc: calendarText("工作台默认以 Bento 卡片风呈现，可在顶栏 1 键切换「原生 / 浮岛 / 聚光 / Bento」及 13 套视觉风格与 8 套字体；按 M / W / A 切换月、周或议程视图并支持周视图拖拽改期。", "Starts in the Bento card studio by default—switch Native / Island / Focus / Bento plus 13 styles & 8 fonts from the header, and press M / W / A for Month, Week (drag-to-reschedule), or Agenda views.")
                },
                {
                    id: "availability",
                    selector: '[data-segment-id="availability"], [id$="-availability"]',
                    fallback: '[data-tour="calendar-workspace-tabs"]',
                    side: "bottom",
                    title: calendarText("查找空闲时段并一键复制候选时间", "Find free slots & copy meeting options"),
                    desc: calendarText("按 F 打开「找空闲时段」，查出候选后点「复制空闲时段文案」直接发微信/钉钉/邮件，或复制下方指令交给助手：", "Press F for Find available time and click Copy free slots summary for chat/email—or copy this assistant prompt:"),
                    prompt: calendarText("帮我查一下本周工作时间的空闲时段，整理成可发送的会议候选时间", "Find my free working-hour slots this week and format meeting options"),
                    promptLabel: calendarText("复制查空档指令", "Copy free-slots prompt")
                },
                {
                    id: "smart-draft",
                    selector: '[data-tour="calendar-new-event"]',
                    fallback: ".topbar",
                    side: "bottom",
                    title: calendarText("冲突检查与从文字 / 截图智能建日程", "Conflict checks & smart drafts from text or screenshots"),
                    desc: calendarText("点击「新建日程」或聚焦条「+ 快速新建」，可粘贴通知文字或拖入截图自动生成草稿，保存前自动检测时间重叠并在侧栏汇总冲突。", "Paste message text or drop a screenshot in New event / + Quick add to generate a reviewed draft, with automatic overlap detection before saving.")
                }
            ];
            const commandActions = workbench ? [
                { id: "create", key: "n", label: t("action.new"), run: startDraft, disabled: !canCreate },
                { id: "availability", key: "f", label: availabilityLabel, run: showAvailability, disabled: demo || configured === null },
                { id: "conflicts", label: calendarText("查看日程冲突", "Review scheduling conflicts"), run: reviewConflicts, disabled: conflicts === 0 },
                { id: "import", label: t("import.open"), run: () => setTool("import"), disabled: demo },
                { id: "connection", label: t("conn.title"), run: () => setTool("connection"), disabled: configured === null },
                { id: "tour", label: calendarText("使用引导", "Interactive guide"), run: () => setTour({ open: true, step: 0, manual: true }) },
                ...VIEWS.map(name => ({
                    id: name, key: name[0],
                    label: calendarText("切换到" + t("view." + name) + "视图", "Switch to " + t("view." + name)),
                    run: () => { backToSchedule(); selectView(name); }
                })),
                ...layoutOptions.map(option => ({
                    id: option.id,
                    label: calendarText("切换布局 · ", "Switch layout · ") + option.label,
                    run: () => selectLayout(option.id)
                })),
                ...DSH_STYLES.map(preset => ({
                    id: "style-" + preset.id,
                    label: calendarText("切换风格 · " + preset.zh, "Switch style · " + preset.en),
                    run: () => setDshStyle(preset.id)
                }))
            ] : [];
            function onWorkbenchKeyDown(event) {
                if (layerOpen || toolBusy || event.defaultPrevented || event.nativeEvent?.isComposing) return;
                if (event.target.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="menu"], [role="dialog"], [role="alertdialog"], [aria-expanded="true"][aria-haspopup="menu"]')) return;
                const key = event.key.toLowerCase();
                if (key === "k" && (event.ctrlKey || event.metaKey) && event.shiftKey && !event.altKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    setUtility("commands");
                    return;
                }
                if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || tool !== "schedule") return;
                const action = commandActions.find(action => action.key === key && !action.disabled);
                if (!action) return;
                event.preventDefault();
                event.stopPropagation();
                action.run();
            }
            const compactToolbar = compact ? h("header", { className: styles["dshc-toolbar"] },
                h("h2", { className: styles["dshc-title"] }, t("section.title")),
                tool === "schedule" ? period : null,
                tool === "schedule" ? views : null,
                h("span", { className: styles["dshc-spacer"] }),
                h(StyleSwitcher, { style: dshStyle, font: dshFont, onChange: setDshStyle, onFontChange: setDshFont, lang: UI_LANG, compact: true }),
                h(Btn, { disabled: configured === null || toolBusy, onClick: () => setConnOpen(true) }, t("conn.button")),
                h(Btn, { disabled: demo || toolBusy, onClick: () => importOpen ? backToSchedule() : setTool("import") }, t("import.open")),
                h(Btn, { disabled: demo || configured !== true || toolBusy, onClick: () => availabilityOpen ? backToSchedule() : showAvailability() }, availabilityLabel),
                refresh,
                h(Btn, { variant: "primary", disabled: demo || toolBusy, onClick: () => createAt(anchor) }, t("action.new"))
            ) : null;
            const topbar = !compact ? h("header", { className: clsx(styles.topbar, "dsh-header"), "data-dsh-header": "" },
                h("div", { className: clsx(styles.brand, "dsh-header-brand") },
                    h("span", { className: clsx(styles.brandMark, "dsh-header-badge") }, h(CalendarIcon)),
                    h("h1", { className: "dsh-header-title" }, t("section.title"))
                ),
                h(Segments, {
                    id: workspaceId, label: t("section.title"), value: tool, disabled: toolBusy,
                    "data-tour": "calendar-workspace-tabs",
                    items: [
                        { value: "schedule", label: calendarText("日程", "Schedule") },
                        { value: "availability", label: calendarText("找空闲时段", "Free time"), disabled: demo || configured === null },
                        { value: "import", label: t("import.open"), disabled: demo },
                        { value: "connection", label: calendarText("日历连接", "CalDAV"), disabled: configured === null }
                    ],
                    onChange: next => next === "availability" ? showAvailability() : setTool(next)
                }),
                h("div", { className: clsx(styles.topActions, "dsh-header-actions") },
                    h("span", { className: styles.zone }, Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"),
                    h(Btn, {
                        ref: triggerRef,
                        variant: "ghost",
                        className: styles.tourTrigger,
                        "data-tour-trigger": "",
                        "data-calendar-tour-trigger": "",
                        "aria-label": calendarText("使用引导", "Interactive guide"),
                        "aria-expanded": Boolean(tour.open && !layerOpen),
                        title: calendarText("使用引导", "Interactive guide"),
                        onClick: () => (tour.open && !layerOpen ? closeTour(true) : setTour({ open: true, step: 0, manual: true }))
                    }, calendarText("? 引导", "? Tour")),
                    workbench ? h(Btn, {
                        className: styles.commandTrigger, icon: "search", disabled: toolBusy,
                        "aria-label": quickLabel, title: quickLabel + " (" + quickKey + ")",
                        onClick: () => setUtility("commands"), "aria-keyshortcuts": "Control+Shift+K Meta+Shift+K"
                    }, h("kbd", { className: styles.triggerKey }, compactQuickKey)) : null,
                    h(Btn, { variant: "primary", icon: "plus", "data-tour": "calendar-new-event", disabled: !canCreate, onClick: startDraft }, t("action.new")),
                    h(StyleSwitcher, { style: dshStyle, font: dshFont, onChange: setDshStyle, onFontChange: setDshFont, lang: UI_LANG, compact: true }),
                    workbench ? h(CalendarLayoutPicker, { layout, options: layoutOptions, onChange: selectLayout }) : null,
                    workbench ? h(CalendarPalettePicker, { palette, dark, onChange: selectPalette }) : null
                )
            ) : null;

            const renderCalendar = () => {
                if (!demo && configured === false) {
                    return h(EmptyState, {
                        title: t("state.notConfigured"),
                        action: h(React.Fragment, null,
                            h(Btn, { variant: "primary", onClick: () => setConnOpen(true) }, t("conn.button")),
                            h(Btn, { onClick: () => setDemo(true) }, t("action.demo"))
                        )
                    }, h("p", null, t("state.notConfiguredHint")));
                }
                if (configured === null || (data.loading && data.events.length === 0)) {
                    return h("div", { className: styles["dshc-grid"], role: "status", "aria-busy": true, "aria-label": t("state.loading") },
                        Array.from({ length: configured === null ? 7 : 14 }, (_, key) =>
                            h("div", { className: clsx(styles["dshc-skel"], "dsh-skeleton"), "data-dsh-skeleton": "rect", "data-animated": "true", key })));
                }
                const calendarProps = { anchor, events: visibleEvents, conflicted, onPick: openEvent, onCreateAt: createAt };
                const calendar = view === "week"
                    ? h(WeekView, { ...calendarProps, onReschedule: demo ? undefined : reschedule })
                    : view === "agenda" ? h(AgendaView, calendarProps) : h(MonthView, calendarProps);
                const message = !demo && !showCalendar
                    ? calendarText("当前日历已隐藏。", "The connected calendar is hidden.")
                    : !demo && view !== "agenda" && !data.loading && data.events.length === 0 && !data.error
                        ? calendarText("这段时间没有日程。点日期格或「新建日程」开始。", "Nothing scheduled in this range. Click a date or use New event.")
                        : null;
                return h(React.Fragment, null,
                    message ? h("p", { className: styles["dshc-emptyhint"], role: "status" }, message) : null,
                    calendar
                );
            };
            const schedule = tool === "schedule" ? h(ScheduleLayout, {
                resizable: workbench && !compact,
                rail: compact ? null : h(ScheduleRail, {
                    id: viewId + "-sidebar",
                    anchor, onPick: setAnchor, source, showing: showCalendar, onVisibilityChange: setShowCalendar,
                    conflicts, overlap, workbench, loading: configured === null,
                    onReviewConflicts: workbench ? reviewConflicts : undefined
                })
            },
                h("div", { className: styles.scheduleMain },
                    compact ? null : h("div", { className: styles.calendarToolbar }, period,
                        h("div", { className: styles.period, "data-tour": "calendar-views" }, views,
                            workbench && conflicts > 0 ? h(Btn, {
                                className: styles.toolbarConflicts, icon: "warning", onClick: reviewConflicts
                            }, calendarText("查看日程冲突", "Review conflicts")) : null,
                            refresh)),
                    data.error && !demo && configured !== false ? h("div", { className: clsx(styles["dshc-alert"], styles.error), role: "alert" },
                        backendMessage(data.error) || t("error.load"),
                        h("span", { className: styles["dshc-spacer"] }),
                        h(Btn, { onClick: reload }, t("action.retry"))
                    ) : null,
                    !compact ? h(TodayFocusRibbon, {
                        events: visibleEvents,
                        conflicts,
                        canCreate,
                        configured,
                        demo,
                        onJumpToday: () => setAnchor(new Date()),
                        onOpenEvent: openEvent,
                        onReviewConflicts: reviewConflicts,
                        onCreate: startDraft
                    }) : null,
                    h("div", { className: styles.calendarSurface },
                        h("div", { id: viewId + "-" + view + "-panel", className: "dsh-tab-panel", role: "tabpanel", "aria-labelledby": viewId + "-" + view }, renderCalendar())
                    ),
                    h("footer", { className: styles["dshc-footer"] },
                        h("span", null, t("count.events", { n: visibleEvents.length }) +
                            (visibleEvents.some(event => event.isOccurrence) ? " · " + t("count.occurrences", { n: visibleEvents.filter(event => event.isOccurrence).length }) : "")),
                        workbench ? h(CalendarShortcutHints, { quickKey }) : null,
                        compact && source ? h("span", null, t("conn.current", { summary: source })) : null
                    )
                )
            ) : null;
            const workspacePage = importOpen
                ? h(IcsImportPanel, { onBusy: setImportBusy, onClose: backToSchedule, onConnection: () => setConnOpen(true), onImported: reload })
                : availabilityOpen ? h(AvailabilityPanel, {
                    anchor, onBusy: setAvailabilityBusy, onClose: backToSchedule,
                    onChoose: slot => {
                        backToSchedule();
                        setAnchor(new Date(slot.start));
                        setConfirmDelete(false);
                        setFormError(null);
                        setDraft(draftOfEvent({ start: slot.start, end: slot.end, allDay: false }));
                    }
                }) : connectionOpen ? h(ConnectionForm, {
                    inline: true, connection: conn, onClose: backToSchedule, onSaved: finishConnection, onBusy: setConnectionBusy
                }) : schedule;
            const original = draft?.uid && !draft.isSeries ? data.events.find(event => event.uid === draft.uid) : undefined;
            const page = h("section", {
                ref: rootRef, className: clsx(styles["dshc-root"], workbench && LAYOUT_CLASSES[layout]),
                "data-main": workbench, "data-compact": compact, "data-calendar-layout": workbench ? (layout === "cards" ? "bento" : layout) : undefined, "data-dsh-style": dshStyle, "data-dsh-font": dshFont, style: appearance,
                onPointerMove: workbench ? moveCalendarSpotlight : undefined,
                tabIndex: workbench ? 0 : undefined, onKeyDown: workbench ? onWorkbenchKeyDown : undefined
            },
                h("div", { className: styles["dshc-shell"] },
                    topbar, compactToolbar,
                    banner ? h("div", { className: styles["dshc-alert"], role: "status" }, banner) : null,
                    undo ? h("div", { className: styles["dshc-undo"], role: "status", "data-window-drag-exclude": "" },
                        h("span", null, t("move.saved") + " · " + (undo.summary || "")),
                        h(Btn, { onClick: undoMove }, t("move.undo"))
                    ) : null,
                    demo ? h("div", { className: clsx(styles["dshc-alert"], styles.demo) }, t("demo.banner")) : null,
                    compact ? workspacePage : h("div", { className: styles.workspacePanel,
                        id: workspaceId + "-" + tool + "-panel", role: "tabpanel", "aria-labelledby": workspaceId + "-" + tool
                    }, workspacePage),
                    workbench && typeof __stardustUpdatesFooter === "function"
                        ? __stardustUpdatesFooter(React, "dsh-calendar") : null
                ),
                !compact && !layerOpen && tour.open ? h(CoachmarkTour, {
                    rootRef,
                    steps: tourSteps,
                    step: tour.step,
                    manual: tour.manual,
                    style: dshStyle,
                    font: dshFont,
                    appearance,
                    lang: UI_LANG,
                    activeKey: tool + ":" + view,
                    layout: tourLayout,
                    setLayout: setTourLayout,
                    onStep: (nextStep, isManual) => setTour({ open: true, step: nextStep, manual: Boolean(isManual) }),
                    onClose: closeTour,
                    onCopyPrompt: async promptText => {
                        const ok = await copyText(promptText);
                        if (ok) notify(calendarText("已复制对话指令，可直接粘贴到聊天框", "Copied prompt — paste it into chat"));
                        return ok;
                    }
                }) : null,
                selected ? h(EventReview, {
                    event: selected, readOnly: demo, events: data.events, busy, confirmDelete, setConfirmDelete,
                    onClose: closeReview, onEdit: editEvent, onDelete: remove
                }) : null,
                draft ? h(EventForm, {
                    draft, events: eventsWithMoves, busy, error: formError, source, original,
                    onCancel: closeDraft, onSubmit: submit, onDelete: remove, confirmDelete, setConfirmDelete
                }) : null,
                utility === "commands" ? h(CalendarCommands, { actions: commandActions, onClose: () => setUtility(null) }) : null,
                utility === "conflicts" ? h(CalendarConflicts, {
                    events: conflicted, onPick: openEvent, onClose: () => setUtility(null)
                }) : null,
                connOpen ? h(ConnectionForm, { connection: conn, onClose: () => setConnOpen(false), onSaved: finishConnection }) : null
            );
            return workbench ? h(getCalendarAppearanceContext().Provider, { value: appearance }, page) : page;
        }
        /** 月份平移：先跳到本月 1 号再加月，避免 1 月 31 日 +1 个月变成 3 月 3 日。 */
        function addMonthShift(date, delta) {
            const first = new Date(date.getFullYear(), date.getMonth(), 1);
            const shifted = new Date(first.getFullYear(), first.getMonth() + delta, 1);
            const lastDay = new Date(shifted.getFullYear(), shifted.getMonth() + 1, 0).getDate();
            return new Date(shifted.getFullYear(), shifted.getMonth(), Math.min(date.getDate(), lastDay));
        }
        /** 设置页里的那一节。 */
        function CalendarSection({ workbench = false } = {}) { return h(CalendarPanel, { workbench }); }
        /** 对话页右下角的小按钮 + 悬浮面板（自己挂 root，不占用宿主槽位）。 */
        function Launcher() {
            const [activePanel, setActivePanel] = useState(null);
            useEffect(() => {
                let layout;
                try { layout = calendarHostContext?.get?.("layout") || calendarHostContext?.layout; } catch {}
                const panelInfo = layout?.panelInfo;
                if (!panelInfo) return;
                const update = () => setActivePanel(panelInfo.getSnapshot().activePanelId);
                update();
                return panelInfo.subscribe(update);
            }, []);
            useUILanguage();
            const [dshStyle] = useDshStyle(React);
            const [dshFont] = useDshFont(React);
            const [open, setOpen] = useState(false);
            const [layerOpen, setLayerOpen] = useState(false);
            useEffect(() => {
                if (open !== true)
                    return () => { };
                const onKey = (event) => {
                    if (event.key !== "Escape" || event.isComposing === true || event.defaultPrevented)
                        return;
                    // 浮层交给 CalendarPanel 的层栈；宿主 Portal 的 Esc 交给宿主组件。
                    if (layerOpen === true)
                        return;
                    setOpen(false);
                };
                document.addEventListener("keydown", onKey);
                return () => document.removeEventListener("keydown", onKey);
            }, [open, layerOpen]);
            if (activePanel) return null;
            return h("div", null,
                h("button", {
                    type: "button",
                    className: styles["dshc-fab"],
                    "data-dsh-style": dshStyle,
                    "data-dsh-font": dshFont,
                    "data-window-drag-exclude": "",
                    "aria-expanded": open,
                    title: t("nav.title"),
                    "aria-label": t("nav.title"),
                    onClick: () => setOpen((value) => !value)
                }, h(CalendarIcon, { size: 18 })),
                open === true ? h("div", { className: styles["dshc-float"], "data-dsh-style": dshStyle, "data-dsh-font": dshFont, "data-window-drag-exclude": "" }, h(CalendarPanel, { compact: true, onLayerChange: setLayerOpen })) : null
            );
        }
        // ───────────────────────────── 挂载 ─────────────────────────────
        const inject = ["slots", "locale"];
        function apply(ctx) {
            calendarHostContext = ctx;
            const id = "dsh-calendar.workbench";
            ctx.slots.inject("main", () => ctx.slots.register({
                name: "main", key: id, inject: () => ({ workbench: true })
            }, CalendarSection));
            ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
                name: "sidebar.panellist", id, order: 58, label: () => t("nav.title")
            }, CalendarIcon));

            // 语言要在任何 t() 之前定下来（与 dsh-email 同款契约）。
            try {
                ctx.effect(() => subscribeLocale(ctx), "dsh-calendar: locale");
            }
            catch (e) { /* 没有 effect 的宿主不该拖垮面板 */ }
            try {
                ctx.effect(() => {
                    const id = "dsh-calendar/client";
                    if (document.querySelector('style[data-plugin-css="' + id + '"]'))
                        return () => { };
                    const style = document.createElement("style");
                    style.dataset.plugin = "dsh-calendar";
                    style.dataset.pluginCss = id;
                    style.textContent = CSS;
                    document.head.appendChild(style);
                    return () => { style.remove(); };
                }, "dsh-calendar: styles");
            }
            catch (e) { /* 无 DOM 环境（纯 node 侧冒烟）时跳过 */ }
            try {
                ctx.slots.inject("settings.section", () => ctx.slots.register({
                    name: "settings.section",
                    id: "dsh-calendar",
                    order: 50,
                    label: () => {
                        let lang = UI_LANG;
                        try {
                            if (activeLocaleService?.getSnapshot)
                                lang = localeToLang(activeLocaleService.getSnapshot().active);
                        }
                        catch { }
                        return UI[lang]["nav.title"];
                    },
                    inject: () => ({})
                }, CalendarSection));
            }
            catch (e) { /* 没有 slots 服务：仍是合法的插件，只是没有设置页 */ }
            try {
                ctx.effect(() => mountLauncher(), "dsh-calendar: floating panel");
            }
            catch (e) { /* 同上 */ }
        }
        /** 把悬浮面板挂到页面上；已经挂过（HMR / 重复 apply）就复用。 */
        function mountLauncher() {
            if (typeof document === "undefined" || document.body === null)
                return () => { };
            if (document.getElementById("dsh-calendar-root") !== null)
                return () => { };
            const host = document.createElement("div");
            host.id = "dsh-calendar-root";
            document.body.appendChild(host);
            let root = null;
            try {
                const ReactDomClient = require("react-dom/client");
                root = ReactDomClient.createRoot(host);
                root.render(h(Launcher, {}));
            }
            catch (e) {
                // 老宿主没有 react-dom/client 时不要静默留下一个空气泡：整个按钮一起撤掉。
                host.remove();
                return () => { };
            }
            return () => {
                try {
                    if (root !== null)
                        root.unmount();
                }
                catch (e) { /* 卸载失败也要把节点摘掉 */ }
                host.remove();
            };
        }
        relocalize = () => { for (const update of languageListeners)
            update(); };
        exports.apply = apply;
        exports.inject = inject;
        return module.exports;
    } });
