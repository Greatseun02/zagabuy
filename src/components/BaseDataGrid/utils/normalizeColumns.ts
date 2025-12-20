import { ColumnDef } from "@tanstack/react-table";

export function normalizeColumns<T>(
  cols: ColumnDef<T, any>[]
): ColumnDef<T, any>[] {
  return cols.map((c) => ({
    ...c,
    header:
      c.header ?? (typeof c.id === "string" ? c.id.replace(/_/g, " ") : ""),
    cell: c.cell ?? ((info) => info.getValue()),
  }));
}
