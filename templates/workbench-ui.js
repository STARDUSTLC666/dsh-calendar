let primCache;
function getPrim() {
    if (primCache !== undefined) return primCache;
    try {
        primCache = require("@deepseek-ai/dsh-client-ui-primitives") || {};
    } catch {
        // Lazy compatibility path for standalone jsdom tests or partial hosts.
        primCache = {};
    }
    return primCache;
}
const PRIM = new Proxy({}, {
    get(_target, prop) {
        return getPrim()?.[prop];
    }
});

const CALENDAR_ICON_PATHS = {
    ...DSH_ICON_PATHS,
    warning: ["M12 3 2 20h20Z", "M12 9v5M12 17h.01"],
};

const StyleSwitcher = createStyleSwitcherComponent(React, require);

function CalendarIcon({ size = 16, ...props }) {
    return h("svg", {
        width: size, height: size, viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round",
        "aria-hidden": true, focusable: false, "data-dsh-icon": "calendar", ...props
    },
        h("rect", { x: 3, y: 5, width: 18, height: 16, rx: 3 }),
        h("path", { d: "M3 10h18M8 3v4M16 3v4" })
    );
}

function Icon({ name = "calendar", size = 16, ...props }) {
    return renderDshIcon(React, { name, size, paths: CALENDAR_ICON_PATHS, ...props });
}

function Btn({ variant = "outline", size = "sm", icon, className, children, ...props }) {
    const P = getPrim();
    const nativeVariant = variant === "danger" ? "ghost" : variant;
    const button = {
        type: "button",
        ...props,
        className: clsx(styles["dshc-btn"], styles[nativeVariant], variant === "danger" && styles.danger, className)
    };
    const glyph = icon ? h(Icon, { name: icon }) : null;
    return P?.Button
        ? h(P.Button, { ...button, variant: nativeVariant, size, icon: glyph }, children)
        : h("button", button, glyph, children);
}

function IconButton({ label, icon, className, ...props }) {
    return h(Btn, { ...props, className: clsx(styles.iconButton, className), icon, variant: "ghost", "aria-label": label, title: label });
}

function Txt({ className, icon, ...props }) {
    const P = getPrim();
    const input = P?.Input
        ? h(P.Input, { ...props, icon, className: clsx(styles.fieldControl, className) })
        : h("input", { type: "text", ...props, className: clsx(styles["dshc-input"], className) });
    if (props.type !== "date" && props.type !== "time") return input;
    return h("span", { className: styles.temporalField }, input,
        h("span", { className: styles.temporalIcon, "aria-hidden": true },
            props.type === "date" ? h(CalendarIcon, { size: 14 }) : h(Icon, { name: "clock", size: 14 })
        )
    );
}

function Chk({ checked, disabled, label, onChange, className, title }) {
    const P = getPrim();
    const classes = clsx(styles["dshc-check"], className);
    if (P?.Checkbox) return h(P.Checkbox, { checked, disabled, label, onChange, className: classes, title });
    return h("label", { className: classes, title },
        h("input", { type: "checkbox", checked, disabled, onChange: event => onChange(event.target.checked) }),
        h("span", null, label)
    );
}

function Picker({ id, label, value, options, onChange, disabled, compact = false }) {
    const [open, setOpen] = useState(false);
    const [dshStyle] = useDshStyle(React);
    const P = getPrim();
    if (!P?.Menu) {
        return h("select", {
            id, "aria-label": label, className: clsx(styles["dshc-input"], compact && styles.toolbarPicker),
            value, disabled, onChange: event => onChange(event.target.value)
        },
            options.map(option => h("option", { key: option.id, value: option.id }, option.label)));
    }
    const HostMenu = resolveHostPrimitives(React, require).Menu;
    const selected = options.find(option => option.id === value);
    const expanded = open && !disabled;
    // Menu composes the host's MenuSurface and owns positioning/keyboard focus.
    return h(HostMenu, {
        open: expanded, dshStyle, portal: true, compact: true, autoFocus: true, minWidthFromAnchor: true,
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
    const P = getPrim();
    if (P?.SegmentedControl) {
        // The host positions the active pill by equal grid tracks. The
        // fallback flex layout would make its width and offsets diverge.
        return h(P.SegmentedControl, { id, label, value, options: items, onChange, disabled });
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

function FallbackDialog({ title, onClose, children, review, dshStyle }) {
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
        "data-dsh-style": dshStyle,
        "data-dsh-portal-synced": "true",
        onMouseDown: event => { if (event.target === event.currentTarget) onClose(); }
    }, h("section", {
        className: clsx(styles.dialog, review ? styles["dshc-drawer"] : styles["dshc-modal"]),
        ref: panel, role: "dialog", "aria-modal": true, "aria-label": title, tabIndex: -1, onKeyDown: trapTab,
        "data-dsh-style": dshStyle, "data-window-drag-exclude": "", "data-dsh-portal-synced": "true"
    }, children));
}

function Dlg({ open, onClose, title, closeLabel = title, children, footer, review = false }) {
    const appearance = React.useContext(getCalendarAppearanceContext());
    const [dshStyle] = useDshStyle(React);
    const P = getPrim();
    if (!open) return null;
    const frame = h("div", {
        key: "frame",
        ref: createOverlaySyncRef(dshStyle),
        className: styles.dialogFrame,
        style: appearance,
        "data-dshc-scope": "1",
        "data-dsh-style": dshStyle,
        "data-window-drag-exclude": ""
    },
        h("header", { className: styles.dialogHeader },
            h("h2", null, title), h(IconButton, { icon: "close", label: closeLabel, onClick: onClose })
        ),
        h("div", { className: styles.dialogBody }, children),
        footer ? h("footer", { className: styles.dialogFooter }, footer) : null
    );
    return P?.Modal
        ? h(P.Modal, { open, onClose, title, headless: true, className: styles.dialog }, frame)
        : h(FallbackDialog, { title, onClose, review, dshStyle }, frame);
}
