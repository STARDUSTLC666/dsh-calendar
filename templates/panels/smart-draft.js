const DSH_CALENDAR_DRAFT_ROUTE = "api/dsh-calendar/draft";
const DSH_CALENDAR_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

function draftImageData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error(calendarText("无法读取截图。", "Could not read the screenshot.")));
        reader.readAsDataURL(file);
    });
}

function CalendarDraftInput({ onFill, onBusy }) {
    const id = useId();
    const [input, setInput] = useState("");
    const [file, setFile] = useState(null);
    const [models, setModels] = useState(null);
    const [selection, setSelection] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const request = useRef(null);
    const fileInput = useRef(null);
    __stardustUpdatesGuard(React, "dsh-calendar.smart-draft", { dirty: !!input.trim() || !!file, busy });

    useEffect(() => {
        const controller = new AbortController();
        api("models", {}, controller.signal, DSH_CALENDAR_DRAFT_ROUTE).then(value => {
            if (!controller.signal.aborted) setModels(value.models);
        }).catch(reason => {
            if (!controller.signal.aborted) {
                setModels([]);
                setError(backendMessage(reason));
            }
        });
        return () => {
            controller.abort();
            request.current?.abort();
            onBusy(false);
        };
    }, [onBusy]);

    const keyOf = model => JSON.stringify([model.provider, model.model]);
    const candidates = (models || []).filter(model => !file || model.image);
    const chosen = candidates.find(model => keyOf(model) === selection) || (candidates.length === 1 ? candidates[0] : null);
    const hint = models === null ? calendarText("正在读取 DSH 模型…", "Loading DSH models…")
        : candidates.length === 0 ? file
            ? calendarText("请在 DSH 中配置支持图片输入的模型，或移除截图后粘贴文字。", "Configure an image-capable DSH model or remove the screenshot and paste text.")
            : calendarText("请在 DSH 中配置模型，也可以直接手填日程。", "Configure a model in DSH or fill the event manually.")
        : null;
    const selectFile = candidate => {
        if (!candidate || busy) return;
        if (!DSH_CALENDAR_IMAGE_TYPES.includes(candidate.type) || candidate.size > 2 * 1024 * 1024) {
            setError(calendarText("请选择 2 MiB 以内的 PNG、JPEG 或 WebP 截图。", "Choose a PNG, JPEG, or WebP screenshot up to 2 MiB."));
            return;
        }
        setFile(candidate);
        setError("");
    };
    const suggest = async () => {
        if (!chosen || (!input.trim() && !file) || request.current) return;
        const controller = new AbortController();
        request.current = controller;
        setBusy(true);
        onBusy(true);
        setError("");
        try {
            const image = file ? await draftImageData(file) : undefined;
            controller.signal.throwIfAborted();
            const fields = await api("suggest", {
                provider: chosen.provider, model: chosen.model, text: input, image,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
            }, controller.signal, DSH_CALENDAR_DRAFT_ROUTE);
            if (!controller.signal.aborted) onFill(fields);
        } catch (reason) {
            if (!controller.signal.aborted) setError(backendMessage(reason));
        } finally {
            request.current = null;
            if (!controller.signal.aborted) {
                setBusy(false);
                onBusy(false);
            }
        }
    };

    const modelLabel = calendarText("日程解析模型", "Event extraction model");
    return h("div", { className: styles["dshc-field"], "aria-busy": busy },
        h("label", { htmlFor: id + "-text" }, calendarText("日程文字", "Event text")),
        h("textarea", {
            id: id + "-text", className: styles["dshc-input"], value: input, disabled: busy, maxLength: 6000,
            placeholder: calendarText("周五下午三点到四点在 302 和导师开会", "Meeting with my supervisor in room 302, Friday from 3 to 4 pm"),
            onChange: event => setInput(event.target.value),
            onPaste: event => {
                const incoming = [...event.clipboardData.files].find(item => item.type.startsWith("image/"));
                if (incoming) { event.preventDefault(); selectFile(incoming); }
            }
        }),
        h("div", {
            className: styles["dshc-field"],
            onDragOver: event => { if (!busy && event.dataTransfer.types.includes("Files")) event.preventDefault(); },
            onDrop: event => {
                if (!event.dataTransfer.files.length) return;
                event.preventDefault();
                selectFile(event.dataTransfer.files[0]);
            }
        },
            h("span", { id: id + "-image-label" }, calendarText("截图（可选，可拖入或粘贴）", "Screenshot (optional, drop or paste)")),
            h("input", {
                ref: fileInput, type: "file", hidden: true,
                accept: DSH_CALENDAR_IMAGE_TYPES.join(","), disabled: busy,
                onChange: event => { selectFile(event.target.files[0]); event.target.value = ""; }
            }),
            h("div", { className: styles.draftControls },
                h(Btn, { disabled: busy, "aria-describedby": id + "-image-label", onClick: () => fileInput.current?.click() },
                    file ? calendarText("更换截图", "Replace screenshot") : calendarText("选择截图", "Choose screenshot")),
                file ? h("span", { className: styles["dshc-sub"] }, file.name) : null,
                file ? h(Btn, { variant: "ghost", disabled: busy, onClick: () => { setFile(null); setError(""); } },
                    calendarText("移除截图", "Remove screenshot")) : null
            )
        ),
        candidates.length ? h(Picker, {
            id: id + "-model", label: modelLabel, disabled: busy,
            value: chosen ? keyOf(chosen) : "",
            options: [{ id: "", label: modelLabel }].concat(candidates.map(model => ({ id: keyOf(model), label: model.label }))),
            onChange: setSelection
        }) : null,
        hint ? h("p", { role: "status", className: styles["dshc-sub"] }, hint) : null,
        error ? h("p", { role: "alert", className: clsx(styles["dshc-alert"], styles.error) }, error) : null,
        h("p", { className: styles["dshc-sub"] }, calendarText(
            "解析会将这里的文字和截图发送给所选 DSH 模型。核对草稿后点击保存才会写入日历。",
            "Extraction sends this text and screenshot to the selected DSH model. Review the draft and select Save to create the event."
        )),
        h("div", null, h(Btn, { disabled: busy || !chosen || (!input.trim() && !file), onClick: suggest },
            busy ? calendarText("正在解析…", "Extracting…") : calendarText("生成草稿", "Generate draft")))
    );
}
