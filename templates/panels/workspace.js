const CALENDAR_LAYOUT_KEY = "dsh-calendar:layout";
const CALENDAR_RAIL_KEY = "dsh-calendar:rail-width";
const RAIL_MIN_WIDTH = 180;
const RAIL_MAX_WIDTH = 360;
const RAIL_DEFAULT_WIDTH = 236;
const LAYOUT_CLASSES = {
    native: undefined,
    floating: styles.layoutFloating,
    spotlight: styles.layoutSpotlight,
    cards: styles.layoutCards
};

function readCalendarPreference(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
}

function storeCalendarPreference(key, value) {
    try { window.localStorage.setItem(key, String(value)); } catch { /* Private storage is optional. */ }
}

function loadCalendarLayout() {
    const layout = readCalendarPreference(CALENDAR_LAYOUT_KEY);
    return Object.hasOwn(LAYOUT_CLASSES, layout) ? layout : "native";
}

function calendarLayoutOptions() {
    return [
        { id: "native", label: calendarText("DSH 原生", "DSH native") },
        { id: "floating", label: calendarText("Arc 浮岛", "Arc Floating") },
        { id: "spotlight", label: calendarText("Raycast 聚光", "Raycast Spotlight") },
        { id: "cards", label: calendarText("Bento 卡片", "Bento Cards") }
    ];
}

function CalendarLayoutPicker({ layout, options, onChange }) {
    const label = calendarText("布局", "Layout");
    return h(React.Fragment, null,
        h("div", { className: styles.layoutChoices, role: "group", "aria-label": label },
            options.map(option => h(Btn, {
                key: option.id, variant: option.id === layout ? "primary" : "ghost",
                "aria-pressed": option.id === layout, onClick: () => onChange(option.id)
            }, option.label))
        ),
        h("div", { className: styles.layoutDropdown },
            h(Picker, { label, value: layout, compact: true, options, onChange })
        )
    );
}

function CalendarShortcutHints({ quickKey }) {
    const hints = [
        ["W / M / A", calendarText("周 / 月 / 议程", "Week / Month / Agenda")],
        ["N", t("action.new")],
        ["F", calendarText("找空闲时段", "Find available time")],
        [quickKey, calendarText("快捷操作", "Quick actions")]
    ];
    return h("div", { className: styles.shortcutHints },
        hints.map(([keys, label]) => h("span", { key: keys },
            h("kbd", { className: styles.commandKey }, keys), label
        ))
    );
}

