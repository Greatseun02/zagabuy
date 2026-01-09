import { DateTime } from "luxon";

/**
 * TimeUtil
 *
 * Lightweight, Luxon-based date utility.
 * Accepts ISO strings, SQL datetime strings, JS Date, or timestamps.
 */
export class TimeUtil {
  /* ---------------------------------- */
  /* Core parsing                        */
  /* ---------------------------------- */

  /**
   * Safely parse input into Luxon DateTime
   */
  static parse(value: string | number | Date): DateTime {
    if (value instanceof Date) {
      return DateTime.fromJSDate(value);
    }

    if (typeof value === "number") {
      return value.toString().length === 10
        ? DateTime.fromSeconds(value)
        : DateTime.fromMillis(value);
    }

    if (typeof value === "string") {
      // SQL datetime: "2025-01-02 23:39:46.693825"
      if (value.includes(" ") && !value.includes("T")) {
        return DateTime.fromSQL(value);
      }

      return DateTime.fromISO(value);
    }

    return DateTime.invalid("Invalid date input");
  }

  /**
   * Alias for parse() - returns a Luxon DateTime object
   */
  static parseDateTime(value: string | number | Date): DateTime {
    return this.parse(value);
  }

  /**
   * Get current time as Luxon DateTime
   */
  static localNow(): DateTime {
    return DateTime.local();
  }

  /* ---------------------------------- */
  /* Formatting                          */
  /* ---------------------------------- */

  /**
   * Format a date using Luxon tokens
   *
   * @example
   * TimeUtil.format("2025-01-14", "MMM d") // Jan 14
   * TimeUtil.format(date, "yyyy-MM-dd")
   * TimeUtil.format(date, DateTime.DATE_MED)
   */
  static format(
    value: string | number | Date,
    format: string | Intl.DateTimeFormatOptions
  ): string {
    const dt = this.parse(value);
    if (!dt.isValid) return "";

    return typeof format === "string"
      ? dt.toFormat(format)
      : dt.toLocaleString(format);
  }

  /**
   * ISO string of now
   */
  static now(): string {
    return DateTime.local().toISO() ?? "";
  }

  /**
   * Timestamp (ms)
   */
  static timestamp(value: string | number | Date): number {
    return this.parse(value).toMillis();
  }

  /* ---------------------------------- */
  /* Relative / decorated helpers        */
  /* ---------------------------------- */

  /**
   * Human-friendly time label
   *
   * @example
   * Today → 14:30
   * Yesterday
   * Mon
   * Jan 14
   */
  static decorateDate(value: string | number | Date): string {
    const dt = this.parse(value);
    if (!dt.isValid) return "";

    const now = DateTime.local();

    if (dt.hasSame(now, "day")) return "Today";
    if (dt.hasSame(now.minus({ days: 1 }), "day")) return "Yesterday";

    const diffDays = Math.floor(now.diff(dt, "days").days);

    if (diffDays >= 2 && diffDays <= 6) {
      return dt.toFormat("ccc"); // Mon, Tue
    }

    return dt.toFormat("MMM d");
  }

  /**
   * Time ago formatter
   *
   * @example
   * 2 minutes ago
   * 3 hours ago
   * 5 days ago
   */
  static timeAgo(value: string | number | Date): string {
    const dt = this.parse(value);
    if (!dt.isValid) return "";

    return dt.toRelative() ?? "";
  }

  /* ---------------------------------- */
  /* Validation                          */
  /* ---------------------------------- */

  /**
   * Validate date input
   */
  static isValid(value: string | number | Date): boolean {
    return this.parse(value).isValid;
  }

  /**
   * Generic difference between two dates
   *
   * @example
   * TimeUtil.difference(a, b, "seconds")
   * TimeUtil.difference(a, b, "days")
   */
  static difference(
    from: string | number | Date,
    to: string | number | Date,
    unit:
      | "milliseconds"
      | "seconds"
      | "minutes"
      | "hours"
      | "days"
      | "weeks"
      | "months"
      | "years"
  ): number {
    const fromDt = this.parse(from);
    const toDt = this.parse(to);

    if (!fromDt.isValid || !toDt.isValid) return 0;

    return Math.floor(toDt.diff(fromDt, unit)[unit]);
  }

  /**
   * Date-fns equivalent: differenceInSeconds
   */
  static differenceInSeconds(
    from: string | number | Date,
    to: string | number | Date
  ): number {
    return this.difference(from, to, "seconds");
  }

  /**
   * Date-fns equivalent: differenceInDays
   */
  static differenceInDays(
    from: string | number | Date,
    to: string | number | Date
  ): number {
    return this.difference(from, to, "days");
  }

  /**
   * Date-fns equivalent: isBefore
   */
  static isBefore(
    a: string | number | Date,
    b: string | number | Date
  ): boolean {
    return this.parse(a) < this.parse(b);
  }

  /**
   * Date-fns equivalent: isAfter
   */
  static isAfter(
    a: string | number | Date,
    b: string | number | Date
  ): boolean {
    return this.parse(a) > this.parse(b);
  }
}
