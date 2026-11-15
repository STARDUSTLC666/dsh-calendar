function AvailabilityPanel({ anchor, onChoose, onClose, onBusy }) {
    const text = calendarText;
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const [form, setForm] = useState(() => {
        const now = new Date();
        const start = anchor > now ? anchor : now;
        return {
            from: dayKey(start), to: dayKey(addDays(start, 6)),
            durationMinutes: "60", workStart: "09:00", workEnd: "18:00",
            bufferMinutes: "0", weekdays: [1, 2, 3, 4, 5]
        };
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const active = useRef({ id: 0, controller: null });

    useEffect(() => {
        onBusy(busy);
        return () => onBusy(false);
    }, [busy, onBusy]);
    useEffect(() => () => {
        active.current.id++;
        active.current.controller?.abort();
    }, []);

    function cancel() {
        active.current.id++;
        active.current.controller?.abort();
        active.current.controller = null;
        setBusy(false);
    }
    function close() {
        cancel();
        onClose();
    }
    function update(fields) {
        cancel();
        setForm(value => ({ ...value, ...fields }));
        setResult(null);
        setError("");
    }
    async function search(event) {
        event.preventDefault();
        cancel();
        const controller = new AbortController();
        const id = ++active.current.id;
        active.current.controller = controller;
        setBusy(true);
        setError("");
        setResult(null);
        try {
            const start = new Date(form.from + "T00:00:00");
            const end = new Date(form.to + "T00:00:00");
            end.setDate(end.getDate() + 1);
            if (dayKey(new Date()) === form.from) start.setTime(Math.max(start.getTime(), Date.now()));
            const value = await api("availability", {
                start: start.toISOString(), end: end.toISOString(), timeZone: zone,
                durationMinutes: Number(form.durationMinutes), workStart: form.workStart,
                workEnd: form.workEnd, weekdays: form.weekdays, bufferMinutes: Number(form.bufferMinutes), limit: 20
            }, controller.signal);
            if (active.current.id === id) setResult(value);
        } catch (e) {
            if (active.current.id === id && !controller.signal.aborted) {
                const message = e?.message || String(e);
                setError(UI_LANG === "en" && /范围|31 天/.test(message) ? "Choose an increasing date range of up to 31 days." : backendMessage(e));
            }
        } finally {
            if (active.current.id === id) {
                active.current.controller = null;
                setBusy(false);
            }
        }
    }

    const title = text("找空闲时段", "Find available time");
    const field = (name, label, type, limits) => h("label", { key: name, className: styles["dshc-field"] },
        h("span", null, label),
        h(Txt, { type, value: form[name], disabled: busy, required: true, ...limits, onChange: event => update({ [name]: event.target.value }) })
    );
    const formatter = useMemo(() => new Intl.DateTimeFormat(UI_LANG === "en" ? "en-US" : "zh-CN", {
        timeZone: zone, year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "shortOffset"
    }), [UI_LANG, zone]);
    const format = iso => formatter.format(new Date(iso));

    return h("section", {
        className: styles.workspacePage, "aria-label": title, "aria-busy": busy,
        onKeyDown: event => {
            if (event.key !== "Escape" || event.isComposing) return;
            event.preventDefault();
            event.stopPropagation();
            close();
        }
    }, h("div", { className: styles.pageInner },
        h("div", { className: styles.pageHeader },
            h("h2", { className: styles.pageHeading }, title),
            h(IconButton, { icon: "close", label: text("关闭", "Close"), onClick: close })
        ),
        h("p", { className: styles.pageIntro }, text(
            "按当前连接的日历查找，不代表其他日历或参会者空闲。选择候选只填写新建草稿。",
            "Checks the connected calendar, not other calendars or attendees. Choosing a time only fills a new-event draft."
        )),
        h("form", { className: styles.card, onSubmit: search },
            h("div", { className: styles.formGrid },
                field("from", text("开始日期", "Start date"), "date"),
                field("to", text("结束日期（包含当天）", "End date (inclusive)"), "date"),
                field("durationMinutes", text("日程时长（分钟）", "Duration (minutes)"), "number", { min: 5, max: 480, step: 1 }),
                field("bufferMinutes", text("定时日程前后缓冲（分钟）", "Buffer around timed events (minutes)"), "number", { min: 0, max: 120, step: 1 }),
                field("workStart", text("工作开始", "Work starts"), "time"),
                field("workEnd", text("工作结束", "Work ends"), "time")
            ),
            h("fieldset", { className: styles.availabilityFieldset, disabled: busy },
                h("legend", null, text("工作日", "Working days")),
                h("div", { className: styles.availabilityDays }, WEEKDAYS_ZH.map((_, index) => {
                    const day = index + 1;
                    return h(Chk, {
                        key: day, label: weekDayLabel(index), disabled: busy, checked: form.weekdays.includes(day),
                        onChange: checked => update({ weekdays: checked ? [...form.weekdays, day] : form.weekdays.filter(value => value !== day) })
                    });
                }))
            ),
            h("div", { className: styles.cardToolbar },
                h("p", { className: styles["dshc-sub"] }, text("查询与显示时区：", "Search and display time zone: ") + zone),
                h("div", { className: styles["dshc-actions"] },
                    busy ? h(Btn, { onClick: cancel }, text("取消查询", "Cancel search")) : null,
                    h(Btn, { type: "submit", variant: "primary", disabled: busy }, busy ? text("正在查询…", "Searching…") : text("查找空闲", "Find times"))
                )
            )
        ),
        error ? h("p", { className: clsx(styles["dshc-alert"], styles.error), role: "alert" }, error) : null,
        result ? h("div", { className: styles.card, "aria-live": "polite" },
            h("p", { className: styles["dshc-sub"] }, text("读取于 ", "Checked at ") + format(result.checkedAt) +
                text("，已核对 ", " · Checked ") + result.busyEventCount +
                text(" 个占用日程。候选尚未预约，可相互重叠。", " busy events. Candidates are not reserved and may overlap.")),
            result.count ? h("ol", { className: styles.slotGrid }, result.slots.map(slot => h("li", { className: styles.slotCard, key: slot.start },
                h("span", { className: styles.slotRange }, format(slot.start) + " — " + format(slot.end)),
                h(Btn, { variant: "primary", onClick: () => onChoose(slot) }, text("用此时段新建", "Create with this time"))
            ))) : h("p", { role: "status" }, text(
                "查询范围内没有符合条件的空闲时段。可缩短时长、减少缓冲或调整工作时间后重试。",
                "No available times match. Try a shorter duration, less buffer or different working hours."
            )),
            result.hasMore ? h("p", { className: styles["dshc-sub"] }, text("仅显示最早 20 个候选，可缩小日期范围后再查。", "Showing the earliest 20 candidates. Narrow the date range to refine the results.")) : null
        ) : null
    ));
}
