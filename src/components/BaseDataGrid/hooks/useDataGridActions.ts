import { useRef, useImperativeHandle } from "react";
import type { BaseDataGridRef } from "../BaseDataGrid.types";

export function useDataGridActions<TData>(props: any, stateRef: any) {
  const local = useRef<BaseDataGridRef | null>(null);

  useImperativeHandle(
    props.ref,
    () =>
      ({
        refetch: async () => {
          if (stateRef.current?.refetch) await stateRef.current.refetch();
        },
        setLoading: (v: boolean) => {
          if (stateRef.current) stateRef.current.loading = v;
        },
        getSelectedRows: <R = any>() =>
          stateRef.current?.getSelectedRows?.() ?? [],
        getCurrentRows: <R = any>() =>
          stateRef.current?.getCurrentRows?.() ?? [],
        getTableState: () => stateRef.current?.getTableState?.() ?? {},
      } as BaseDataGridRef)
  );

  return {
    local,
  };
}
