# dsh-calendar

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)

DSH community plugin: read/write calendar events via CalDAV. Provides 5 model-facing tools (calendar_list / calendar_create / calendar_update / calendar_delete / calendar_search), supporting Google / iCloud / Nextcloud and any CalDAV server. This round is a node half-body with no settings-page UI; all configuration goes through the profile's cordis.patch.yml.

## Installation

```bash
dsh plugin --profile web add dsh-calendar
```

After installing, restart dsh. The plugin inserts a `calendar` config line into the profile (see this package's cordis.patch.yml). The default provider is custom with no credentials filled in; the plugin still loads, but tools throw a Chinese guidance error when called, prompting you to complete the configuration.

## Configuration

All configuration lives in your profile's cordis.patch.yml; override the `calendar` line by id (overriding replaces that line's config wholesale). Common fields:

- `provider`: google | icloud | nextcloud | custom
- `caldavUrl`: full calendar collection URL (required for custom / icloud; google / nextcloud can also override the preset manually)
- `username`: CalDAV account (account email for Google / iCloud)
- `password`: password; for Google / iCloud use an app-specific password. Recommended to use the `DSH_CALENDAR_PASSWORD` env var to avoid storing it in plaintext.
- `calendarId`: google-specific, the calendar ID (usually your email)
- `host` / `user` / `calendar`: nextcloud-specific
- `proxyUrl`: optional HTTP proxy (e.g. `http://127.0.0.1:7890`); routes only this plugin's CalDAV requests through it

### Google example

```yaml
- id: calendar
  name: dsh-calendar
  config:
    provider: google
    username: you@gmail.com
    calendarId: you@gmail.com
    # password 推荐用环境变量 DSH_CALENDAR_PASSWORD
```

Google's CalDAV collection URL is assembled by the plugin: `https://apidata.googleusercontent.com/caldav/v2/<calendarId>/events`.

### iCloud example

```yaml
- id: calendar
  name: dsh-calendar
  config:
    provider: icloud
    username: you@icloud.com
    caldavUrl: https://caldav.icloud.com/123456789/calendars/<日历ID>/
    # password 推荐用环境变量 DSH_CALENDAR_PASSWORD
```

iCloud needs the full calendar collection URL (with your user ID and calendar ID); you can find the specific calendar address in the calendar CalDAV settings on icloud.com.

### Nextcloud example

```yaml
- id: calendar
  name: dsh-calendar
  config:
    provider: nextcloud
    username: alice
    host: https://cloud.example.com
    user: alice
    calendar: personal
    # password 推荐用环境变量 DSH_CALENDAR_PASSWORD
```

The plugin assembles: `https://cloud.example.com/remote.php/dav/calendars/alice/personal/`.

### Custom CalDAV example

```yaml
- id: calendar
  name: dsh-calendar
  config:
    provider: custom
    caldavUrl: https://dav.example.com/calendars/me/work/
    username: me
    # password 推荐用环境变量 DSH_CALENDAR_PASSWORD
```

## App-specific password guidance

Google: sign in to myaccount.google.com → Security → 2-Step Verification (must be enabled first) → App passwords, choose "Other" to generate a 16-character password, and fill it into `password` or `DSH_CALENDAR_PASSWORD`. You cannot use your Google login password.

iCloud: sign in to appleid.apple.com → Sign-In and Security → App-Specific Passwords, generate one and fill it into `password` or `DSH_CALENDAR_PASSWORD`. You cannot use your Apple ID password.

If a call returns 401/403, it's usually the wrong password (login password used instead of an app-specific password); the plugin returns a Chinese hint.

## Proxy

If your CalDAV server is not directly reachable from your network (some regional or corporate networks block it), set `proxyUrl` in the plugin config, e.g. `http://127.0.0.1:7890`, and restart. The proxy only routes this plugin's CalDAV requests; it does not affect other plugins in the same process.

## Tool reference

- `calendar_list`: list events in a time range (start/end, ISO 8601; defaults to the next 7 days). Recurring events are expanded by default (`expand` defaults to true, `maxOccurrences` defaults to 30, clamped to 1-200): each occurrence is a separate row with `isOccurrence: true` and `seriesStart`; non-recurring events keep `isOccurrence: false`. With `expand=false`, recurring events are returned as a single original entry with `rrule`. Results are stably sorted by start time.
- `calendar_create`: create an event (summary/start/end required; description/location/allDay/rrule optional). Validates real calendar dates and `end >= start`.
- `calendar_update`: edit an event by uid (summary/start/end/description/location/allDay/rrule optional; omitted fields keep their original values, including the recurrence rule).
- `calendar_delete`: delete an event by uid
- `calendar_search`: search events by keyword (client-side filter over title/description/location/UID, case-insensitive; `limit` defaults to 50, clamped to 1-200, and results are sorted by start time).

The stable event identifier `uid` is the CalDAV href (full object URL); `calendar_update` / `calendar_delete` use it.

## Time and timezone

Input and output are uniformly ISO 8601. Timed events are output in UTC (e.g. `2025-01-15T01:00:00Z`); all-day events output `YYYY-MM-DD`. Input may carry a timezone offset (e.g. `2025-01-15T09:00:00+08:00`); the plugin converts to UTC internally for storage.


## v0.3.2 improvements

- Fix `calendar_update` dropping `rrule` while updating other fields.
- Validate `end >= start` and reject impossible dates such as `2025-02-30`.
- Sort `calendar_list` / `calendar_search` output by start time and clamp search `limit` to 1-200.
- Reset the cached CalDAV client after creation failure so the next tool call can retry.

## Known limitations

- Recurring event expansion: calendar_list expands RRULE by default via ICAL.RecurExpansion (`expand=true`), capped by `maxOccurrences`; calendar_search still returns the original series (not expanded).
- No single-instance edit/delete: calendar_update / calendar_delete operate on the whole recurring series (by uid); you cannot modify or delete just one occurrence (no RECURRENCE-ID instance-level operations).
- No OAuth: Basic auth only (app-specific password); Google / iCloud OAuth login flows are not supported.
- Timezone rules: events with TZID (named timezone) are output converted to UTC (Z); all-day boundaries, DST, and other complex timezone rules are not handled finely.
- No settings-page UI: this round is a node half-body; config only via cordis.patch.yml, no Web settings page.
- Calendar discovery: iCloud requires manually filling the full calendar collection URL; no principal auto-discovery or multi-calendar selection.
- Cancellation/timeout: tools rely on `timeoutMs` (60 seconds) for overall timeout; AbortSignal is not propagated to individual network requests.

## Development

```bash
pnpm install
pnpm test   # 构建 + node --test
```

Build output in `lib/`; tests in `test/*.test.mjs` (no real account needed).
