import type { ColumnDef } from "@tanstack/react-table";

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
  icon?: string | React.ReactNode;
  onClick: (row: T) => void | Promise<void>;
  danger?: boolean;
  disabled?: (row: T) => boolean;
}

export interface BaseDataGridProps<TData extends object = any> {
  data?: TData[];
  fetchData?: (
    query: ServerQueryState
  ) => Promise<{ rows: TData[]; total?: number }>;
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
