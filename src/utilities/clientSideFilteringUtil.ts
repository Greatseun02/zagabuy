export type FieldOptions = {
  /** If true, take left token before a hyphen when evaluating the field value */
  useLeftToken?: boolean;
  /** Optional list of enum values to consider when matching (raw strings) */
  enumValues?: Array<string>;
};

export class ClientSideFilterUtil {
  private static normalize(s: any): string {
    if (s === undefined || s === null) return "";
    return String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  private static getRawFieldValue(
    obj: any,
    field: string,
    opts?: FieldOptions
  ): string {
    const raw = obj?.[field];
    if (raw === undefined || raw === null) return "";
    const str = String(raw);
    if (opts?.useLeftToken) return str.split("-")[0].trim();
    return str;
  }

  static matchesField(
    obj: any,
    field: string,
    needle: any,
    opts?: FieldOptions
  ): boolean {
    if (needle === undefined || needle === null || String(needle) === "")
      return true;
    const rawVal = this.getRawFieldValue(obj, field, opts);
    const valNorm = this.normalize(rawVal);
    const needleNorm = this.normalize(needle);

    // If enum values are provided, check normalized equality against them
    if (
      opts?.enumValues &&
      Array.isArray(opts.enumValues) &&
      opts.enumValues.length > 0
    ) {
      const enumsNorm = opts.enumValues.map((v) => this.normalize(v));
      // If both the left token and the needle correspond to enum entries, match if equal
      if (enumsNorm.includes(valNorm) && enumsNorm.includes(needleNorm))
        return valNorm === needleNorm;
    }

    // Fallback to substring match on normalized values
    return valNorm.indexOf(needleNorm) !== -1;
  }

  static filterRows<T>(
    rows: T[],
    params?: {
      filters?: Record<string, any>;
      search?: string;
      fieldOptions?: Record<string, FieldOptions>;
    }
  ): T[] {
    if (!rows || rows.length === 0) return [];

    const { filters = {}, search = "", fieldOptions = {} } = params || {};

    let result = rows.slice();

    // Global search across all values
    if (search && String(search).trim() !== "") {
      const needle = this.normalize(search);
      result = result.filter((r) =>
        Object.values(r as Record<string, string>)
          .filter((v) => v !== undefined && v !== null)
          .some((v) => this.normalize(v).indexOf(needle) !== -1)
      );
    }

    // Field-specific filters
    if (filters && Object.keys(filters).length > 0) {
      result = result.filter((row) => {
        return Object.entries(filters).every(([field, value]) => {
          const opts = fieldOptions?.[field];
          return this.matchesField(row, field, value, opts);
        });
      });
    }

    return result;
  }

  static sortRows<T>(
    rows: T[],
    sortBy?: string,
    sortDir: "asc" | "desc" = "asc",
    fieldOptions?: Record<string, FieldOptions>
  ): T[] {
    if (!sortBy) return rows;
    const dir = (sortDir || "asc").toLowerCase() === "asc" ? 1 : -1;

    const getValue = (obj: any) =>
      this.getRawFieldValue(obj, sortBy, fieldOptions?.[sortBy]);

    return rows.slice().sort((a: any, b: any) => {
      const avRaw = getValue(a);
      const bvRaw = getValue(b);

      if (
        (avRaw === undefined || avRaw === null || avRaw === "") &&
        (bvRaw === undefined || bvRaw === null || bvRaw === "")
      )
        return 0;
      if (avRaw === undefined || avRaw === null || avRaw === "") return 1 * dir;
      if (bvRaw === undefined || bvRaw === null || bvRaw === "")
        return -1 * dir;

      // numeric compare when both are numeric
      const aNum = Number(avRaw);
      const bNum = Number(bvRaw);
      if (!isNaN(aNum) && !isNaN(bNum)) return (aNum - bNum) * dir;

      // normalize and compare strings
      const aStr = this.normalize(avRaw);
      const bStr = this.normalize(bvRaw);
      if (aStr === bStr) return 0;
      return aStr > bStr ? dir : -dir;
    });
  }
}

export default ClientSideFilterUtil;
