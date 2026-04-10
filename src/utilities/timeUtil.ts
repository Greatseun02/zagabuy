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
    format: string | Intl.DateTimeFormatOptions,
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
      | "years",
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
    to: string | number | Date,
  ): number {
    return this.difference(from, to, "seconds");
  }

  /**
   * Date-fns equivalent: differenceInDays
   */
  static differenceInDays(
    from: string | number | Date,
    to: string | number | Date,
  ): number {
    return this.difference(from, to, "days");
  }

  /**
   * Date-fns equivalent: isBefore
   */
  static isBefore(
    a: string | number | Date,
    b: string | number | Date,
  ): boolean {
    return this.parse(a) < this.parse(b);
  }

  /**
   * Date-fns equivalent: isAfter
   */
  static isAfter(
    a: string | number | Date,
    b: string | number | Date,
  ): boolean {
    return this.parse(a) > this.parse(b);
  }

  static isValidDate(dateInput: string | number): boolean {
    if (!dateInput) return false;

    const input = String(dateInput).trim();

    // Must start with YYYY-MM-DD — all dates from this API follow this pattern
    if (!/^\d{4}-\d{2}-\d{2}/.test(input)) return false;

    const normalized = input.replace(" ", "T");
    return DateTime.fromISO(normalized).isValid;
  }

  /* ---------------------------------- */
  /* Legacy helpers (used across app)    */
  /* ---------------------------------- */

  /**
   * Format a JS Date using token patterns
   * @example TimeUtil.formatDate(new Date(), "MMM dd, yyyy") // Jan 14, 2025
   */
  static formatDate(
    date: Date,
    format: string | ((date: Date) => string),
  ): string {
    if (typeof format === "function") return format(date);

    const map: Record<string, string> = {
      yyyy: date.getFullYear().toString(),
      yy: date.getFullYear().toString().slice(-2),
      MM: (date.getMonth() + 1).toString().padStart(2, "0"),
      M: (date.getMonth() + 1).toString(),
      dd: date.getDate().toString().padStart(2, "0"),
      d: date.getDate().toString(),
      HH: date.getHours().toString().padStart(2, "0"),
      H: date.getHours().toString(),
      mm: date.getMinutes().toString().padStart(2, "0"),
      m: date.getMinutes().toString(),
      ss: date.getSeconds().toString().padStart(2, "0"),
      s: date.getSeconds().toString(),
      milliseconds: date.getTime().toString(),
      iso: date.toISOString(),
    };

    return format.replace(
      /yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s|milliseconds|iso/g,
      (matched) => map[matched],
    );
  }

  /**
   * Get formatted date and time parts from a date string
   */
  static getFormatDateTime(
    input: string | number | Date,
    options?: {
      formatDateAs?: Intl.DateTimeFormatOptions;
      formatTimeAs?: Intl.DateTimeFormatOptions;
    },
  ): {
    formattedDate: string;
    formattedTime: string;
    fullFormattedDateTime: string;
    isDateTimeValid: boolean;
  } {
    if (!this.isValidDate(String(input))) {
      return {
        formattedDate: "Invalid date",
        formattedTime: "Invalid time",
        fullFormattedDateTime: "Invalid DateTime",
        isDateTimeValid: false,
      };
    }

    const inputStr = String(input);
    const consistentString = inputStr.replace(/ /g, "T");
    const hasTimezone = /[Zz]$|[+-]\d{2}:?\d{2}$/.test(consistentString);
    const hasTime = consistentString.includes(":");
    const normalizedString = hasTimezone
      ? consistentString
      : hasTime
        ? consistentString + "Z"
        : consistentString;

    const dateTime = DateTime.fromISO(normalizedString).toLocal();

    if (!dateTime.isValid) {
      return {
        formattedDate: "Invalid date",
        formattedTime: "Invalid time",
        fullFormattedDateTime: "Invalid DateTime",
        isDateTimeValid: false,
      };
    }

    const formattedDate = dateTime.toLocaleString(
      options?.formatDateAs ?? DateTime.DATE_MED,
    );
    const formattedTime = dateTime.toLocaleString(
      options?.formatTimeAs ?? DateTime.TIME_24_SIMPLE,
    );

    return {
      formattedDate,
      formattedTime: formattedTime === "00:00" ? "" : formattedTime,
      fullFormattedDateTime: `${formattedDate}${formattedTime === "00:00" ? "" : ", " + formattedTime}`.trim(),
      isDateTimeValid: true,
    };
  }

  /**
   * Format date string with ordinal suffix
   * @example TimeUtil.formatDateString("2025-01-14T10:30:00") // Jan 14th, 2025 10:30:00
   */
  static formatDateString(dateString: string): string {
    if (!dateString) return dateString;
    const consistentDateString = dateString.replace("T", " ");
    const newFormatRegex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}$/;

    let dateTime: DateTime;
    if (newFormatRegex.test(consistentDateString)) {
      dateTime = DateTime.fromISO(consistentDateString);
    } else {
      const isoStringWithTAndZ = consistentDateString.replace(" ", "T") + "Z";
      dateTime = DateTime.fromISO(isoStringWithTAndZ);
    }

    const formattedDateString = dateTime.toFormat("LLL d' 'yyyy HH:mm:ss");
    const [month, day, year, time] = formattedDateString.split(" ");
    const dayWithSuffix = `${parseInt(day)}${TimeUtil.getOrdinalSuffix(parseInt(day))}`;
    return `${month} ${dayWithSuffix}, ${year} ${time}`;
  }

  /**
   * Get ordinal suffix for a number (1st, 2nd, 3rd, 4th, etc.)
   */
  static getOrdinalSuffix(num: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = num % 100;
    return (
      suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]
    );
  }

  /**
   * Get decorated date label (TODAY, YESTERDAY, or formatted date)
   */
  static getDecoratedDate(dataTime: string): string {
    const isoStringWithTAndZ = dataTime.replace(" ", "T") + "Z";
    const eventDateTime = DateTime.fromISO(isoStringWithTAndZ);
    const currentDateTime = DateTime.local();

    if (eventDateTime.hasSame(currentDateTime, "day")) return "TODAY";
    if (eventDateTime.hasSame(currentDateTime.minus({ days: 1 }), "day"))
      return "YESTERDAY";

    const formattedDate = eventDateTime.toFormat("LLL d");
    if (eventDateTime.year !== currentDateTime.year) {
      const ordinalDay = eventDateTime.toFormat("d");
      const formattedYear = eventDateTime.toFormat("yyyy");
      return `${formattedDate}, ${ordinalDay}${TimeUtil.getOrdinalSuffix(parseInt(ordinalDay))}, ${formattedYear}`;
    }
    return formattedDate;
  }

  /**
   * Format as time ago string (e.g. "5 minutes ago")
   */
  static formatGetTimeInMinSecHrAgo(dateString: string): string {
    return TimeUtil.timeAgo(dateString);
  }

  /**
   * Format date without time
   * @example TimeUtil.getFormattedDateStringWithoutTime("2025-01-14") // Jan 14th, 2025
   */
  static getFormattedDateStringWithoutTime(
    dateString: string,
    showOrdinalSuffix = true,
  ): string {
    const isoStringWithTAndZ = dateString.replace(" ", "T") + "Z";
    const dateTime = DateTime.fromISO(isoStringWithTAndZ);
    const formattedDateString = dateTime.toFormat("LLL d' 'yyyy");
    const [month, day, year] = formattedDateString.split(" ");
    const dayWithSuffix = `${parseInt(day)}${TimeUtil.getOrdinalSuffix(parseInt(day))}`;
    return showOrdinalSuffix
      ? `${month} ${dayWithSuffix}, ${year}`
      : `${month} ${day}, ${year}`;
  }

  /**
   * Format YYYY/MM/DD to Mon Day, Year
   */
  static formatDateToMonDayYear(dateString: string): string {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const [year, monthIndex, day] = dateString.split("/").map(Number);
    const date = new Date(year, monthIndex - 1, day);
    const monthName = months[date.getMonth()];
    return `${monthName} ${day}, ${year}`;
  }

  /**
   * Format YYYY/MM/DD to YYYY-MM-DD
   */
  static formatToDashedDate(dateString: string): string {
    return dateString.replace(/\//g, "-");
  }

  /**
   * Format datetime for filtering
   */
  static formatDateTimeForFilter(dateTime: string): string {
    const isoStringWithTAndZ = dateTime.replace(" ", "T") + "Z";
    const dateTimeIso = DateTime.fromISO(isoStringWithTAndZ);
    return dateTimeIso.toISO() || "";
  }

  /**
   * Simplified date formatting — returns date part only (YYYY-MM-DD)
   */
  static formatDateTime(date: string): string {
    return date.split("T")[0];
  }

  /**
   * Convert to ISO with timezone offset (+01:00)
   */
  static convertToTargetISO(dateTime: string): string {
    const correctedDateTime = dateTime.replace(/(\.\d{1,2})$/, (match) => {
      return match.length === 3
        ? match + "0"
        : match.length === 2
          ? match + "00"
          : match + "000";
    });
    const originalDateTime = DateTime.fromFormat(
      correctedDateTime,
      "yyyy-MM-dd HH:mm:ss.SSS",
      { zone: "utc" },
    );
    const adjustedDateTime = originalDateTime.setZone("UTC+1");
    return adjustedDateTime.toISO({ includeOffset: true }) || "";
  }

  /**
   * Convert to ISO with milliseconds and UTC Z suffix
   */
  static convertToISOWithMilliseconds(dateTime: string): string {
    const correctedDateTime = dateTime.replace(/(\.\d{1,2})$/, (match) => {
      return match.length === 3
        ? match + "0"
        : match.length === 2
          ? match + "00"
          : match + "000";
    });
    const originalDateTime = DateTime.fromFormat(
      correctedDateTime,
      "yyyy-MM-dd HH:mm:ss.SSS",
      { zone: "utc" },
    );
    return (
      originalDateTime.toISO({
        suppressMilliseconds: false,
        includeOffset: false,
      }) + "Z"
    );
  }

  /**
   * Parse value into a JS Date (alias for parse().toJSDate())
   */
  static parseDate(
    value: unknown,
    inputFormat?: string,
  ): Date | undefined {
    if (value instanceof Date) return value;
    if (typeof value === "number") return new Date(value);
    if (typeof value !== "string") return undefined;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }
}
