# dsh-calendar

![npm](https://img.shields.io/npm/v/dsh-calendar) ![downloads](https://img.shields.io/npm/dm/dsh-calendar) ![license](https://img.shields.io/github/license/STARDUSTLC666/dsh-calendar) ![stars](https://img.shields.io/github/stars/STARDUSTLC666/dsh-calendar?style=social)

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)

DSH community plugin: read/write calendar events via CalDAV. Provides 5 calendar tools (calendar_list / calendar_create / calendar_update / calendar_delete / calendar_search) plus the offline `calendar_health` configuration check. Google uses OAuth 2.0; iCloud / Nextcloud / custom servers retain Basic authentication by default. No settings-page UI; all configuration goes through the profile's cordis.patch.yml.

## Compatibility

Verified with official `@deepseek-ai/dsh@0.1.5-rc.1` and Node `24.16.0` on 2026-09-11: all 18 components load alongside Modlens, with passing tool-schema, skill-registration and offline read-only invocation checks. Uses the `cordis.patch.yml` + `dsh.bundle.patch` bundle model. Node requirements match this Harness release: 22.19 or later within 22.x, or 24 or later. Live external-service workflows require separate configuration and validation.

On 2026-09-10, npm `dsh-calendar@0.5.2` passed installation through this Harness release's official CLI and registration of all 6 tools. Host execution of `calendar_list` refreshed a real Google token (200), read via CalDAV REPORT (207) and rendered model-facing results. Only Google reads were tested; no writes were performed. This patch does not change runtime code.

Follows the official [plugin packaging and installation requirements](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md): an ESM entry point, prebuilt `lib/`, `dsh.bundle.patch` and a `cordis.patch.yml` layer. The plugin explicitly injects `tools` and supplies JSON Schema parameters, canonical output and rendering, with no runtime imports of `@deepseek-ai/*` internals. Use Node 22.19 or later within 22.x, or Node 24 or later. Harness is evolving rapidly; the version above is the tested baseline.

## Installation

```bash
dsh plugin --profile web add dsh-calendar
```

