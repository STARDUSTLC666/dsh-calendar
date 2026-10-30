# 找空闲时段

1. 从 DSH 侧栏打开「日历」，先连接并测试自己的 CalDAV 日历。
2. 点击「找空闲时段」，选择起止日期、日程时长、每天的工作时间和工作日；按需设置定时日程前后缓冲。
3. 点击「查找空闲」。页面明确显示浏览器时区、读取时间与占用日程数量。修改条件会清除旧候选；查询中可取消。
4. 点击「用此时段新建」，只会填写原有日程草稿。补充标题、地点等内容并核对时间，再明确保存；关闭草稿不会创建日程。

草稿会显示实际日期、钟点和 UTC 偏移。未修改的起止时间分别保留候选的绝对时间，夏令时回拨也不会把第二次出现的钟点换成第一次。修改日期或某一端钟点后，该端按浏览器普通日期规则重新换算，请核对显示的实际时段。

查询最多 31 天，时长 5–480 分钟，缓冲 0–120 分钟。界面按浏览器时区解释工作时间、全天日期和未指定时区的浮动日程；已带 TZID / UTC 的原日程保留其时区。时长按实际经过分钟计算，夏令时变化可能使本地钟点差不同。每天只提供一个不跨日的工作窗口，候选也不跨本地日期。默认周一至周五 09:00–18:00，每 15 分钟一个候选，展示最早 20 个；候选可以相互重叠，数量达到上限会说明。

只读取当前连接的一个日历集合，不查询参会者、其他日历或资源的忙闲。读取时间之后日程仍可能变化，候选不是预约；保存前请核对当前日程。透明（`TRANSP:TRANSPARENT`）及取消的日程不占用时间，全天结束日期不包含在事件内；未写结束日期的全天事件按一天计算。缓冲只应用于定时占用事件。

完整展开重复系列及改期 / 取消例外，并保留查询开始前已开始、但仍与窗口重叠的实例。日历资源缺失或不合法、无法识别时区、展开截断或超过预算时，查询会失败，不用部分列表推断空闲。当前不支持 `RANGE=THISANDFUTURE`、PERIOD 类型 RDATE 或浮动的重复结束时间；请先在原日历明确或拆分这些规则。

单次最多读取 1000 个资源、总计 8 MiB；单资源最多 512 KiB、2000 个例外 / 实例；总计最多 10000 个展开日程。查询有 20 秒期限，每个系列最多 100000 次迭代。超限可缩小日期范围后重试。

对话中可要求：“找下周工作日一小时的空闲，工作时间 09:00–18:00，前后留 15 分钟，先列候选，不要创建。”`calendar_find_time` 使用相同连接与计算，要求带时区的 `start`、`end` 及 IANA `timeZone`，不会创建、修改日程或发送邀请。

协议语义参考 [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545)。

## 验证范围

Windows 本地 225 项测试通过，包括夏令时、UTC 偏移、全天边界、透明 / 取消、重复改期、查询边界重叠、预算、取消、旧响应保护及候选绝对时间保留。真实回环 HTTP CalDAV 服务器验证了 calendar-query / calendar-multiget、无 `.ics` 后缀资源、损坏响应拒绝与取消。

官方 DSH 0.2.1-rc.5、0.2.2-alpha.2 中，每版覆盖中英文与桌面 / 390px 窄屏操作：查询、无结果、候选进入草稿、取消不写入、明确保存后本机 PUT，另检查不同浏览器时区。20 个插件均加载为 active。测试账号和日历均为模拟数据；没有真实日历服务账号、Electron 原生窗口或模型自主选择工具的验收。

## English

Open **Calendar → Find available time**, set dates, duration, working hours/days and optional buffers, then choose **Find times**. The page shows the browser time zone and the time of the read. Changed filters clear old candidates; a pending search can be cancelled. **Create with this time** only fills the existing new-event draft. Review its title, dates and details before saving.

The draft shows resolved clock times and UTC offsets. Unchanged endpoints independently preserve their exact candidate instants, including repeated clock times during a DST fold. Editing the date or one clock endpoint resolves that endpoint using the browser's ordinary date rules; review the displayed resolved interval.

Only the connected calendar collection is read. Candidates are not reservations and do not establish availability for other calendars, attendees or resources. Transparent and cancelled events do not block time. All-day end dates are exclusive; an all-day event without an end occupies one local day. Floating times use the query zone, while explicit source zones are preserved. Duration uses elapsed minutes across DST changes. The UI uses the browser zone and one daily working window; candidates do not cross a local date. Defaults: weekdays 09:00–18:00, 60-minute duration, 15-minute candidate spacing, earliest 20 candidates. Alternatives may overlap.

The read-only `calendar_find_time` tool uses the same service. Provide offset-aware `start`/`end` and IANA `timeZone`; optional parameters set duration, hours, weekdays, timed-event buffers, spacing and result limit. It performs no calendar mutation or invitation delivery.

Limits: 31 days; 5–480-minute duration; 0–120-minute buffer; 1000 resources / 8 MiB total; 512 KiB per resource; 2000 recurrence instances per resource and 10000 total; 100000 iterations per series; 20-second deadline. Incomplete/invalid data or exhausted budgets fail explicitly. Ranged recurrence changes, PERIOD RDATE and floating recurrence end times require correction in the source calendar. The feature does not infer free time from a truncated list.

Validation: 225 Windows tests, a real loopback HTTP CalDAV fixture, and official DSH RC.5 / alpha.2 Web profiles in Chinese/English at desktop and 390px widths. Query, no-result, draft-only choice, cancellation and explicit PUT were exercised, including a different browser time zone. All 20 plugins loaded as active. Real provider accounts, the Electron window and autonomous model tool selection were not tested.