function ScheduleLayout({ resizable, rail, children }) {
    const [width, setWidth] = useState(() => {
        const saved = Number(readCalendarPreference(CALENDAR_RAIL_KEY));
        return saved >= RAIL_MIN_WIDTH && saved <= RAIL_MAX_WIDTH ? saved : RAIL_DEFAULT_WIDTH;
    });
    const drag = useRef(null);
    const clampWidth = (value) => Math.min(RAIL_MAX_WIDTH, Math.max(RAIL_MIN_WIDTH, Math.round(value)));
    const commit = (value) => {
        const next = clampWidth(value);
        setWidth(next);
        storeCalendarPreference(CALENDAR_RAIL_KEY, next);
    };
    const pointerWidth = (event, origin) => origin.width + (event.clientX - origin.x) * origin.direction;
    function begin(event) {
        if (event.button !== 0 || drag.current) return;
        const handle = event.currentTarget;
        drag.current = {
            id: event.pointerId, x: event.clientX, savedWidth: width,
            width: handle.previousElementSibling.getBoundingClientRect().width,
            direction: getComputedStyle(handle).direction === "rtl" ? -1 : 1
        };
        handle.setPointerCapture(event.pointerId);
        handle.focus({ preventScroll: true });
    }
    function move(event) {
        const origin = drag.current;
        if (origin?.id === event.pointerId) setWidth(clampWidth(pointerWidth(event, origin)));
    }
    function end(event) {
        const origin = drag.current;
        if (!origin || origin.id !== event.pointerId) return;
        drag.current = null;
        if (event.type === "pointerup") commit(pointerWidth(event, origin));
        else setWidth(origin.savedWidth);
    }
    function resizeWithKey(event) {
        const handle = event.currentTarget;
        const rtl = getComputedStyle(handle).direction === "rtl";
        const current = handle.previousElementSibling.getBoundingClientRect().width;
        const deltas = { ArrowRight: rtl ? -16 : 16, ArrowLeft: rtl ? 16 : -16 };
        if (!Object.hasOwn(deltas, event.key) && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        if (event.key === "Home") commit(RAIL_MIN_WIDTH);
        else if (event.key === "End") commit(RAIL_MAX_WIDTH);
        else commit(current + deltas[event.key]);
    }
    return h("div", {
        className: styles.schedule,
        "data-resizable": resizable ? "" : undefined,
        style: resizable ? { "--calendar-rail-width": width + "px" } : undefined
    },
        rail,
        resizable ? h("div", {
            className: styles.railHandle, role: "separator", tabIndex: 0,
            "aria-label": calendarText("调整日历侧栏宽度", "Resize calendar sidebar"),
            "aria-controls": rail.props.id,
            "aria-orientation": "vertical", "aria-valuemin": RAIL_MIN_WIDTH,
            "aria-valuemax": RAIL_MAX_WIDTH, "aria-valuenow": width,
            onPointerDown: begin, onPointerMove: move, onPointerUp: end, onPointerCancel: end, onLostPointerCapture: end,
            onKeyDown: resizeWithKey
        }) : null,
        children
    );
}

function CalendarCommands({ actions, onClose }) {
    const title = calendarText("日历快捷操作", "Calendar quick actions");
    const searchLabel = calendarText("搜索日历操作", "Search calendar actions");
    const [query, setQuery] = useState("");
    const bodyRef = useRef(null);
    const keyword = query.trim().toLocaleLowerCase();
    const matches = actions.filter(action => action.label.toLocaleLowerCase().includes(keyword));
    const run = (action) => {
        if (!action || action.disabled) return;
        onClose();
        action.run();
    };
    function navigate(event) {
        if (event.isComposing) return;
        const input = bodyRef.current.querySelector("input");
        if (event.target === input && event.key === "Enter") {
            event.preventDefault();
            run(matches.find(action => !action.disabled));
            return;
        }
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        const controls = [input, ...bodyRef.current.querySelectorAll("button:not(:disabled)")];
        const index = controls.indexOf(event.target);
        if (index < 0) return;
        event.preventDefault();
        const next = index + (event.key === "ArrowDown" ? 1 : -1);
        controls[Math.max(0, Math.min(controls.length - 1, next))]?.focus();
    }
    return h(Dlg, {
        open: true, title, onClose, closeLabel: calendarText("关闭", "Close"),
        children: h("div", { className: styles.commandBody, ref: bodyRef, onKeyDown: navigate },
            h(Txt, {
                type: "search", icon: h(Icon, { name: "search" }), value: query,
                "data-modal-autofocus": true, "aria-label": searchLabel, placeholder: searchLabel,
                onChange: event => setQuery(event.target.value)
            }),
            matches.length ? h("div", { className: styles.commandList }, matches.map(action => h(Btn, {
                key: action.id, variant: "ghost", className: styles.commandRow,
                onClick: () => run(action), disabled: action.disabled
            },
                h("span", null, action.label),
                action.key ? h("kbd", { className: styles.commandKey }, action.key.toUpperCase()) : null
            ))) : h("p", { className: styles["dshc-sub"], role: "status" }, calendarText("没有匹配的操作", "No matching actions"))
        )
    });
}

function CalendarConflicts({ events, onPick, onClose }) {
    return h(Dlg, {
        open: true, title: calendarText("日程冲突", "Scheduling conflicts"), onClose, closeLabel: calendarText("关闭", "Close"),
        children: events.size
            ? h("div", { className: styles.conflictList }, sortForDisplay([...events]).map(event => h(Row, {
                key: eventKey(event), event, onClick: () => { onClose(); onPick(event); }
            })))
            : h("p", { className: styles["dshc-sub"], role: "status" }, calendarText("当前范围无冲突", "No conflicts in this range"))
    });
}

function CalendarWorkflowGuide() {
    const [copiedId, setCopiedId] = useState("");
    const [statusText, setStatusText] = useState("");
    const timer = useRef(null);
    const lastMsg = useRef("");

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    const prompts = [
        {
            id: "slots-45",
            label: calendarText("帮我找本周下午两个 45 分钟空闲时段", "Find two 45-minute afternoon slots this week"),
            prompt: calendarText(
                "帮我找本周下午两个 45 分钟空闲时段，工作时间按 13:30–18:00，前后预留 15 分钟缓冲，先列出候选不要直接创建。",
                "Find two 45-minute free slots this week in the afternoon (13:30–18:00) with a 15-minute buffer, and list the candidates first without creating an event."
            )
        },
        {
            id: "today-agenda",
            label: calendarText("汇总今天的会议议程并提醒冲突", "Summarize today's agenda and flag conflicts"),
            prompt: calendarText(
                "汇总今天的会议议程并提醒冲突，按时间顺序列出每场日程的起止时间与地点。",
                "Summarize today's meeting agenda in chronological order with locations, and highlight any scheduling overlaps."
            )
        },
        {
            id: "focus-blocks",
            label: calendarText("梳理下周日程密度与两小时整块空档", "Review next week's load & 2h focus blocks"),
            prompt: calendarText(
                "读取我下周的日历安排，指出会议最密集的一天，并标出可用于深度工作的两小时整块空闲。",
                "Read my schedule for next week, identify the busiest day, and list 2-hour uninterrupted blocks for deep work."
            )
        }
    ];

    async function handleCopy(item) {
        const ok = await copyText(item.prompt);
        if (timer.current) clearTimeout(timer.current);
        let msg = ok
            ? calendarText("已复制对话指令，可直接粘贴到 DSH 对话框。", "Copied prompt — paste it into DSH chat.")
            : calendarText("无法访问剪贴板，请手动复制指令。", "Clipboard access unavailable.");
        if (msg === lastMsg.current) msg += "\u00A0";
        lastMsg.current = msg;
        setCopiedId(ok ? item.id : "");
        setStatusText(msg);
        timer.current = setTimeout(() => {
            setCopiedId("");
            setStatusText("");
        }, 2200);
    }

    return h("details", { className: styles.workflowGuide },
        h("summary", { className: styles.workflowSummary },
            h("span", { className: styles.workflowTitle }, calendarText(
                "三步用起来：连接日历 → 查空档发邀约 → 让助手巡检日程",
                "How it works: Connect calendar → Copy free slots → Ask assistant to review"
            )),
            h("span", { className: styles.workflowBadge }, calendarText("含一键对话指令", "1-click chat prompts"))
        ),
        h("div", { className: styles.workflowBody },
            h("ol", { className: styles.workflowSteps },
                h("li", null, calendarText(
                    "连接日历：在「日历连接」测试并启用 iCloud / Google / Nextcloud / 自建 CalDAV，也可先点「查看示例」。",
                    "Connect calendar: Test and save iCloud, Google, Nextcloud, or CalDAV in Connection, or try the read-only sample first."
                )),
                h("li", null, calendarText(
                    "查空档发邀约：按 F 打开「找空闲时段」，查出候选后点「复制空闲时段文案」一键发到微信、钉钉、Slack 或邮件。",
                    "Share free slots: Press F to open Find available time, then click Copy free slots summary for WeChat, Slack, or email."
                )),
                h("li", null, calendarText(
                    "让助手巡检日程：支持从文字/截图生成草稿，或点击下方指令气泡复制到 DSH 对话框。",
                    "Review with assistant: Extract drafts from text/screenshots, or click a prompt chip below to copy for DSH chat."
                ))
            ),
            h("div", { className: styles.promptRow },
                h("span", { className: styles["dshc-sub"] }, calendarText("点按复制对话指令：", "Copy a chat prompt:")),
                h("div", { className: styles.promptChips }, prompts.map(item => {
                    const isCopied = copiedId === item.id;
                    return h("button", {
                        key: item.id,
                        type: "button",
                        className: styles.promptChip,
                        "data-copied": isCopied ? "true" : undefined,
                        onClick: () => handleCopy(item)
                    },
                        h(Icon, { name: isCopied ? "check" : "copy", size: 13 }),
                        h("span", null, item.label)
                    );
                })),
                h("span", { className: styles.copyStatus, role: "status" }, statusText)
            )
        )
    );
}
