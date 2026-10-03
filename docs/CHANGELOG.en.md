# Historical release notes

[Current changelog](../CHANGELOG.md) · [Overview](../README.en.md)

These English notes preserve the earlier translations. The main changelog contains the consolidated version history.

## 0.10.0 (2026-10-03)

- Import ICS files or pasted content with an explicit preview, selection and batch confirmation. Preserve recurrence rules, excluded dates, moved exceptions and timezone definitions.
- Require a timezone choice for floating times and show actionable errors for unsupported or malformed events. Use `timezones-ical-library` for IANA definitions without sharing file-specific timezones globally.
- Check all target UIDs, skip existing events and retry failed items without repeating successful writes. Expired previews or a changed connection require a new preview; conditional creation never overwrites an existing resource.
- Import private copies without guests, organizers or non-display alarms. Overlap hints cover the first occurrence only.
- Clarify calendar credentials and fix the settings layout at a 390px viewport. See the [validation record](VALIDATION.md) for the tested scope.

## 0.9.4 (2026-10-02)

- Upgrade Undici to 8.11.2 and eliminate the production dependency audit findings.
- Test CalDAV REPORT method, body and authorization preservation through a real local HTTP proxy, plus cancellation while reading a response.
- Proxy configuration is optional: no VPN is needed when the calendar server is reachable directly.
- All 180 tests pass on Windows. The official DSH 0.2.0-rc.2 web settings page was used to test a local CalDAV connection, agenda display and configuration saving. Production Google/iCloud accounts need separate acceptance.

## 0.9.3 (2026-10-01)

Switching from Google to iCloud, Nextcloud or a custom server uses the new provider's authentication method for connection tests and saves. Environment credentials display a configured indicator without exposing their values. Editing the form clears the previous connection result.

Validation host: Harness `0.2.0-rc.2` built from official sources (commit `639ed01539`) on 2026-10-01. All 178 Windows tests, the 18-plugin co-load and six calendar tool contracts pass. Browser checks use an isolated profile and a local CalDAV fixture: provider switching, connection testing, saving, event editing, month/week/agenda views and a 900px-wide window. Successful production Google/iCloud account flows still require separate validation.

## 0.5.4 (2026-09-19)

- **Fixes**: (1) `calendar_update` rebuilt the VEVENT and silently dropped ATTENDEE / ORGANIZER / EXDATE / STATUS / CATEGORIES / VALARM — renaming an event deleted its guests and reminders; the update now does field-level replacement on the original VCALENDAR and fills in the RFC 5545 essentials (VERSION / PRODID / UID / DTSTAMP). (2) RECURRENCE-ID overrides were ignored: a moved instance came back with its old time and title, or disappeared entirely when an EXDATE removed the original slot; overrides are now mapped and substituted during expansion. (3) `calendar_create` returned a locally invented uid instead of the server `Location`, so a follow-up update could not find the event (Location is now preferred, with a read-back check when absent), and the create body now carries VERSION / PRODID / DTSTAMP. **Improvements**: an exhausted expansion budget no longer returns an empty result silently (an hourly series starting in 2010 took 680ms and returned nothing) but raises a clear error suggesting a narrower range or COUNT/UNTIL; `calendar_search` accepts `start`/`end` and queries by timeRange instead of downloading the whole calendar first. Tests 68 → 79.

## 0.5.3 (2026-09-12)

- revalidate official Harness 0.1.5-rc.1 and refresh suite co-load and live-service evidence; runtime code is unchanged.

## 0.5.2 (2026-09-08)

- document installation, loading and real Google tool execution in official Harness 0.1.3-alpha.2; update compatibility and Node requirements. Runtime code is unchanged from 0.5.0.

## 0.5.1 (2026-09-08)

- document live Google OAuth/CalDAV read validation, the `calendar.readonly` versus `calendar` scope results and Testing refresh-token expiration. Runtime code is unchanged from 0.5.0.

## 0.5.0 (2026-09-07)

- fix Google CalDAV #2 with OAuth configuration/environment credentials, request-time refresh, cancellation and proxy forwarding. Make health checks and error guidance authentication-aware; retain Basic authentication for other servers.

## 0.4.0 (2026-08-26)

- new `calendar_health` self-check (offline endpoint and credential configuration checks, not a connection test).

## 0.3.2 (2026-08-15)

- Fix `calendar_update` dropping `rrule` while updating other fields.
  - Validate `end >= start` and reject impossible dates such as `2025-02-30`.
  - Sort `calendar_list` / `calendar_search` output by start time and clamp search `limit` to 1-200.
  - Reset the cached CalDAV client after creation failure so the next tool call can retry.
