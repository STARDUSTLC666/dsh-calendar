function EventForm({ draft, events, onCancel, onSubmit, busy, error, source, original, onDelete, confirmDelete, setConfirmDelete }) {
    const formId = useId();
    const [form, setForm] = useState(draft);
    // Update protection: dsh-calendar.event
    __stardustUpdatesGuard(React, "dsh-calendar.event", { dirty: JSON.stringify(form) !== JSON.stringify(draft), busy: !!busy });

    useEffect(() => { setForm(draft); }, [draft]);
    const patch = fields => setForm(previous => ({ ...previous, ...fields }));
    const isEdit = draft.uid !== undefined;
    const pseudo = asPseudoEvent(form);
    const conflicts = !pseudo ? [] : events.filter(event => event.uid !== form.uid && overlaps(event, pseudo));
    const canSave = form.summary.trim() !== "" && !!pseudo && Date.parse(pseudo.end) >= Date.parse(pseudo.start);
    const field = (key, label, control) => h("div", { className: styles["dshc-field"] },
        h("label", { htmlFor: formId + "-" + key }, label), control
    );
    const input = (key, label, props) => field(key, label, h(Txt, {
        id: formId + "-" + key, value: form[key], onChange: event => patch({ [key]: event.target.value }), ...props
    }));
    const formatter = useMemo(() => new Intl.DateTimeFormat(UI_LANG === "en" ? "en-US" : "zh-CN", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "shortOffset"
    }), [UI_LANG]);
    const resolvedTime = form.sourceRange && !form.allDay && pseudo ? h("p", { className: styles.draftHint, role: "note" },
        calendarText("实际时段：", "Resolved time: ") +
        [pseudo.start, pseudo.end].map(iso => formatter.format(new Date(iso))).join(" — ") +
        calendarText("。未修改的钟点保留原 UTC 偏移。", " · Unchanged times preserve their original UTC offsets.")
    ) : null;

    const body = h(React.Fragment, null,
        source ? h("p", { className: styles.draftHint }, calendarText("目标日历：", "Target calendar: ") + source) : null,
        draft.isSeries ? h("p", { className: styles["dshc-alert"] }, t("form.series")) : null,
        error ? h("div", { className: clsx(styles["dshc-alert"], styles.error), role: "alert" }, error) : null,
        conflicts.length ? h("div", { className: clsx(styles["dshc-alert"], styles.warn), role: "status" },
            h("div", null,
                h("strong", null, t("conflict.title", { n: conflicts.length })),
                conflicts.slice(0, 3).map(event => h("div", { key: eventKey(event) }, "• " + formatWhen(event) + " " + event.summary)),
                h("div", null, t("conflict.hint"))
            )
        ) : null,
        input("summary", t("field.summary"), { "data-modal-autofocus": true, placeholder: t("form.newTitle") }),
        input("date", t("field.date"), { type: "date" }),
        !form.allDay ? h("div", { className: styles["dshc-two"] },
            input("startTime", t("field.start"), { type: "time" }),
            input("endTime", t("field.end"), { type: "time" })
        ) : null,
        resolvedTime,
        h("div", { className: styles["dshc-field"] }, h(Chk, {
            checked: form.allDay === true, label: t("field.allDay"), onChange: next => patch({ allDay: next })
        })),
        field("repeat", t("field.repeat"), h(Picker, {
            id: formId + "-repeat", label: t("field.repeat"), value: form.repeat,
            options: ["", "daily", "weekly", "monthly", "yearly", "custom"].map(id => ({ id, label: t("repeat." + (id || "none")) })),
            onChange: repeat => patch({ repeat })
        })),
        form.repeat === "custom" ? input("rrule", "RRULE", { placeholder: "FREQ=WEEKLY;COUNT=10" }) : null,
        input("location", t("field.location")),
        field("description", t("field.description"), h("textarea", {
            id: formId + "-description", className: styles["dshc-input"], value: form.description,
            onChange: event => patch({ description: event.target.value })
        })),
        confirmDelete && original ? h("p", { className: clsx(styles["dshc-alert"], styles.warn) },
            t("confirm.delete", { name: original.summary }),
            h(Btn, { variant: "ghost", disabled: busy, onClick: () => setConfirmDelete(false) },
                calendarText("取消删除", "Cancel deletion"))) : null
    );
    const footer = h("div", { className: styles["dshc-actions"] },
        original ? h(CopyEventId, { uid: original.uid }) : null,
        original ? h(DeleteEventButton, { event: original, busy, confirmDelete, setConfirmDelete, onDelete }) : null,
        original ? h("span", { className: styles["dshc-spacer"] }) : null,
        h(Btn, { variant: "ghost", onClick: onCancel, disabled: busy }, t("action.cancel")),
        h(Btn, { variant: "primary", onClick: () => onSubmit(form), disabled: busy || !canSave || confirmDelete, "aria-busy": busy }, busy ? "…" : t("action.save"))
    );
    return h(Dlg, {
        open: true, onClose: onCancel, closeLabel: calendarText("关闭", "Close"),
        title: isEdit ? t("form.editTitle") : t("form.newTitle"), children: body, footer
    });
}

