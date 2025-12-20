import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { normalizeColumns } from "../utils/normalizeColumns";
import { useAutoColumnDetection } from "./useAutoColumnDetection";

export function useDataGridColumns<T extends Record<string, any>>(opts: {
  columns?: ColumnDef<T, any>[];
  data?: T[];
  autoGenerate?: boolean;
}) {
  const auto = useAutoColumnDetection(opts.data);

  return useMemo(() => {
    if (opts.columns && opts.columns.length)
      return normalizeColumns(opts.columns);
    if (!opts.autoGenerate) return [];
    // generate from auto
    const cols: ColumnDef<T, any>[] = (auto as any).map((c: any) => ({
      id: c.key,
      accessorFn: (row: any) => row[c.key],
      header: c.key.replace(/_/g, " "),
      cell: (info: any) => info.getValue(),
    }));
    return normalizeColumns(cols);
  }, [opts.columns, auto, opts.autoGenerate]);
}
