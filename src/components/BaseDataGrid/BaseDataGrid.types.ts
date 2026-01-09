import type { ColumnDef } from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";

export type SortDirection = "asc" | "desc";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface ServerQueryState {
  search?: string;
  filters?: Record<string, unknown>;
  sort?: { field: string; direction: SortDirection } | null;
  pagination?: PaginationState;
}

export interface ActionConfig<T = any> {
  icon?: string | React.ReactNode;
  label?: string;
  tooltip?: string;
  onClick: (row: T, actions: BaseDataGridRef) => void | Promise<void>;
  danger?: boolean;
  disabled?: (row: T) => boolean;
  confirm?: {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive" | "warning" | "info" | "success";
  };
}

export interface ColActions<T = any> {
  view?: ActionConfig<T>;
  edit?: ActionConfig<T>;
  delete?: ActionConfig<T>;
  [key: string]: ActionConfig<T> | undefined;
}

export interface RowOption<T = any> {
  label: string;
  icon?: LucideIcon;
  onClick: (row: T, actions: BaseDataGridRef) => void | Promise<void>;
  danger?: boolean;
  disabled?: (row: T) => boolean;
}

export interface BaseDataGridProps<TData extends object = any> {
  data?: TData[];
  /**
   * External state bindings (RTK-friendly)
   */
  filters?: Record<string, string>;
  onFiltersChange?: (f: Record<string, string>) => void;
  search?: string;
  onSearchChange?: (s: string) => void;
  sort?: { sortBy: string; sortDir: string } | null;
  onSortChange?: (s: { sortBy: string; sortDir: string } | null) => void;
  /**
   * Pagination can be passed as a useState tuple or managed via `onPaginationChange`.
   * Example: `pagination={useState({ pageIndex: 0, pageSize: 10 })}`
   * Or just the state: `pagination={pagination}` with `onPaginationChange={setPagination}`
   */
  pagination?:
    | PaginationState
    | [PaginationState, React.Dispatch<React.SetStateAction<PaginationState>>];
  onPaginationChange?: (p: PaginationState) => void;
  /**
   * Called when the toolbar refresh button is clicked.
   */
  onRefresh?: () => void;
  columns?: ColumnDef<TData>[];
  autoGenerateColumns?: boolean;
  mode?: "client" | "server" | "auto";
  rowId?: string | ((row: TData) => string | number);
  colActions?: ColActions<TData>;
  rowOptions?: RowOption<TData>[] | ((row: TData) => RowOption<TData>[]);
  onQueryChange?: (query: ServerQueryState) => void;
  onRowClick?: (row: TData) => void;
  pageSizeOptions?: number[];
  loading?: boolean;
  className?: string;
  emptyState?: React.ReactNode;
  ref?: React.Ref<BaseDataGridRef>;
  renderers?: Partial<Record<string, React.ComponentType<any>>>;
}

export interface BaseDataGridRef {
  refetch: () => Promise<void>;
  setLoading: (value: boolean) => void;
  getSelectedRows: <T = any>() => T[];
  getCurrentRows: <T = any>() => T[];
  getTableState: () => ServerQueryState & { pagination: PaginationState };
}
