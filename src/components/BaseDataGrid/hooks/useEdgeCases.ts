import { useMemo } from "react";
import type { BaseDataGridProps } from "../BaseDataGrid.types";

export function useEdgeCases<TData extends object = any>(
  props: BaseDataGridProps<TData>
) {
  return useMemo(() => {
    const warnings: string[] = [];

    // Warning 1: Missing rowId
    if (!props.rowId && !props.data?.length) {
      warnings.push(
        "⚠️ BaseDataGrid: Consider providing `rowId` prop to ensure proper key handling"
      );
    }

    // Warning 2: Auto columns without data
    if (props.autoGenerateColumns && !props.data?.length) {
      warnings.push(
        "⚠️ BaseDataGrid: autoGenerateColumns enabled but no data provided. Columns cannot be generated."
      );
    }

    // Warning 3: Missing onQueryChange in server mode
    if (props.mode === "server" && !props.onQueryChange) {
      warnings.push(
        '⚠️ BaseDataGrid: mode="server" but no onQueryChange function provided. Switching to client mode.'
      );
    }

    // Warning 4: Both data and onQueryChange provided
    if (props.data?.length && props.onQueryChange && props.mode !== "server") {
      warnings.push(
        "⚠️ BaseDataGrid: Both data and onQueryChange provided. Using mode detection."
      );
    }

    // Warning 5: Large dataset without pagination
    if (props.data && props.data.length > 1000 && !props.pageSizeOptions) {
      warnings.push(
        "⚠️ BaseDataGrid: Large dataset (>1000 rows) without explicit pageSizeOptions. Consider paginating."
      );
    }

    // Log warnings in development
    if (process.env.NODE_ENV === "development") {
      warnings.forEach((w) => console.warn(w));
    }

    return warnings;
  }, [
    props.rowId,
    props.data?.length,
    props.autoGenerateColumns,
    props.mode,
    props.onQueryChange,
    props.pageSizeOptions,
  ]);
}
