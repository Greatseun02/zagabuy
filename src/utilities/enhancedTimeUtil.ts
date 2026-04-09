// Enhanced TimeUtil integration
import { TimeUtil } from "@/utilities/timeUtil";
import { DateRange } from "react-day-picker";

export type DateFormatType =
  | "iso" // ISO 8601: "2024-01-15T10:30:00.000Z"
  | "timestamp-ms" // Unix timestamp in milliseconds: 1705312200000
  | "timestamp-s" // Unix timestamp in seconds: 1705312200
  | "date-object" // JavaScript Date object
  | "date-only" // ISO date only: "2024-01-15"
  | "datetime-local" // HTML datetime-local: "2024-01-15T10:30"
  | "formatted" // Locale formatted: "1/15/2024" (US) or "15/01/2024" (UK)
  | "luxon-iso" // Luxon ISO format (integrates with your TimeUtil)
  | "custom"; // Custom format using format string

export type SupportedLocale =
  | "en-US"
  | "en-GB"
  | "en-CA"
  | "en-AU"
  | "fr-FR"
  | "fr-CA"
  | "de-DE"
  | "de-AT"
  | "de-CH"
  | "es-ES"
  | "es-MX"
  | "es-AR"
  | "it-IT"
  | "pt-BR"
  | "pt-PT"
  | "ja-JP"
  | "ko-KR"
  | "zh-CN"
  | "zh-TW"
  | "ru-RU"
  | "ar-SA"
  | "hi-IN"
  | string;

export type SupportedTimeZone =
  | "UTC"
  | "GMT"
  | "America/New_York"
  | "America/Chicago"
  | "America/Denver"
  | "America/Los_Angeles"
  | "America/Toronto"
  | "America/Mexico_City"
  | "America/Sao_Paulo"
  | "Europe/London"
  | "Europe/Paris"
  | "Europe/Berlin"
  | "Europe/Rome"
  | "Asia/Tokyo"
  | "Asia/Seoul"
  | "Asia/Shanghai"
  | "Asia/Hong_Kong"
  | "Australia/Sydney"
  | "Australia/Melbourne"
  | "Pacific/Auckland"
  | string;

export interface DateFormatOptions {
  locale?: SupportedLocale;
  timeZone?: SupportedTimeZone;
  customFormat?: string;
  includeTime?: boolean;
}

export type DateFormatTypeMap = {
  iso: string;
  "timestamp-ms": number;
  "timestamp-s": number;
  "date-object": Date;
  "date-only": string;
  "datetime-local": string;
  formatted: string;
  "luxon-iso": string;
  custom: string;
};

export interface DateFormatConfig<
  TInput extends DateFormatType = "date-object",
  TOutput extends DateFormatType = "date-object",
> {
  input: TInput;
  output: TOutput;
  display?: DateFormatType;
  options?: DateFormatOptions;
}

export const DateFormatPresets = {
  timestamp: {
    input: "timestamp-ms" as const,
    output: "timestamp-ms" as const,
  },
  apiStandard: { input: "iso" as const, output: "iso" as const },
  timeUtilCompatible: {
    input: "luxon-iso" as const,
    output: "luxon-iso" as const,
  },
  htmlDate: { input: "date-only" as const, output: "date-only" as const },
  international: (
    locale: SupportedLocale = "en-US",
    timeZone: SupportedTimeZone = "UTC",
  ) => ({
    input: "iso" as const,
    output: "iso" as const,
    options: { locale, timeZone },
  }),
} as const;

export type DateRangeFormatTypeMap = {
  iso: { from?: string; to?: string };
  "timestamp-ms": { from?: number; to?: number };
  "timestamp-s": { from?: number; to?: number };
  "date-object": DateRange;
  "date-only": { from?: string; to?: string };
  "datetime-local": { from?: string; to?: string };
  formatted: { from?: string; to?: string };
  "luxon-iso": { from?: string; to?: string };
  custom: { from?: string; to?: string };
};

export class EnhancedTimeUtil extends TimeUtil {
  static parseInput(
    value: unknown,
    inputFormat: DateFormatType,
  ): Date | undefined {
    if (!value) return undefined;

    switch (inputFormat) {
      case "iso":
      case "luxon-iso":
        return typeof value === "string" ? new Date(value) : undefined;

      case "timestamp-ms":
        return typeof value === "number" ? new Date(value) : undefined;

      case "timestamp-s":
        return typeof value === "number" ? new Date(value * 1000) : undefined;

      case "date-object":
        return value instanceof Date ? value : undefined;

      case "date-only":
        if (typeof value === "string") {
          if (!this.isValidDate(value)) return undefined;
          // Use local timezone to prevent day shifting
          return this.createLocalDate(value);
        }
        return undefined;

      case "datetime-local":
        return typeof value === "string" ? new Date(value) : undefined;

      case "formatted":
        if (typeof value === "string") {
          return this.isValidDate(value) ? new Date(value) : undefined;
        }
        return undefined;

      case "custom":
        return this.parseDate(value);

      default:
        throw new Error(`Unsupported input format: ${inputFormat}`);
    }
  }

