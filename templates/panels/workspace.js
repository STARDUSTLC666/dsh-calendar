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

const CALENDAR_TOUR_KEY = "dsh-calendar.tour.v1";
let calendarTourSessionDone = false;

function readCalendarTourDone(storageKey = CALENDAR_TOUR_KEY) {
    if (calendarTourSessionDone && storageKey === CALENDAR_TOUR_KEY) return true;
    try {
        return typeof window !== "undefined" && window.localStorage?.getItem(storageKey) === "done";
    } catch {
        return false;
    }
}

function writeCalendarTourDone(storageKey = CALENDAR_TOUR_KEY) {
    if (storageKey === CALENDAR_TOUR_KEY) calendarTourSessionDone = true;
    try {
        if (typeof window !== "undefined") window.localStorage?.setItem(storageKey, "done");
    } catch { /* ignore */ }
}

function computeTourLayout(target, preferredSide, cardEl) {
    const vw = (typeof window !== "undefined" && window.innerWidth) || 1280;
    const vh = (typeof window !== "undefined" && window.innerHeight) || 800;
    const cw = cardEl?.offsetWidth || 320;
    const ch = cardEl?.offsetHeight || 196;
    const pad = 5;
    const gap = 12;
    const raw = target?.getBoundingClientRect?.();
    if (!target) {
        return {
            spotlight: null,
            side: "center",
            left: Math.max(12, Math.round((vw - cw) / 2)),
            top: Math.max(12, Math.round((vh - ch) / 2)),
            arrowX: 28,
            arrowY: 24
        };
    }
    const hasBox = Boolean(raw && (raw.width > 0 || raw.height > 0));
    const rect = hasBox ? raw : { left: 120, top: 72, width: 140, height: 32 };
    const spotlight = {
        left: Math.round(rect.left - pad),
        top: Math.round(rect.top - pad),
        width: Math.round(rect.width + pad * 2),
        height: Math.round(rect.height + pad * 2)
    };
    const spaceBottom = vh - spotlight.top - spotlight.height;
    const spaceTop = spotlight.top;
    const spaceRight = vw - spotlight.left - spotlight.width;
    const spaceLeft = spotlight.left;
    let side = preferredSide || "bottom";
    if (side === "right" && spaceRight < cw + gap + 12) {
        side = spaceBottom >= ch + gap + 12 ? "bottom" : spaceLeft >= cw + gap + 12 ? "left" : "top";
    } else if (side === "left" && spaceLeft < cw + gap + 12) {
        side = spaceRight >= cw + gap + 12 ? "right" : "bottom";
    } else if (side === "bottom" && spaceBottom < ch + gap + 12 && spaceTop > spaceBottom) {
        side = "top";
    } else if (side === "top" && spaceTop < ch + gap + 12 && spaceBottom > spaceTop) {
        side = "bottom";
    }
    let left = spotlight.left;
    let top = spotlight.top + spotlight.height + gap;
    if (side === "top") top = spotlight.top - ch - gap;
    else if (side === "right") { left = spotlight.left + spotlight.width + gap; top = spotlight.top; }
    else if (side === "left") { left = spotlight.left - cw - gap; top = spotlight.top; }
    left = Math.round(Math.max(12, Math.min(vw - cw - 12, left)));
    top = Math.round(Math.max(12, Math.min(vh - ch - 12, top)));
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return {
        spotlight,
        side,
        left,
        top,
        arrowX: Math.round(Math.max(18, Math.min(cw - 18, centerX - left))),
        arrowY: Math.round(Math.max(18, Math.min(ch - 18, centerY - top)))
    };
}

