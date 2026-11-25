[简体中文](README.md) · **English**

# Calendar

> **Inspect schedules, find open slots, and verify conflicts before writing to CalDAV calendars.**

Native calendar workbench for DeepSeek Harness (`>=0.2.2-rc.3`): opens in the tactile **Bento** card studio with a live **Today Focus Ribbon**, 4 switchable layouts, and 13 bright styles × 8 fonts.

[![npm](https://img.shields.io/npm/v/dsh-calendar)](https://www.npmjs.com/package/dsh-calendar) [![downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-downloads.svg)](https://www.npmjs.com/package/dsh-calendar) [![total downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-total-downloads.svg)](https://www.npmjs.com/package/dsh-calendar)

**[Features](#features) · [Install](#install) · [Workflow](#start-using-it) · [Full guide](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/REFERENCE.en.md)**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 640px)" srcset="https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/workflow-en-mobile-dark.svg">
  <source media="(max-width: 640px)" srcset="https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/workflow-en-mobile-light.svg">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/workflow-en-dark.svg">
  <img src="https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/workflow-en-light.svg" alt="Bento calendar studio & Today Focus Ribbon: inspect events, find slots, and review before saving. · workflow illustration" width="100%">
</picture>

## Features

| Pillar | Capabilities |
| :--- | :--- |
| **Bento Studio + Focus Ribbon** | Default tactile **Bento** card grid (toggle Native / Floating / Spotlight / Bento) paired with a live **Today Focus Ribbon** (countdown, conflict badge & `+ Quick event`) |
| **Multi-View Scheduling** | Month / Week / Agenda views (`M`/`W`/`A`), week-view drag-to-reschedule (15-min snap + 5s undo), iCloud auto-discovery & text/screenshot smart drafts |
| **Open-Slot Finder & Share** | Search available times by duration, weekdays & buffers (`F`), then copy formatted slot summaries straight to chat or email |
| **Conflict-Safe Writes & ICS** | Every new draft and `.ics` import checks overlaps and duplicates before saving to CalDAV |
| **Tour & Synced Themes** | 4-step `? Tour` spotlight guide, 13 visual styles, 4 event palettes, and 8 fonts (default: style-matched font) with soft-slate dark mode |

<details>
<summary>See a workbench example (Bento + Today Focus Ribbon)</summary>

![Calendar default Bento studio layout with Today Focus Ribbon](https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/docs/assets/intro/screen-en.webp)

Calendar running in DeepSeek Harness 0.2.2-rc.3 with sample events.

</details>

## Install

Open **Plugins** in the DSH desktop app and install `dsh-calendar`, or use the CLI:

```bash
dsh plugin --profile desktop add dsh-calendar
```

For the web profile, replace `desktop` with `web` and restart DSH. Requires DSH `>=0.2.2-rc.3`.

## Start using it

1. **Connect or preview a sample**: Open **Calendar** in the sidebar, pick iCloud, Google, Nextcloud, or custom CalDAV in **Connection**, run **Test connection**, and save — or click **See a sample** first.
2. **Switch views & find slots**: Press `M / W / A` for views and `F` for **Find available time**; copy formatted free-slot text or jump straight into a pre-filled draft.
3. **Verify conflicts & save**: Click `+ Quick event` to draft from text/screenshots or preview `.ics` files, and open `? Tour` anytime for ready-made chat prompts.

### Ready-to-copy prompts

- **Find open slots**: `Find two 45-minute free slots this week in the afternoon (13:30–18:00) with a 15-minute buffer, and list the candidates first without creating an event.`
- **Today's agenda**: `Summarize today's meeting agenda in chronological order with locations, and highlight any scheduling overlaps.`
- **Deep-work blocks**: `Read my schedule for next week, identify the busiest day, and list 2-hour uninterrupted blocks for deep work.`

## Before you start

- Bring your own CalDAV account; availability checks cover only connected calendars.
- Full configuration, tools, and troubleshooting: [full reference](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/REFERENCE.en.md).

## Plugin updates

Check updates at the bottom of the workbench or native plugin details. Automatic checks are on by default; **automatic installation is off**. Suite-managed components update with their bundle.

## Documentation & feedback

- [Full usage, configuration and limits](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/REFERENCE.en.md) · [Release notes](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/CHANGELOG.md) · [Validation history](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/docs/VALIDATION.md)
- Stars, [Issues](https://github.com/STARDUSTLC666/dsh-calendar/issues), and [PRs](https://github.com/STARDUSTLC666/dsh-calendar/pulls) are welcome (strip credentials first).

## License

[MIT](https://github.com/STARDUSTLC666/dsh-calendar/blob/main/LICENSE)

<a id="what-it-does"></a>
<a id="requirements-and-configuration"></a>
