function calendarText(zh, en) {
    return UI_LANG === "en" ? en : zh;
}

const WEEKDAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function weekDayLabel(index) {
    return UI_LANG === "en" ? WEEKDAYS_EN[index] : "周" + WEEKDAYS_ZH[index];
}

function conflictSummary(events) {
    const sorted = events.map(event => ({ event, start: +startDate(event), end: +endDate(event) }))
        .sort((a, b) => a.start - b.start);
    const conflicted = new Set();
    let count = 0;
    let overlap;
    for (const [index, current] of sorted.entries()) {
        for (let i = index + 1; i < sorted.length && sorted[i].start < current.end; i++) {
            const next = sorted[i];
            if (!overlaps(current.event, next.event)) continue;
            count++;
            conflicted.add(current.event);
            conflicted.add(next.event);
            const end = Math.min(current.end, next.end);
            if (!overlap && next.start < end) overlap = {
                start: new Date(next.start), end: new Date(end),
                allDay: current.event.allDay && next.event.allDay
            };
        }
    }
    return { count, conflicted, overlap };
}

function MiniCalendar({ anchor, onPick }) {
    const [browsed, setBrowsed] = useState(null);
    const grid = useRef(null);
    const month = browsed?.anchor === anchor ? browsed.month : anchor;
    const days = monthGridDays(month);
    const today = dayKey(new Date());
    const selected = dayKey(anchor);
    const monthFocus = days.findIndex(day => dayKey(day) === selected);
    const [focused, setFocused] = useState("");
    const focusIndex = days.findIndex(day => dayKey(day) === focused);
    const tabStop = focusIndex >= 0 ? focusIndex : monthFocus >= 0 ? monthFocus : days.findIndex(day => day.getMonth() === month.getMonth());
    const browse = delta => setBrowsed({ anchor, month: addMonths(month, delta) });

    function moveFocus(event, index) {
        const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
        if (!Object.hasOwn(offsets, event.key)) return;
        event.preventDefault();
        const next = index + offsets[event.key];
        grid.current?.querySelectorAll("button")[next]?.focus();
    }

    return h("div", { className: styles.miniCalendar },
        h("div", { className: styles.miniHeading },
            h("h2", null, formatMonthTitle(month)),
            h("div", { className: styles.period },
                h(IconButton, { icon: "left", label: calendarText("上个月", "Previous month"), onClick: () => browse(-1) }),
                h(IconButton, { icon: "right", label: calendarText("下个月", "Next month"), onClick: () => browse(1) })
            )
        ),
        h("div", { className: styles.miniGrid, ref: grid },
            WEEKDAYS_ZH.map((day, index) => h("span", { className: styles.miniWeekday, key: day, title: weekDayLabel(index) }, UI_LANG === "en" ? WEEKDAYS_EN[index].slice(0, 2) : day)),
            days.map((day, index) => {
                const key = dayKey(day);
                return h("button", {
                    key, type: "button", onClick: () => onPick(day), onFocus: () => setFocused(key),
                    className: clsx(styles.miniDay, day.getMonth() !== month.getMonth() && styles.out),
                    "aria-pressed": selected === key, "aria-current": today === key ? "date" : undefined,
                    "aria-label": formatDay(day, { withYear: true }),
                    tabIndex: index === tabStop ? 0 : -1,
                    onKeyDown: event => moveFocus(event, index)
                }, day.getDate());
            })
        )
    );
}

function ScheduleRail({ id, anchor, onPick, source, showing, onVisibilityChange, conflicts, overlap, workbench, loading, onReviewConflicts }) {
    const hasConflicts = conflicts > 0;
    const conflictText = hasConflicts
        ? calendarText(conflicts + " 处时间重叠", conflicts === 1 ? "1 scheduling overlap" : conflicts + " scheduling overlaps")
        : calendarText("当前范围无冲突", "No conflicts in this range");
    return h("aside", { id, className: styles.rail, "aria-label": calendarText("日历侧栏", "Calendar sidebar") },
        h("div", { className: styles.railScroll },
            h(MiniCalendar, { anchor, onPick }),
            h("section", { className: styles.railSection },
                h("h2", null, calendarText("已连接日历", "Connected calendar")),
                h("div", { className: styles.calendarSource }, source
                    ? h(Chk, { checked: showing, label: source, title: source, onChange: onVisibilityChange })
                    : h("p", { className: styles["dshc-sub"] }, loading ? t("state.loading") : calendarText("尚未连接日历", "No calendar connected"))),
                source && showing ? h("div", { className: clsx(styles.conflictCard, hasConflicts && styles.warn) },
                    h(Icon, { name: hasConflicts ? "warning" : "check", size: 14 }),
                    h("div", null,
                        h("span", { role: "status" }, conflictText),
                        workbench && overlap ? h("div", { className: styles.conflictRange }, formatWhen(overlap)) : null,
                        hasConflicts && onReviewConflicts ? h(Btn, {
                            variant: "ghost", className: styles.conflictLink, onClick: onReviewConflicts
                        }, calendarText("查看冲突", "Review conflicts")) : null
                    )
                ) : null
            )
        ),
        workbench ? h("div", { className: styles.railUpdates },
            h(__StardustPluginUpdatesFooter, { React, name: "dsh-calendar" })) : null
    );
}
