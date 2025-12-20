import { useCallback } from "react";

export function useRowActions<T>(
  rowOptions: any,
  colActions: any,
  tableRef: any
) {
  const actions = useCallback(
    (row: T) => {
      const dynamic =
        typeof rowOptions === "function" ? rowOptions(row) : rowOptions || [];
      return { rowOptions: dynamic, colActions };
    },
    [rowOptions, colActions]
  );

  return { actions };
}