After installing, restart dsh. The plugin inserts a `calendar` config line into the profile (see this package's cordis.patch.yml). The default provider is custom with no credentials filled in; the plugin still loads, but tools throw a Chinese guidance error when called, prompting you to complete the configuration.

## Uninstall

```bash
dsh plugin --profile web remove dsh-calendar
```

Then restart the web service. To clean up fully, also remove the plugin entry from your profile `cordis.patch.yml` if you overrode it.


## Configuration

**Recommended: configure it in the panel (0.6.0+)**

Open「Connection」in the panel toolbar, pick a provider, fill in the address and account, hit **Test connection** (it really lists the next 30 days) and then **Save and enable**. The tools pick the new configuration up on their next call — no restart, no YAML editing.

What the panel saves lives in your local `settings.yaml` under the `dsh-calendar` namespace (the password is a secret field: no logs, no exports). If the host has no settings service (or the namespace cannot be registered), the connection is stored in the plugin’s own file `$DSH_HOME/data/dsh-calendar/connection.json` (0600) instead, and the panel says which one is in use. **The YAML remains the base layer**: any field the panel never touched still comes from it, so an existing `cordis.patch.yml` setup needs no migration; a headless host without a settings page still configures through YAML only.

Per-provider notes:

- **iCloud**: `caldavUrl` looks like `https://caldav.icloud.com/<numeric id>/calendars/<calendar id>/`; use an [app-specific password](https://appleid.apple.com/)
- **Nextcloud / self-hosted**: server URL + username + calendar name (self-hosted: the full collection URL, keep the trailing slash) and an app password
- **Google**: OAuth only — Google rejects every Basic password, including app passwords; needs `clientId` / `clientSecret` / `refreshToken` / `calendarId`

### Or: write YAML (advanced / headless)

The fields below mirror the panel form one-to-one; whatever the panel never set comes from here.
All configuration lives in your profile's cordis.patch.yml; override the `calendar` line by id (overriding replaces that line's config wholesale). Common fields:

- `provider`: google | icloud | nextcloud | custom
- `caldavUrl`: full calendar collection URL (required for custom / icloud; google / nextcloud can also override the preset manually)
- `authMethod`: `basic` | `oauth`; Google defaults to and requires `oauth`, other providers default to `basic`. Opt in explicitly for another OAuth server. Google credentials in the environment never switch a Basic provider to OAuth automatically.
- `username` / `password`: required only for Basic authentication. Use an app-specific password for iCloud, preferably via `DSH_CALENDAR_PASSWORD`. **Google CalDAV rejects all Basic passwords, including app-specific passwords.**
- `clientId` / `clientSecret` / `refreshToken`: required for OAuth; also read from `DSH_CALENDAR_CLIENT_ID` / `DSH_CALENDAR_CLIENT_SECRET` / `DSH_CALENDAR_REFRESH_TOKEN`. Non-empty config values take precedence over environment variables. Never commit secrets or tokens to Git.
- `tokenUrl`: also read from `DSH_CALENDAR_TOKEN_URL`; defaults to `https://oauth2.googleapis.com/token` for Google and is required for other OAuth providers. OAuth tokenUrl and caldavUrl must use HTTPS without embedded credentials, query parameters or fragments.
- `calendarId`: google-specific, the calendar ID (usually your email)
- `host` / `user` / `calendar`: nextcloud-specific
- `proxyUrl`: optional HTTP proxy (e.g. `http://127.0.0.1:7890`); both OAuth token requests and CalDAV requests use this transport

### Google example

```yaml
- id: calendar
  name: dsh-calendar
  config:
    provider: google
    calendarId: you@gmail.com
    # authMethod: oauth  # the default for Google
    # Provide clientId / clientSecret / refreshToken via environment variables
```

Google's CalDAV collection URL is assembled by the plugin: `https://apidata.googleusercontent.com/caldav/v2/<calendarId>/events`.

Set these placeholder values in the same terminal that starts source-run `pnpm dsh` or ordinary `dsh`:

```bash
export DSH_CALENDAR_CLIENT_ID='your OAuth client ID'
export DSH_CALENDAR_CLIENT_SECRET='your OAuth client secret'
export DSH_CALENDAR_REFRESH_TOKEN='your authorized refresh token'
```

These credentials come from your own Google Cloud OAuth client and a user authorization, not an email app password. Follow the [Google CalDAV setup guide](https://developers.google.com/workspace/calendar/caldav/v2/guide) to enable the API and configure OAuth. Request `https://www.googleapis.com/auth/calendar` for calendar read/write and offline access (`access_type=offline`) to obtain a refresh token; see [Google's offline authorization documentation](https://developers.google.com/identity/protocols/oauth2/web-server#offline). Supply an already authorized refresh token, or mint one with the helper below.
**Getting a refresh token (one command)**: register the client as a **Desktop app**, then:

```bash
cd <plugin directory>   # the source checkout, or node_modules/dsh-calendar
node scripts/google-oauth.mjs --client-id <your clientId> --client-secret <your clientSecret>
```

The script spins up a **one-shot local callback** (`http://127.0.0.1:<random port>/`), opens the browser for consent, exchanges the code and prints the refresh token — no hand-built URLs, no third-party playground.

Paste it into the panel’s「Connection」form (provider Google, calendarId = your Gmail address), or use the `DSH_CALENDAR_CLIENT_ID` / `DSH_CALENDAR_CLIENT_SECRET` / `DSH_CALENDAR_REFRESH_TOKEN` environment variables.

> While the OAuth consent screen is still in **Testing**, the refresh token lasts 7 days: hit **Publish app** on the OAuth consent screen to make it permanent (no review needed for personal use).

**Google CalDAV scope validation (2026-09-08):** for the same account and calendar, `calendar.readonly` allowed token refresh (200) and collection PROPFIND (207), but the event REPORT returned 403. With the `calendar` scope above, REPORT returned 207; a fresh verification process also refreshed the token and read successfully. Use this CalDAV scope configuration and verify an actual `calendar_list` request: successful token acquisition or collection discovery alone does not prove events are readable. This live test performed reads only; Google write operations were not tested.

The `calendar` scope permits viewing, editing, sharing and deleting accessible calendars; review that access before granting it. See [Google's scope definitions](https://developers.google.com/workspace/calendar/api/auth). For an external OAuth app in **Testing**, a refresh token with Calendar scopes expires after 7 days. Long-term use needs reauthorization or an appropriate production configuration under Google's requirements; see [refresh token expiration](https://developers.google.com/identity/protocols/oauth2#expiration).

Access tokens are cached in memory and checked before each DAV request, with refresh before expiry. Both token and DAV requests inherit the tool call's AbortSignal. A 401 invalidates the token for the next call; **writes are never replayed automatically**. OAuth requests do not follow redirects or send Bearer tokens to cross-origin object hrefs, so configure the final calendar collection URL. Runtime tokens are not written to configuration or logs. If another OAuth provider rotates refresh tokens, supply valid credentials again when restarting.

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

## Authentication troubleshooting

Google: OAuth 2.0 only. On 401/403, check OAuth authorization, calendar scope and calendar permissions. If refresh and PROPFIND succeed but REPORT returns 403, check that the granted scope is the `calendar` scope above; successful discovery with `calendar.readonly` does not prove events are readable. On refresh failure, verify clientId/clientSecret/refreshToken, re-authorize revoked or expired grants, and check the 7-day Testing lifetime. **Generating another app password cannot fix Google CalDAV authentication.**

iCloud: sign in to appleid.apple.com → Sign-In and Security → App-Specific Passwords, generate one and fill it into `password` or `DSH_CALENDAR_PASSWORD`. You cannot use your Apple ID password.

Nextcloud / custom Basic servers: check the account, password or provider-issued app token and calendar permissions. `calendar_health` checks configuration only; it neither connects nor proves authorization. Use `calendar_list` to verify the real connection.

## Proxy

If your CalDAV server is not directly reachable from your network (some regional or corporate networks block it), set `proxyUrl` in the plugin config, e.g. `http://127.0.0.1:7890`, and restart. Both token refresh and DAV requests use that HTTP proxy; it does not affect other plugins in the same process.

## Tool reference

- `calendar_health`: offline provider, endpoint and Basic/OAuth credential-completeness checks; never displays secrets or connects to the server.
- `calendar_list`: list events in a time range (start/end, ISO 8601; defaults to the next 7 days). Recurring events are expanded by default (`expand` defaults to true, `maxOccurrences` defaults to 30, clamped to 1-200): each occurrence is a separate row with `isOccurrence: true` and `seriesStart`; non-recurring events keep `isOccurrence: false`. With `expand=false`, recurring events are returned as a single original entry with `rrule`. Results are stably sorted by start time.
- `calendar_create`: create an event (summary/start/end required; description/location/allDay/rrule optional). Validates real calendar dates and `end >= start`.
- `calendar_update`: edit an event by uid (summary/start/end/description/location/allDay/rrule optional; omitted fields keep their original values, including the recurrence rule and original properties such as ATTENDEE / ORGANIZER / VALARM).
- `calendar_delete`: delete an event by uid
- `calendar_search`: search events by keyword within the `start`~`end` window (defaults to one year before/after now; client-side filter over title/description/location/UID, case-insensitive; `limit` defaults to 50, clamped to 1-200, and results are sorted by start time).

The stable event identifier `uid` is the CalDAV href (full object URL); `calendar_update` / `calendar_delete` use it.

## Calendar panel in Settings (0.6.0+)

Once installed, DSH grows a「Calendar」section in Settings; the chat page also gets a small 📅 button in the bottom-right that opens the same panel (non-modal, Esc closes).

- **Three views**: month (6×7 grid, today highlighted, click a cell to create), week (24-hour time grid, overlapping events side by side) and agenda (grouped by day).
- **Click to edit**: open any event in the right-hand drawer — time, duration, a human-readable repeat rule (`FREQ=WEEKLY;COUNT=6` → "weekly (6 times)"), location, notes, one-click uid copy — then edit or delete (deletion asks twice).
- **Create**: title, date, start/end, all-day, location, notes, repeat (daily/weekly/monthly/yearly, or a raw RRULE).
- **Conflict notice**: before saving, overlapping events are listed and you are asked whether to continue.
- **Configurable from the panel itself**: without a CalDAV account the panel shows guidance whose「Connection」button opens the form (test first, then save); a clearly labelled sample is one click away and never pretends to be your real calendar.
- **Theme and locale aware**: colours come from the host design tokens (`--dsw-*`), so light/dark themes follow automatically; copy follows Settings → General.
- **Security**: the panel only talks to the plugin’s own `/_dsh/dsh-calendar/settings`, which is loopback-only and re-checks Host, Origin and Content-Type on writes; credentials are never echoed back.
## Time and timezone

Input and output are uniformly ISO 8601. Timed events are output in UTC (e.g. `2025-01-15T01:00:00Z`); all-day events output `YYYY-MM-DD`. Input may carry a timezone offset (e.g. `2025-01-15T09:00:00+08:00`); the plugin converts to UTC internally for storage.


## Changelog

- **0.5.4 (2026-09-18)**: fixes for `calendar_update` dropping ATTENDEE/VALARM and other original properties, ignored RECURRENCE-ID overrides, `calendar_create` inventing a uid instead of using the server Location, and silent empty expansion results; `calendar_search` gained a time range. 79 tests.
- **0.5.3 (2026-09-11)**: revalidated against official Harness 0.1.5-rc.1 and refreshed co-load / live-service verification; runtime code unchanged.
- **0.5.2 and earlier**: see [CHANGELOG.md](CHANGELOG.md).

## Known limitations

- Recurring event expansion: calendar_list expands RRULE by default via ICAL.RecurExpansion (`expand=true`), capped by `maxOccurrences`, and raises an explicit error when the iteration budget is exhausted; calendar_search only queries the `start`~`end` window (default one year before/after now) and still returns the original series (not expanded).
- Single-instance reads vs edit/delete: calendar_list honors RECURRENCE-ID overrides when expanding (an occurrence separately rescheduled/retitled is returned with the override time and fields, including when the original instant is EXDATE-excluded); calendar_update / calendar_delete still operate on the whole recurring series (by uid) and cannot modify or delete just one occurrence.
- OAuth credentials must be obtained beforehand: refresh-token authentication is supported, but there is no browser login UI / login CLI and runtime tokens are not written back to configuration.
- Timezone rules: events with TZID (named timezone) are output converted to UTC (Z); all-day boundaries, DST, and other complex timezone rules are not handled finely.
- No settings-page UI: this round is a node half-body; config only via cordis.patch.yml, no Web settings page.
- Calendar discovery: iCloud requires manually filling the full calendar collection URL; no principal auto-discovery or multi-calendar selection.
- Cancellation/timeout: tools use `timeoutMs` (60 seconds) and forward the host AbortSignal into token refresh and DAV network requests. Concurrent calls cancel independently.

## Development

```bash
pnpm install
pnpm test   # 构建 + node --test
```

Build output in `lib/`; tests in `test/*.test.mjs` (no real account needed).
