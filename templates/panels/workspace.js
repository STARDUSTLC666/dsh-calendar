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
