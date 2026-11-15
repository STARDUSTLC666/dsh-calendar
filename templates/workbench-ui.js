let PRIM;
try {
    PRIM = require("@deepseek-ai/dsh-client-ui-primitives");
} catch {
    // Compatibility path for partial hosts that don't seed the browser module.
    PRIM = {};
}

const hostIcons = {
    left: "IconChevronLeftOutlineMedium",
    right: "IconChevronRightOutlineMedium",
    down: "IconChevronDownOutlineMedium",
    close: "IconCloseOutlineMedium",
    refresh: "IconRefreshOutlineMedium",
    plus: "IconPlusOutlineMedium",
    search: "IconSearchOutlineMedium",
    clock: "IconClockOutlineMedium",
    check: "IconCheckOutlineMedium",
    warning: "IconWarningTriangleOutlineMedium"
};
const fallbackIcons = { left: "‹", right: "›", down: "⌄", close: "×", refresh: "↻", plus: "+", search: "⌕", clock: "◷", check: "✓", warning: "!" };

function CalendarIcon({ size = 16 }) {
    return h("svg", {
        width: size, height: size, viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", "aria-hidden": true, focusable: false
    },
        h("rect", { x: 3, y: 5, width: 18, height: 16, rx: 3 }),
        h("path", { d: "M3 10h18M8 3v4M16 3v4" })
    );
}

function Icon({ name, size = 16 }) {
    const NativeIcon = PRIM?.[hostIcons[name]];
    return NativeIcon
        ? h(NativeIcon, { size, "aria-hidden": true })
        : h("span", { className: styles.fallbackIcon, "data-glyph": fallbackIcons[name], "aria-hidden": true });
}

function Btn({ variant = "outline", size = "sm", icon, className, children, ...props }) {
    const nativeVariant = variant === "danger" ? "ghost" : variant;
    const button = {
        type: "button",
        ...props,
        className: clsx(styles["dshc-btn"], styles[nativeVariant], variant === "danger" && styles.danger, className)
    };
    const glyph = icon ? h(Icon, { name: icon }) : null;
    return PRIM?.Button
        ? h(PRIM.Button, { ...button, variant: nativeVariant, size, icon: glyph }, children)
        : h("button", button, glyph, children);
}

function IconButton({ label, icon, className, ...props }) {
    return h(Btn, { ...props, className: clsx(styles.iconButton, className), icon, variant: "ghost", "aria-label": label, title: label });
}

function Txt({ className, icon, ...props }) {
    const input = PRIM?.Input
        ? h(PRIM.Input, { ...props, icon, className: clsx(styles.fieldControl, className) })
        : h("input", { type: "text", ...props, className: clsx(styles["dshc-input"], className) });
    if (props.type !== "date" && props.type !== "time") return input;
    return h("span", { className: styles.temporalField }, input,
        h("span", { className: styles.temporalIcon, "aria-hidden": true },
            props.type === "date" ? h(CalendarIcon, { size: 14 }) : h(Icon, { name: "clock", size: 14 })
        )
    );
}

function Chk({ checked, disabled, label, onChange, className, title }) {
    const classes = clsx(styles["dshc-check"], className);
    if (PRIM?.Checkbox) return h(PRIM.Checkbox, { checked, disabled, label, onChange, className: classes, title });
    return h("label", { className: classes, title },
        h("input", { type: "checkbox", checked, disabled, onChange: event => onChange(event.target.checked) }),
        h("span", null, label)
    );
}