function CopyEventId({ uid }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);
    useEffect(() => () => clearTimeout(timer.current), []);
    return h(Btn, { onClick: async () => {
        if (!await copyText(uid)) return;
        clearTimeout(timer.current);
        setCopied(true);
        timer.current = setTimeout(() => setCopied(false), 1600);
    } }, copied ? t("action.copied") : t("action.copy"));
}

function DeleteEventButton({ event, busy, readOnly, confirmDelete, setConfirmDelete, onDelete }) {
    return confirmDelete
        ? h(Btn, { variant: "danger", disabled: busy || readOnly, onClick: () => onDelete(event) }, t("action.confirmDelete"))
        : h(Btn, { variant: "danger", disabled: busy || readOnly, onClick: () => setConfirmDelete(true) }, t("action.delete"));
}

function EventReview({ event, onClose, onEdit, onDelete, busy, confirmDelete, setConfirmDelete, events, readOnly }) {
    const seriesCount = event.isOccurrence ? events.filter(e => e.uid === event.uid && e.seriesStart === event.seriesStart).length : 0;
    const details = [
        event.rrule && [t("repeat.recurring"), humanRepeat(event.rrule) + " · " + event.rrule],
        event.isOccurrence && !event.rrule && [t("repeat.occurrence"), (seriesCount > 0 ? seriesCount + " / " : "") + t("repeat.occurrence")],
        event.location && [t("field.location"), event.location],
        event.description && [t("field.description"), event.description],
        [t("field.uid"), h("span", { className: styles["dshc-mono"] }, event.uid)]
    ].filter(Boolean);
    const body = h(React.Fragment, null,
        h("div", { className: styles.reviewMeta },
            formatWhen(event), h("span", { className: styles["dshc-tag"] }, formatDuration(event))
        ),
        h("dl", { className: styles["dshc-kv"] }, details.map(([label, value]) => h(React.Fragment, { key: label },
            h("dt", null, label), h("dd", null, value)
        ))),
        confirmDelete ? h("p", { className: clsx(styles["dshc-alert"], styles.warn) },
            t(isRecurring(event) ? "confirm.deleteSeries" : "confirm.delete", { name: event.summary })) : null
    );
    const footer = h("div", { className: styles["dshc-actions"] },
        h(CopyEventId, { uid: event.uid }),
        h("span", { className: styles["dshc-spacer"] }),
        h(DeleteEventButton, { event, busy, readOnly, confirmDelete, setConfirmDelete, onDelete }),
        h(Btn, { variant: "primary", onClick: () => onEdit(event), disabled: busy || readOnly }, t("action.edit"))
    );
    return h(Dlg, {
        open: true, review: true, title: event.summary,
        closeLabel: PRIM?.Modal ? calendarText("关闭", "Close") : "close", onClose, children: body, footer
    });
}
