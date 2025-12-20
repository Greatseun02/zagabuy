import { useCallback, useEffect, useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import type {
  BaseDataGridProps,
  ServerQueryState,
  BaseDataGridRef,
} from "../BaseDataGrid.types";
import { useDataGridColumns } from "./useDataGridColumns";
import { useClientFiltering } from "./useClientFiltering";
import { useServerFiltering } from "./useServerFiltering";

/**
 * Main orchestrator hook for BaseDataGrid
 * Combines table state, filtering, pagination, and server/client modes
 */
export function useBaseDataGrid<TData extends object = any>(
  props: BaseDataGridProps<TData>
) {
  const {
    data = [],
    fetchData,
    columns,
    autoGenerateColumns = true,
    mode = "auto",
    rowId,
    pageSizeOptions = [10, 25, 50],
  } = props;

  // Detect mode
  const derivedMode =
    mode === "auto" ? (fetchData ? "server" : "client") : mode;

  // Client filtering
  const { filtered, search, setSearch } = useClientFiltering(data);

  // Server filtering
  const { query, setQuery } = useServerFiltering();

  // Determine which data to use
  const displayData = derivedMode === "client" ? filtered : data;

  // Column generation
  const generatedColumns = useDataGridColumns<TData>({
    columns: columns as any,
    data: displayData,
    autoGenerate: autoGenerateColumns,
  });

  // Table state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSizeOptions[0] ?? 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [internalLoading, setInternalLoading] = useState(false);

  // Create table instance
  const table = useReactTable({
    data: displayData,
    columns: generatedColumns as ColumnDef<TData, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel:
      derivedMode === "client" ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      sorting,
    } as any,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    manualPagination: derivedMode === "server",
  });

  // Ref for external control
  const stateRef = useRef<any>({});

  useEffect(() => {
    stateRef.current = {
      getSelectedRows: () => [],
      getCurrentRows: () => table.getRowModel().rows.map((r) => r.original),
      getTableState: () => ({
        pagination,
        sorting,
        filters: query,
        search,
      }),
      refetch: async () => {
        if (fetchData) {
          setInternalLoading(true);
          try {
            const state = {
              pagination: {
                page: pagination.pageIndex + 1,
                pageSize: pagination.pageSize,
              },
              sorting: sorting.length
                ? {
                    field: sorting[0].id,
                    direction: sorting[0].desc ? "desc" : "asc",
                  }
                : null,
              search,
              filters: query,
            };
            await fetchData(state as ServerQueryState);
          } finally {
            setInternalLoading(false);
          }
        }
      },
      setLoading: (v: boolean) => setInternalLoading(v),
    };
  }, [pagination, sorting, search, query, fetchData, table]);

  // Server-side sync
  useEffect(() => {
    if (derivedMode === "server" && fetchData) {
      const q: ServerQueryState = {
        pagination: {
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
        },
        search,
        sort: sorting.length
          ? {
              field: sorting[0].id,
              direction: sorting[0].desc ? "desc" : "asc",
            }
          : null,
        filters: query,
      };
      props.onQueryChange?.(q);
      const fetch = async () => {
        setInternalLoading(true);
        try {
          await fetchData(q);
        } finally {
          setInternalLoading(false);
        }
      };
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, sorting, search, derivedMode]);

  return {
    table,
    pagination,
    setPagination,
    sorting,
    setSorting,
    search,
    setSearch,
    query,
    setQuery,
    data: displayData,
    loading: props.loading ?? internalLoading,
    mode: derivedMode,
    stateRef,
  };
}