function Picker({ id, label, value, options, onChange, disabled, compact = false }) {
    const [open, setOpen] = useState(false);
    if (!PRIM?.Menu) {
        return h("select", {
            id, "aria-label": label, className: clsx(styles["dshc-input"], compact && styles.toolbarPicker),
            value, disabled, onChange: event => onChange(event.target.value)
        },
            options.map(option => h("option", { key: option.id, value: option.id }, option.label)));
    }
    const selected = options.find(option => option.id === value);
    const expanded = open && !disabled;
    // Menu composes the host's MenuSurface and owns positioning/keyboard focus.
    return h(PRIM.Menu, {
        open: expanded, portal: true, compact: true, autoFocus: true, minWidthFromAnchor: true,
        className: compact ? styles.toolbarPicker : styles.picker, listClassName: styles.menu,
        anchor: h(Btn, {
            id, disabled, className: compact ? styles.layoutTrigger : styles.pickerTrigger,
            "aria-label": label + " · " + (selected?.label ?? ""), "aria-haspopup": "menu", "aria-expanded": expanded,
            onClick: () => setOpen(value => !value)
        }, h("span", null, selected?.label), h(Icon, { name: "down" })),
        items: options,
        selectedId: value,
        onClose: () => setOpen(false),
        onSelect: id => { setOpen(false); onChange(id); }
    });
}

function Segments({ id, label, items, value, onChange, disabled }) {
    if (PRIM?.SegmentedControl) {
        return h(PRIM.SegmentedControl, { id, label, value, options: items, onChange, disabled, className: styles.segments });
    }
    return h("div", { className: styles.segments, role: "tablist", "aria-label": label },
        items.map(item => h("button", {
            key: item.value, type: "button", role: "tab", id: id + "-" + item.value,
            className: styles.segment, "aria-selected": value === item.value,
            "aria-controls": id + "-" + item.value + "-panel",
            tabIndex: value === item.value ? 0 : -1, disabled: disabled || item.disabled,
            onClick: () => onChange(item.value),
            onKeyDown: event => {
                const enabled = items.filter(item => !item.disabled);
                const index = enabled.findIndex(option => option.value === item.value);
                const length = enabled.length;
                const offsets = { ArrowLeft: -1, ArrowRight: 1, Home: -index, End: length - index - 1 };
                if (!Object.hasOwn(offsets, event.key)) return;
                event.preventDefault();
                const next = enabled[(index + offsets[event.key] + length) % length].value;
                onChange(next);
                document.getElementById(id + "-" + next)?.focus();
            }
        }, item.label))
    );
}

function EmptyState({ title, children, action }) {
    return h("div", { className: styles["w-empty"] },
        h("span", { className: styles.emptyIcon }, h(CalendarIcon, { size: 22 })),
        h("h2", null, title), children,
        h("div", { className: styles.emptyActions }, action)
    );
}

function FallbackDialog({ title, onClose, children, review }) {
    const panel = useRef(null);
    useEffect(() => {
        const previous = document.activeElement;
        (panel.current?.querySelector("[data-modal-autofocus]") ?? panel.current)?.focus();
        return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }); };
    }, []);
    function trapTab(event) {
        if (event.key !== "Tab") return;
        const controls = [...panel.current.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]")];
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
            event.preventDefault();
            last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
    }
    return h("div", {
        className: review ? styles["dshc-overlay"] : styles["dshc-modalwrap"],
        onMouseDown: event => { if (event.target === event.currentTarget) onClose(); }
    }, h("section", {
        className: clsx(styles.dialog, review ? styles["dshc-drawer"] : styles["dshc-modal"]),
        ref: panel, role: "dialog", "aria-modal": true, "aria-label": title, tabIndex: -1, onKeyDown: trapTab
    }, children));
}

function Dlg({ open, onClose, title, closeLabel = title, children, footer, review = false }) {
    const appearance = React.useContext(getCalendarAppearanceContext());
    if (!open) return null;
    const frame = h("div", { key: "frame", className: styles.dialogFrame, style: appearance, "data-dshc-scope": "1" },
        h("header", { className: styles.dialogHeader },
            h("h2", null, title), h(IconButton, { icon: "close", label: closeLabel, onClick: onClose })
        ),
        h("div", { className: styles.dialogBody }, children),
        footer ? h("footer", { className: styles.dialogFooter }, footer) : null
    );
    return PRIM?.Modal
        ? h(PRIM.Modal, { open, onClose, title, headless: true, className: styles.dialog }, frame)
        : h(FallbackDialog, { title, onClose, review }, frame);
}
