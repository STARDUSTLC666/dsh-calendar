# dsh-calendar

[中文](README.md)

![dsh-calendar whale girl plugin cover](https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/assets/cover-whale-girl.png)

View, create and reschedule CalDAV events from DSH.

[![npm](https://img.shields.io/npm/v/dsh-calendar)](https://www.npmjs.com/package/dsh-calendar) [![downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-downloads.svg)](https://www.npmjs.com/package/dsh-calendar)

Feedback and contributions are welcome: report [issues](https://github.com/STARDUSTLC666/dsh-calendar/issues) or submit [pull requests](https://github.com/STARDUSTLC666/dsh-calendar/pulls).


See the [0.10.4 validation record](docs/validation/0.10.4.md) for DSH `0.2.1-alpha.5` browser checks and the remaining limits.

Open the new native sidebar workbench after updating and restarting DSH. Settings remains available. See the [workbench guide and validation boundaries](docs/WORKBENCH.md).

## What it does

- Month, week and agenda views with drag and keyboard rescheduling.
- Create, search, update and delete events, including recurring occurrences.
- Import an ICS file or pasted content after reviewing timezones, duplicates and overlap hints.
- Connect Google, iCloud, Nextcloud or your own CalDAV server.

## Install

In DSH Desktop, install `dsh-calendar` from the Plugins panel. If the bundled dsh command is available:

```bash
dsh plugin --profile desktop add dsh-calendar
```

For the web version, replace `desktop` with `web`. Restart DSH after installation.

## Start using it

Open Settings → Calendar, configure a provider, test the connection and save. Then ask: “Show this week’s events and find a one-hour gap.”

To migrate events, choose Import ICS. Previewing does not change your calendar. Select events and confirm the import; existing events are skipped and failed items can be retried separately.

## Requirements and configuration

Calendar credentials are required. Google uses OAuth2; other providers may use app passwords. Configure a proxy only when your network requires it.

Detailed configuration, tool arguments and troubleshooting are in the [usage guide](docs/USAGE.en.md). For standalone development, follow the Node requirement in [package.json](package.json).

## Documentation

- [Usage and troubleshooting](docs/USAGE.en.md)
- [Changelog](CHANGELOG.md)
- [Validation scope and history](docs/VALIDATION.md)
- [Report a problem or suggest a feature](https://github.com/STARDUSTLC666/dsh-calendar/issues)

## Plugin updates

Requires DSH 0.2.1-rc.3 or newer. Update controls sit at the bottom of the existing workbench, or native plugin details for plugins without a workbench. Checks, release notes and preferences expand in place, with no separate update page or settings menu. Automatic checks are on by default; **automatic installation is off by default**. Only explicit opt-in permits compatible stable patches while idle with no unsaved changes. Preferences are independent, with per-plugin disable, deferral and ignore controls. No forced DSH restart or upgrade, and local-source installations stay unchanged. Suite components explain and operate on the whole Suite in the same footer.

Older releases need one manual update in native plugin management to acquire these controls. Publishing to npm does not replace an existing user installation.

## License

[MIT](LICENSE)
