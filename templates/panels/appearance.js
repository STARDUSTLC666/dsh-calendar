// Color values from dsh_calendar_deepseek_harness_native_ui_design.html.
// The calendar scopes these values to its own semantic tokens.
const CALENDAR_PALETTE_KEY = "dsh-calendar:palette";
const CALENDAR_PALETTES = [
    { id: "default", zh: "默认蓝", en: "Default blue", light: "#2563eb", dark: "#60a5fa" },
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
        "button-primary-fill": "#0f1115", "button-primary-hover": "#43454a", "button-primary-ink": "#ffffff",
        "interactive-bg-hover": "rgba(15, 17, 21, 0.045)", "interactive-bg-active": "rgba(15, 17, 21, 0.08)",
        "state-success-primary": "#0f766e", "state-success-tertiary": "rgba(15, 118, 110, 0.10)",
        "state-warn-primary": "#b45309", "state-warn-label": "#b45309", "state-warn-tertiary": "rgba(180, 83, 9, 0.10)",
        "state-error-primary": "#dc2626"
    },
    dark: {
        "bg-base": "#151517", "bg-layer-1": "#232324", "bg-layer-2": "#2c2c2e",
        "bg-layer-3": "#353638", "bg-layer-4": "#43454a",
        "label-primary": "#f9fafb", "label-secondary": "#a1a8b3", "label-tertiary": "#6e7684",
        "border-l1": "rgba(255, 255, 255, 0.06)", "border-l2": "rgba(255, 255, 255, 0.11)", "border-l3": "rgba(255, 255, 255, 0.18)",
        "button-primary-fill": "#f9fafb", "button-primary-hover": "#ebeef2", "button-primary-ink": "#0f1115",
        "interactive-bg-hover": "rgba(255, 255, 255, 0.055)", "interactive-bg-active": "rgba(255, 255, 255, 0.10)",
        "state-success-primary": "#2dd4bf", "state-success-tertiary": "rgba(45, 212, 191, 0.12)",
        "state-warn-primary": "#fbbf24", "state-warn-label": "#fbbf24", "state-warn-tertiary": "rgba(251, 191, 36, 0.12)",
        "state-error-primary": "#f87171"
    }
};

const CALENDAR_SURFACES = {
    floating: {
        light: {
            "bg-base": "#e8ecf4",
            "calendar-island-tint": "rgba(139, 92, 246, 0.18)",
            "calendar-island-surface": "color-mix(in srgb, var(--dsw-alias-bg-layer-1) 80%, transparent)"
        },
        dark: {
            "bg-base": "#0b0d13",
            "calendar-island-tint": "rgba(124, 58, 237, 0.22)",
            "calendar-island-surface": "rgba(24, 26, 34, 0.76)"
        }
    },
    spotlight: { dark: { "bg-base": "#090a0f", "bg-layer-1": "#10121a", "bg-layer-2": "#171a24", "bg-layer-4": "#1f2330" } },
    cards: {
        light: { "bg-base": "#f3f2ee", "bg-layer-1": "#fbfaf7", "bg-layer-2": "#eae7e0", "bg-layer-4": "#e2ded5" },
        dark: { "bg-base": "#121211", "bg-layer-1": "#1c1b19", "bg-layer-2": "#262522", "bg-layer-4": "#302e2a" }
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

const CALENDAR_SPOTLIGHT_CARDS = ["dshc-slot", "dshc-chip", "card", "slotCard", "miniCalendar"]
    .map(name => "." + styles[name]).join(", ");

function moveCalendarSpotlight(event) {
    if (event.pointerType === "touch") return;
    const card = event.target.closest?.(CALENDAR_SPOTLIGHT_CARDS);
    if (!card || !event.currentTarget.contains(card)) return;
    const { left, top } = card.getBoundingClientRect();
    card.style.setProperty("--calendar-spotlight-x", (event.clientX - left) + "px");
    card.style.setProperty("--calendar-spotlight-y", (event.clientY - top) + "px");
}

function useCalendarDarkMode(enabled) {
    const read = () => enabled && document.body.hasAttribute("data-ds-dark-theme");
    const [dark, setDark] = useState(read);
    useEffect(() => {
        if (!enabled) return;
        const observer = new window.MutationObserver(() => setDark(read()));
        observer.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
        setDark(read());
        return () => observer.disconnect();
    }, [enabled]);
    return dark;
}

function calendarAppearance(layout, palette, scheme) {
    const accent = CALENDAR_PALETTES.find(option => option.id === palette)[scheme];
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
