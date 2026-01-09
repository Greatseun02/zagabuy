import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    columns,
    autoGenerateColumns = true,
    mode = "auto",
    rowId,
    pageSizeOptions = [10, 25, 50],
    filters: externalFilters,
    onFiltersChange,
    search: externalSearch,
    onSearchChange,
    sort: externalSort,
    onSortChange,
    pagination: externalPagination,
    onPaginationChange,
  } = props;

  // Derived mode: if explicitly server/client, keep; otherwise default to client
  const derivedMode = mode === "auto" ? "client" : mode;

  // Internal fallback state for search/filters/pagination/sorting when not provided externally
  const [internalSearch, setInternalSearch] = useState<string>("");
  const search = externalSearch ?? internalSearch;
  const setSearch = onSearchChange ?? setInternalSearch;

  const [internalFilters, setInternalFilters] = useState<
    Record<string, string>
  >({});
  const filters = externalFilters ?? internalFilters;
  const setFilters = onFiltersChange ?? setInternalFilters;

  // Column generation
  const generatedColumns = useDataGridColumns<TData>({
    columns: columns as any,
    data: data,
    autoGenerate: autoGenerateColumns,
  });

  // Table state
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: pageSizeOptions[0] ?? 10,
    }
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [internalLoading, setInternalLoading] = useState(false);

  // pagination state and setter that call external handlers when supplied
  // Handle both tuple form [state, setter] and value form with onPaginationChange callback
  const isExternalPaginationTuple = Array.isArray(externalPagination);
  const externalPaginationState = isExternalPaginationTuple
    ? externalPagination?.[0]
    : externalPagination;
  const externalPaginationSetter = isExternalPaginationTuple
    ? externalPagination?.[1]
    : undefined;

  const pagination = externalPaginationState ?? internalPagination;

  // Memoize setPagination to prevent infinite loops
  const setPagination = useCallback(
    (p: PaginationState | ((prev: PaginationState) => PaginationState)) => {
      setInternalPagination((prev) => {
        const next = typeof p === "function" ? p(prev) : p;
        return next;
      });
    },
    []
  );

  // Sync external pagination changes to internal state
  useEffect(() => {
    if (externalPaginationState) {
      setInternalPagination(externalPaginationState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPaginationState?.pageIndex, externalPaginationState?.pageSize]);

  // Call onPaginationChange when internal pagination changes (but not if it came from external)
  useEffect(() => {
    if (
      onPaginationChange &&
      internalPagination &&
      internalPagination !== externalPaginationState
    ) {
      onPaginationChange(internalPagination);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalPagination?.pageIndex, internalPagination?.pageSize]);

  // Compute filtered display data (client-side) using external search/filters if present
  const displayData = useMemo(() => {
    let d = data ?? [];
    if (search && String(search).trim()) {
      const s = String(search).toLowerCase();
      d = d.filter((r: any) => JSON.stringify(r).toLowerCase().includes(s));
    }
    if (filters && Object.keys(filters).length) {
      d = d.filter((r: any) => {
        return Object.entries(filters).every(([k, v]) => {
          if (v === undefined || v === null || String(v) === "") return true;
          const val = (r as any)[k];
          return String(val) === String(v);
        });
      });
    }
    return d;
  }, [data, search, filters]);

  // Create table instance using displayData (which has search/filters applied)
  const table = useReactTable({
    data: displayData,
    columns: generatedColumns as ColumnDef<TData, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      sorting,
    } as any,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    manualPagination:
      !!externalPaginationState ||
      !!onPaginationChange ||
      derivedMode === "server",
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
        filters,
        search,
      }),
      refetch: async () => {
        // noop - refresh should be handled by parent via onRefresh
      },
      setLoading: (v: boolean) => setInternalLoading(v),
    };
  }, [pagination, sorting, search, filters, table]);

  // Sync sorting to external sort if provided
  useEffect(() => {
    if (externalSort) {
      const s = externalSort.sortBy
        ? [
            {
              id: externalSort.sortBy,
              desc: externalSort.sortDir === "desc",
            },
          ]
        : [];
      setSorting(s as SortingState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSort]);

  // Notify external onSortChange when internal sorting changes
  useEffect(() => {
    if (onSortChange) {
      if (!sorting || sorting.length === 0) {
        onSortChange(null);
      } else {
        const s = sorting[0];
        onSortChange({
          sortBy: String(s.id ?? ""),
          sortDir: s.desc ? "desc" : "asc",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  return {
    table,
    pagination,
    setPagination,
    sorting,
    setSorting,
    search,
    setSearch,
    // expose filters handlers
    filters,
    setFilters,
    data: displayData,
    loading: props.loading ?? internalLoading,
    mode: derivedMode,
    stateRef,
  };
}
