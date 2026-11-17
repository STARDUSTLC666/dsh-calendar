// Color values harmonized with the DeepSeek Harness (>=0.2.2-rc.3) 5-style design system.
// Never too dark: host dark mode uses breathable slate (#1f232b / #272c36), never pitch black.
const CALENDAR_PALETTE_KEY = "dsh-calendar:palette";
const CALENDAR_PALETTES = [
    { id: "default", zh: "默认蓝", en: "Default blue", light: "#2563eb", dark: "#7aaaff" },
    { id: "aurora", zh: "极光紫", en: "Aurora", light: "#7c3aed", dark: "#a78bfa" },
    { id: "ember", zh: "余烬橙", en: "Ember", light: "#d97706", dark: "#fbbf24" },
    { id: "mint", zh: "薄荷绿", en: "Mint", light: "#059669", dark: "#34d399" }
];

const CALENDAR_APPEARANCE = {
    light: {
        "bg-base": "#ffffff", "bg-layer-1": "#fafbfc", "bg-layer-2": "#f4f5f7",
        "bg-layer-3": "#eceef2", "bg-layer-4": "#f1f3f5",
        "label-primary": "#0f1115", "label-secondary": "#4b5563", "label-tertiary": "#848c99",
        "border-l1": "rgba(15, 17, 21, 0.06)", "border-l2": "rgba(15, 17, 21, 0.11)", "border-l3": "rgba(15, 17, 21, 0.18)",
        "button-primary-fill": "#0f1115", "button-primary-hover": "#2d323d", "button-primary-ink": "#ffffff",
        "interactive-bg-hover": "rgba(15, 17, 21, 0.045)", "interactive-bg-active": "rgba(15, 17, 21, 0.08)",
        "state-success-primary": "#0f766e", "state-success-tertiary": "rgba(15, 118, 110, 0.10)",
        "state-warn-primary": "#b45309", "state-warn-label": "#b45309", "state-warn-tertiary": "rgba(180, 83, 9, 0.10)",
        "state-error-primary": "#dc2626"
    },
    dark: {
        "bg-base": "#1f232b", "bg-layer-1": "#272c36", "bg-layer-2": "#2f3542",
        "bg-layer-3": "#373e4d", "bg-layer-4": "#41495a",
        "label-primary": "#eef2f7", "label-secondary": "#b6c0cf", "label-tertiary": "#8d98ab",
        "border-l1": "rgba(226, 232, 240, 0.09)", "border-l2": "rgba(226, 232, 240, 0.15)", "border-l3": "rgba(226, 232, 240, 0.22)",
        "button-primary-fill": "#5b8def", "button-primary-hover": "#6f9cf4", "button-primary-ink": "#ffffff",
        "interactive-bg-hover": "rgba(226, 232, 240, 0.07)", "interactive-bg-active": "rgba(226, 232, 240, 0.13)",
        "state-success-primary": "#4ade80", "state-success-tertiary": "rgba(74, 222, 128, 0.14)",
        "state-warn-primary": "#fbbf24", "state-warn-label": "#fcd34d", "state-warn-tertiary": "rgba(251, 191, 36, 0.15)",
        "state-error-primary": "#f87171"
    }
};

const CALENDAR_SURFACES = {
    floating: {
        light: {
            "bg-base": "#eef2f8",
            "calendar-island-tint": "rgba(139, 92, 246, 0.14)",
            "calendar-island-surface": "color-mix(in srgb, var(--dsw-alias-bg-layer-1) 84%, transparent)"
        },
        dark: {
            "bg-base": "#1f232b",
            "calendar-island-tint": "rgba(122, 170, 255, 0.16)",
            "calendar-island-surface": "rgba(39, 44, 54, 0.86)"
        }
    },
    spotlight: {
        light: { "bg-base": "#f8fafc", "bg-layer-1": "#ffffff", "bg-layer-2": "#f1f5f9", "bg-layer-4": "#e8eef5" },
        dark: { "bg-base": "#1f232b", "bg-layer-1": "#272c36", "bg-layer-2": "#2f3542", "bg-layer-4": "#373e4d" }
    },
    cards: {
        light: { "bg-base": "#f5f4f0", "bg-layer-1": "#fcfbf8", "bg-layer-2": "#eceae3", "bg-layer-4": "#e3e0d7" },
        dark: { "bg-base": "#20242c", "bg-layer-1": "#282d37", "bg-layer-2": "#303642", "bg-layer-4": "#383f4d" }
    }
};

