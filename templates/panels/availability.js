function pickDistinctAvailabilitySlots(slots, maxCount = 6) {
    const picked = [];
    let lastEnd = -Infinity;
    for (const slot of slots) {
        const startMs = Date.parse(slot.start);
        const endMs = Date.parse(slot.end);
        if (startMs >= lastEnd) {
            picked.push(slot);
            lastEnd = endMs;
            if (picked.length >= maxCount) break;
        }
    }
    return picked.length ? picked : slots.slice(0, maxCount);
}

function formatAvailabilityShareSummary(slots, { durationMinutes, zone, lang }) {
    const chosen = pickDistinctAvailabilitySlots(slots, 6);
    const isEn = lang === "en";
    const dayFmt = new Intl.DateTimeFormat(isEn ? "en-US" : "zh-CN", {
        timeZone: zone, year: "numeric", month: "short", day: "numeric", weekday: "short"
    });
    const clockFmt = new Intl.DateTimeFormat(isEn ? "en-US" : "zh-CN", {
        timeZone: zone, hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    });
    const lines = chosen.map(slot => {
        const start = new Date(slot.start);
        const end = new Date(slot.end);
        const startDay = dayFmt.format(start);
        const endDay = dayFmt.format(end);
        const range = startDay === endDay
            ? startDay + " " + clockFmt.format(start) + "–" + clockFmt.format(end)
            : startDay + " " + clockFmt.format(start) + " – " + endDay + " " + clockFmt.format(end);
        return "• " + range;
    });
    const header = isEn
        ? "Available meeting slots (" + durationMinutes + " min, " + zone + "):"
        : "可选空闲时段（时长 " + durationMinutes + " 分钟，时区 " + zone + "）：";
    const footer = isEn
        ? "Let me know which time works best and I will send a calendar invite."
        : "请看以上哪个时间方便？确认后我来发日历邀请。";
    return [header, ...lines, footer].join("\n");
}

function AvailabilityPanel({ anchor, onChoose, onClose, onBusy }) {
    const formId = typeof useId === "function" ? useId() : "dshc-avail";
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
    const [copiedSummary, setCopiedSummary] = useState(false);
    const [copyStatus, setCopyStatus] = useState("");
    const active = useRef({ id: 0, controller: null });
    const copyTimer = useRef(null);
    const lastCopyMsg = useRef("");

    useEffect(() => {
        onBusy(busy);
        return () => onBusy(false);
    }, [busy, onBusy]);
    useEffect(() => () => {
        active.current.id++;
        active.current.controller?.abort();
        if (copyTimer.current) clearTimeout(copyTimer.current);
    }, []);

    function clearCopyFeedback() {
        if (copyTimer.current) clearTimeout(copyTimer.current);
        setCopiedSummary(false);
        setCopyStatus("");
    }
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
        clearCopyFeedback();
        setForm(value => ({ ...value, ...fields }));
        setResult(null);
        setError("");
    }
    async function copySummary() {
        if (!result?.slots?.length) return;
        const summary = formatAvailabilityShareSummary(result.slots, {
            durationMinutes: form.durationMinutes,
            zone,
            lang: UI_LANG
        });
        const ok = await copyText(summary);
        if (copyTimer.current) clearTimeout(copyTimer.current);
        let msg = ok
            ? text("已复制，可直接粘贴到微信、钉钉、Slack 或邮件。", "Copied — ready to paste into chat or email.")
            : text("无法访问剪贴板，请手动复制时段。", "Clipboard access unavailable.");
        if (msg === lastCopyMsg.current) msg += "\u00A0";
        lastCopyMsg.current = msg;
        setCopiedSummary(ok);
        setCopyStatus(msg);
        copyTimer.current = setTimeout(() => {
            setCopiedSummary(false);
            setCopyStatus("");
        }, 2200);
    }
    async function search(event) {
        event.preventDefault();
        cancel();
        clearCopyFeedback();
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
    const field = (name, label, type, limits) => {
        const inputId = formId + "-" + name;
        return h("div", { key: name, className: styles["dshc-field"] },
            h("label", { htmlFor: inputId }, label),
            h(Txt, { id: inputId, name, type, value: form[name], disabled: busy, required: true, ...limits, onChange: event => update({ [name]: event.target.value }) })
        );
    };
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
            h("h2", { className: styles.pageHeading, "data-dsh-serif": "" }, title),
            h(IconButton, { icon: "close", label: text("关闭", "Close"), onClick: close })
        ),
        h("p", { className: styles.pageIntro }, text(
            "按当前连接的日历查找，不代表其他日历或参会者空闲。选择候选只填写新建草稿。",
            "Checks the connected calendar, not other calendars or attendees. Choosing a time only fills a new-event draft."
        )),
        h("form", { className: styles.card, "data-dsh-card": "", onSubmit: search },
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
        busy && !result ? h("div", { className: styles.card, "data-dsh-card": "" },
            renderDshSkeleton(React, { variant: "card", label: text("正在查询…", "Searching…") })) : null,
        result ? h("div", { className: styles.card, "data-dsh-card": "", "aria-live": "polite" },
            h("div", { className: styles.cardToolbar },
                h("p", { className: styles["dshc-sub"] }, text("读取于 ", "Checked at ") + format(result.checkedAt) +
                    text("，已核对 ", " · Checked ") + result.busyEventCount +
                    text(" 个占用日程。候选尚未预约，可相互重叠。", " busy events. Candidates are not reserved and may overlap.")),
                result.count ? h("div", { className: styles.copyRow },
                    h(Btn, {
                        icon: copiedSummary ? "check" : "copy",
                        "data-copied": copiedSummary ? "true" : undefined,
                        onClick: copySummary
                    }, copiedSummary ? text("已复制空闲时段文案", "Copied free slots summary") : text("复制空闲时段文案", "Copy free slots summary")),
                    h("span", { className: styles.copyStatus, role: "status" }, copyStatus)
                ) : null
            ),
            result.count ? h("ol", { className: styles.slotGrid }, result.slots.map(slot => h("li", { className: styles.slotCard, "data-dsh-card": "", key: slot.start },
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