  static formatOutput(
    date: Date | undefined,
    outputFormat: DateFormatType,
    options?: DateFormatOptions,
  ): unknown {
    if (!date) return undefined;

    switch (outputFormat) {
      case "iso":
        return date.toISOString();

      case "luxon-iso":
        return this.formatDateTimeForFilter(date.toISOString());

      case "timestamp-ms":
        return date.getTime();

      case "timestamp-s":
        return Math.floor(date.getTime() / 1000);

      case "date-object":
        return date;

      case "date-only":
        // Use local timezone to prevent day shifting
        return this.formatLocalDateOnly(date);

      case "datetime-local": {
        // Wrap in curly braces to create a block scope
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      case "formatted":
        return this.formatForLocale(date, options);

      case "custom":
        if (options?.customFormat) {
          return this.formatDate(date, options.customFormat);
        }
        return date.toISOString();

      default:
        throw new Error(`Unsupported output format: ${outputFormat}`);
    }
  }

  static formatForDisplay(
    date: Date | undefined,
    displayFormat: DateFormatType = "formatted",
    options?: DateFormatOptions,
  ): string {
    if (!date) return "";

    switch (displayFormat) {
      case "formatted":
        return this.formatForLocale(date, options);

      case "iso":
      case "luxon-iso":
        return date.toISOString();

      case "date-only":
        // Use local timezone for display
        return this.formatLocalDateOnly(date);

      case "custom":
        if (options?.customFormat) {
          return this.formatDate(date, options.customFormat);
        }
        return this.formatForLocale(date, options);

      default:
        return this.formatForLocale(date, options);
    }
  }

  // Range-specific helpers
  static parseRangeInput(
    value: unknown,
    inputFormat: DateFormatType,
  ): DateRange | undefined {
    if (!value) return undefined;

    // Handle direct DateRange objects
    if (this.isDateRange(value)) {
      return {
        from: value.from ? this.parseInput(value.from, inputFormat) : undefined,
        to: value.to ? this.parseInput(value.to, inputFormat) : undefined,
      };
    }

    return undefined;
  }

  static formatRangeOutput(
    range: DateRange | undefined,
    outputFormat: DateFormatType,
    options?: DateFormatOptions,
  ): unknown {
    if (!range) return undefined;

    const formatted: any = {};
    if (range.from) {
      formatted.from = this.formatOutput(range.from, outputFormat, options);
    }
    if (range.to) {
      formatted.to = this.formatOutput(range.to, outputFormat, options);
    }

    return outputFormat === "date-object" ? range : formatted;
  }

  static createFormatter<
    TInput extends DateFormatType = "date-object",
    TOutput extends DateFormatType = "date-object",
  >(config: DateFormatConfig<TInput, TOutput>) {
    return {
      parseInput: (value: unknown): Date | undefined =>
        this.parseInput(value, config.input),

      formatOutput: (date: Date | undefined): unknown =>
        this.formatOutput(date, config.output, config.options),

      formatForDisplay: (date: Date | undefined): string =>
        this.formatForDisplay(
          date,
          config.display || "formatted",
          config.options,
        ),

      parseRangeInput: (value: unknown): DateRange | undefined =>
        this.parseRangeInput(value, config.input),

      formatRangeOutput: (range: DateRange | undefined): unknown =>
        this.formatRangeOutput(range, config.output, config.options),

      config,
    };
  }

  // Type guard for DateRange
  private static isDateRange(value: unknown): value is DateRange {
    return (
      typeof value === "object" &&
      value !== null &&
      "from" in value &&
      "to" in value
    );
  }

  /**
   * Creates a Date object at local midnight for date-only strings
   * Prevents timezone shifting issues
   */
  private static createLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }

  /**
   * Formats Date to date-only string in local timezone
   * Prevents timezone shifting issues
   */
  private static formatLocalDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private static formatForLocale(
    date: Date,
    options?: DateFormatOptions,
  ): string {
    if (options?.includeTime) {
      const formatted = this.getFormatDateTime(date.toISOString(), {
        formatDateAs: undefined,
        formatTimeAs: undefined,
      });
      return formatted.fullFormattedDateTime;
    }

    const formatted = this.getFormatDateTime(date.toISOString());
    return formatted.formattedDate;
  }
}
