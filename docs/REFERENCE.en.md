> Full usage reference. The landing page focuses on outcomes, installation and workflows; detailed parameters, limits, update rules and historical validation links remain here.

# dsh-calendar

[中文](./REFERENCE.zh.md)

![dsh-calendar whale girl plugin cover](https://raw.githubusercontent.com/STARDUSTLC666/dsh-calendar/main/assets/cover-whale-girl.png)

Connect CalDAV in the DSH calendar workbench to view, create and reschedule events. Use month, week or agenda views, and preview ICS files before choosing what to import.

[![npm](https://img.shields.io/npm/v/dsh-calendar)](https://www.npmjs.com/package/dsh-calendar) [![downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-downloads.svg)](https://www.npmjs.com/package/dsh-calendar) [![total downloads](https://raw.githubusercontent.com/STARDUSTLC666/dsh-suite/npm-downloads/assets/dsh-calendar-total-downloads.svg)](https://www.npmjs.com/package/dsh-calendar)

[Download statistics](https://github.com/STARDUSTLC666/dsh-suite/blob/npm-downloads/README.md)

Feedback and contributions are welcome: report [issues](https://github.com/STARDUSTLC666/dsh-calendar/issues) or submit [pull requests](https://github.com/STARDUSTLC666/dsh-calendar/pulls).

Open the workbench from the native DSH sidebar. See the [workbench guide](WORKBENCH.md) for configuration and operating boundaries.

## What it does

- Find available times in the connected calendar, then fill a new-event draft for review. Set duration, working hours/days and buffers; see [availability](AVAILABILITY.md#english).


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

## Start using it: Three-step workflow

1. **Connect calendar**: Open Calendar in the sidebar, choose a provider in connection settings, test the connection, and save.
2. **Share free slots**: Open **Find available time**, search with your duration and buffer, then click **Copy free slots summary** to paste options into chat/email or **Create with this time** to review a draft.
3. **Review with assistant**: Ask DSH chat to summarize your agenda and flag overlaps, or preview and import ICS entries in batches.

## Requirements and configuration

Calendar credentials are required. Google uses OAuth2; other providers may use app passwords. Configure a proxy only when your network requires it.

Detailed configuration, tool arguments and troubleshooting are in the [usage guide](USAGE.en.md). For standalone development, follow the Node requirement in [package.json](../package.json).

See the [deployment contract](MULTIUSER.md) for opt-in person isolation, authenticated reverse proxies, multiple collections, and server-enforced read-only policies. DSH rc.5 itself exposes only an owner principal; multi-user identity needs a trusted provider. No real OIDC deployment was exercised in this validation.

### Panel-only use and model tool switches

Override `config.tools` on the `calendar` entry in the profile's `cordis.patch.yml`, then reload the plugin or restart DSH. Omit it or use `true` to register all seven model tools; use `false` to register none while retaining the panel, ICS import and smart drafts:

```yaml
- id: calendar
  config:
    tools: false
```

Alternatively, disable individual tools; unspecified tools remain enabled. For example, retain only read-only model tools:

```yaml
- id: calendar
  config:
    tools:
      calendar_create: false
      calendar_update: false
      calendar_delete: false
```

Accepted names are `calendar_list`, `calendar_search`, `calendar_health`, `calendar_find_time`, `calendar_create`, `calendar_update` and `calendar_delete`. This controls model schemas only; **it does not make the panel or calendar account read-only**. Panel writes remain available.

## Documentation

- [Usage and troubleshooting](USAGE.en.md)
- [Changelog](../CHANGELOG.md)
- [Validation scope and history](VALIDATION.md)
- [Report a problem or suggest a feature](https://github.com/STARDUSTLC666/dsh-calendar/issues)

## Plugin updates

Requires DSH `>=0.2.2-rc.3`. Update controls sit at the bottom of the calendar sidebar and are also available in native plugin details. Checks, release notes and preferences expand in place, with no separate update page or settings menu. Automatic checks are on by default; **automatic installation is off by default**. Only explicit opt-in permits compatible stable updates (minor and patch by default, or patch-only if selected) while idle with no unsaved changes. Preferences are independent, with per-plugin disable, deferral and ignore controls. No forced DSH restart or upgrade, and local-source installations stay unchanged. Suite components explain and operate on the whole Suite in the same footer.

Older releases need one manual update in native plugin management to acquire these controls. Publishing to npm does not replace an existing user installation.

## License

[MIT](../LICENSE)