let calendarAppearanceContext;
function getCalendarAppearanceContext() {
    return calendarAppearanceContext ||= React.createContext(undefined);
}

function loadCalendarPalette() {
    const preset = readCalendarPreference(CALENDAR_PALETTE_KEY);
    return CALENDAR_PALETTES.some(option => option.id === preset) ? preset : "default";
}

const CALENDAR_SPOTLIGHT_CARDS = ["dshc-slot", "dshc-chip", "dshc-row", "card", "slotCard", "miniCalendar"]
    .map(name => "." + styles[name]).join(", ");

function moveCalendarSpotlight(event) {
    if (event.pointerType === "touch") return;
    const card = event.target?.closest?.(CALENDAR_SPOTLIGHT_CARDS);
    if (!card || !event.currentTarget.contains(card)) return;
    const { left, top } = card.getBoundingClientRect();
    card.style.setProperty("--calendar-spotlight-x", (event.clientX - left) + "px");
    card.style.setProperty("--calendar-spotlight-y", (event.clientY - top) + "px");
}

function useCalendarDarkMode(enabled) {
    const read = () => enabled && typeof document !== "undefined" && !!document.body?.hasAttribute("data-ds-dark-theme");
    const [dark, setDark] = useState(read);
    useEffect(() => {
        if (!enabled || typeof window === "undefined" || typeof window.MutationObserver !== "function" || !document?.body) {
            setDark(false);
            return;
        }
        const observer = new window.MutationObserver(() => setDark(read()));
        observer.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
        setDark(read());
        return () => observer.disconnect();
    }, [enabled]);
    return dark;
}

function calendarAppearance(layout, palette, scheme, dshStyle = "harness") {
    const swatch = CALENDAR_PALETTES.find(option => option.id === palette) || CALENDAR_PALETTES[0];
    if (dshStyle && dshStyle !== "harness") {
        // Defer surface, ink, border, radius, and button tokens to `[data-dsh-style]` in themes-and-motion.css,
        // while keeping layout island variables and explicit custom event-palette overrides harmonious.
        const overrides = {
            "--dsw-alias-calendar-island-tint": "color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent)",
            "--dsw-alias-calendar-island-surface": "color-mix(in srgb, var(--dsw-alias-bg-layer-1) 88%, transparent)",
            "--dsw-alias-accent": palette === "default" ? "var(--dsw-alias-state-business-primary)" : swatch.light
        };
        if (palette !== "default") {
            overrides["--dsw-alias-state-business-primary"] = swatch.light;
        }
        return overrides;
    }
    const accent = swatch[scheme];
    return Object.fromEntries(Object.entries({
        ...CALENDAR_APPEARANCE[scheme], ...CALENDAR_SURFACES[layout]?.[scheme],
        accent, link: accent, "state-business-primary": accent
    }).map(([name, value]) => ["--dsw-alias-" + name, value]));
}

function CalendarPalettePicker({ palette, dark, onChange }) {
    return h("div", { className: styles.paletteChoices, role: "group", "aria-label": calendarText("日历配色", "Calendar palette") },
        CALENDAR_PALETTES.map(option => {
            const label = calendarText(option.zh, option.en);
            return h(Btn, {
                key: option.id, variant: "ghost", className: styles.paletteSwatch, title: label,
                "aria-label": label, "aria-pressed": option.id === palette,
                style: { "--dsw-alias-accent": option[dark ? "dark" : "light"] },
                onClick: () => onChange(option.id)
            });
        })
    );
}