function CoachmarkTour({ rootRef, steps = [], step = 0, manual = false, style = "harness", appearance, lang = "zh", activeKey = "", layout: rawLayout, setLayout, onStep, onClose, onCopyPrompt }) {
    const activeStyle = normalizeDshStyle(style);
    const layerRef = useRef(null);
    const cardRef = useRef(null);
    const nextBtnRef = useRef(null);
    const copyTimerRef = useRef(null);
    const lastStatusRef = useRef("");
    const [copied, setCopied] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const titleId = (typeof useId === "function" ? useId() : "dsh-calendar-tour") + "-title";
    const isEn = String(lang).startsWith("en");
    const l = (zh, en) => (isEn ? en : zh);
    const current = steps[Math.max(0, Math.min(steps.length - 1, step))] || {};
    const layout = rawLayout && typeof rawLayout === "object" && rawLayout.side
        ? rawLayout
        : { spotlight: null, side: current.side || "bottom", left: 24, top: 76, arrowX: 28, arrowY: 24 };

    useEffect(() => {
        const node = layerRef.current;
        if (!node) return undefined;
        try {
            node.setAttribute?.("popover", "manual");
            node.showPopover?.();
        } catch { /* ignore */ }
        return () => {
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
            try { node.hidePopover?.(); } catch { /* ignore */ }
        };
    }, []);

    useEffect(() => {
        setCopied(false);
        setStatusMsg("");
    }, [step]);

    useEffect(() => {
        function measure() {
            const scope = rootRef?.current || (typeof document !== "undefined" ? document : null);
            if (!scope || typeof scope.querySelector !== "function") return;
            const target = (current.selector && scope.querySelector(current.selector))
                || (current.fallback && scope.querySelector(current.fallback))
                || null;
            setLayout?.(computeTourLayout(target, current.side, cardRef.current));
        }
        measure();
        const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame(measure) : null;
        if (typeof window === "undefined" || typeof window.addEventListener !== "function") {
            return () => { if (raf && typeof cancelAnimationFrame === "function") cancelAnimationFrame(raf); };
        }
        window.addEventListener("resize", measure, { passive: true });
        window.addEventListener("scroll", measure, true);
        return () => {
            if (raf && typeof cancelAnimationFrame === "function") cancelAnimationFrame(raf);
            window.removeEventListener("resize", measure);
            window.removeEventListener("scroll", measure, true);
        };
    }, [step, activeKey, current.selector, current.fallback, current.side]);

    useEffect(() => {
        if (!manual) return;
        (nextBtnRef.current || cardRef.current?.querySelector?.("[data-tour-next]"))?.focus?.();
    }, [manual, step]);

    async function handleCopy() {
        if (!current.prompt) return;
        const ok = onCopyPrompt ? await onCopyPrompt(current.prompt) : await copyText(current.prompt);
        if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        let msg = ok !== false ? l("已复制指令", "Copied prompt") : l("复制失败", "Copy failed");
        if (msg === lastStatusRef.current) msg += "\u00A0";
        lastStatusRef.current = msg;
        setCopied(ok !== false);
        setStatusMsg(msg);
        copyTimerRef.current = setTimeout(() => {
            setCopied(false);
            setStatusMsg("");
        }, 1800);
    }

    const isLast = step >= steps.length - 1;
    function finish() { onClose?.(manual); }
    function onKeyDown(event) {
        if (event.isComposing || event.nativeEvent?.isComposing) return;
        if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); finish(); }
        else if (event.key === "ArrowRight" && !isLast) { event.preventDefault(); onStep?.(step + 1, true); }
        else if (event.key === "ArrowLeft" && step > 0) { event.preventDefault(); onStep?.(step - 1, true); }
    }

    return h("div", {
        ref: layerRef,
        className: styles.tourLayer,
        style: appearance,
        "data-dsh-style": activeStyle,
        "data-calendar-tour": current.id || String(step),
        "data-window-drag-exclude": ""
    },
        layout.spotlight
            ? h("div", {
                className: styles.tourSpotlight,
                "data-tour-spotlight": current.id || String(step),
                "aria-hidden": "true",
                style: {
                    left: layout.spotlight.left + "px",
                    top: layout.spotlight.top + "px",
                    width: layout.spotlight.width + "px",
                    height: layout.spotlight.height + "px"
                }
            })
            : h("div", { className: styles.tourBackdropFallback, "aria-hidden": "true" }),
        h("div", {
            ref: cardRef,
            role: "dialog",
            "aria-modal": "false",
            "aria-labelledby": titleId,
            tabIndex: -1,
            onKeyDown,
            className: styles.tourCard,
            "data-side": layout.side,
            "data-tour-card": current.id || String(step),
            style: {
                left: layout.left + "px",
                top: layout.top + "px",
                "--arrow-x": layout.arrowX + "px",
                "--arrow-y": layout.arrowY + "px"
            }
        },
            h("span", { className: styles.tourArrow, "data-tour-arrow": layout.side, "aria-hidden": "true" }),
            h("div", { className: styles.tourHead },
                h("div", { className: styles.tourStepMeta },
                    h("span", { className: styles.tourStepBadge }, (step + 1) + " / " + steps.length),
                    h("span", { className: styles.tourDots, "aria-hidden": "true" },
                        steps.map((item, idx) => h("span", { key: item.id || idx, className: styles.tourDot, "data-active": idx === step ? "true" : undefined })))),
                h("button", { type: "button", className: styles.tourSkip, onClick: finish }, l("跳过", "Skip"))),
            h("h2", { id: titleId, className: styles.tourTitle }, current.title),
            h("p", { className: styles.tourDesc }, current.desc),
            current.prompt ? h("div", { className: styles.tourInlineAction },
                h(Btn, {
                    variant: "outline",
                    icon: copied ? "check" : "copy",
                    "data-copy-prompt": current.prompt,
                    "data-copied": copied ? "true" : undefined,
                    onClick: () => { void handleCopy(); }
                }, copied ? l("已复制", "Copied") : (current.promptLabel || l("复制对话指令", "Copy prompt"))),
                h("span", { className: styles.copyStatus, role: "status" }, statusMsg)) : null,
            h("div", { className: styles.tourFooter },
                step > 0
                    ? h(Btn, { variant: "ghost", onClick: () => onStep?.(step - 1, true), "data-tour-prev": "" }, l("上一步", "Back"))
                    : h("span", null),
                h("div", { className: styles.tourNav },
                    h(Btn, {
                        ref: nextBtnRef,
                        variant: "primary",
                        "data-tour-next": "",
                        onClick: () => (isLast ? finish() : onStep?.(step + 1, true))
                    }, isLast ? l("完成引导", "Done") : l("下一步", "Next"))))));
}
