/** Validate calendar dates before Date/ical.js can silently normalize them. */
export const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const DATETIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?(Z|[+-]\d{2}:\d{2})$/

export function assertIsoTime(value: string, label: string): void {
  const dateOnly = DATE_ONLY_PATTERN.exec(value)
  const parts = dateOnly ?? DATETIME_PATTERN.exec(value)
  const invalid = () => new Error(label + ' 不是合法的 ISO 8601 时间：' + value + '。必须是真实存在的日期；定时事件须含时区，例如 2025-01-01T09:00:00+08:00 或 2025-01-01T09:00:00Z。')
  if (!parts) throw invalid()
  const year = Number(parts[1]), month = Number(parts[2]), day = Number(parts[3])
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1]) throw invalid()
  if (dateOnly) return
  const hour = Number(parts[4]), minute = Number(parts[5]), second = Number(parts[6] ?? 0)
  // ISO 8601 permits 24:00 only as midnight at the end of this valid date.
  if (hour > 24 || minute > 59 || second > 59 || (hour === 24 && (minute !== 0 || second !== 0 || /[1-9]/.test(parts[7] ?? '')))) throw invalid()
  const zone = parts[8]
  if (zone !== 'Z' && (Number(zone.slice(1, 3)) > 23 || Number(zone.slice(4)) > 59)) throw invalid()
  if (Number.isNaN(new Date(value).getTime())) throw invalid()
}
