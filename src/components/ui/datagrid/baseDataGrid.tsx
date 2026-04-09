"use client";

import {
  AllCommunityModule,
  CellClickedEvent,
  ColDef,
  ColumnResizedEvent,
  FilterChangedEvent,
  GetRowIdParams,
  GridApi,
  GridOptions,
  ICellRendererParams,
  ModuleRegistry,
  RowClickedEvent,
  RowDoubleClickedEvent,
  SelectionChangedEvent,
  SelectionColumnDef,
  SortChangedEvent,
  ValueGetterParams,
} from "ag-grid-community";
import {
  CSSProperties,
  FC,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import moment from "moment/moment";
import StatusIndicator, {
  StatusIndicatorProps,
} from "../../custom/statusIndicator";
import StatusRenderer from "./renderers/statusRenderer";
import { AgGridReact } from "ag-grid-react";
import BaseTableHeaderControls, {
  HeaderControlsProps,
} from "./tablePanels/baseTableHeaderControls";
import CustomTableEmptyState from "./components/customTableEmptyState";

import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import {
  EditActionRenderer,
  EditActionRendererProps,
} from "@/components/ui/datagrid/renderers/editActionRenderer";
import {
  DeleteActionRenderer,
  DeleteActionRendererProps,
} from "@/components/ui/datagrid/renderers/deleteActionRenderer";
import {
  ViewActionRenderer,
  ViewActionRendererProps,
} from "@/components/ui/datagrid/renderers/viewActionRenderer";
import { useCellCopy } from "@/components/ui/datagrid/hooks/useCellCopy";
import {
  ColumnType,
  DataGridCustomization,
  DataGridRows,
  DefaultPaginationConfig,
  FilterPanelProps,
  FilterState,
  ServerSideOperations,
  ServerSideOperationsConfig,
  ServerSideParams,
} from "@/components/ui/datagrid/types";
import DefaultFilterPanel from "@/components/ui/datagrid/tablePanels/defaultFilterPanel";
import useDataGridTheme from "@/components/ui/datagrid/hooks/useDataGridTheme";
import useDataGridDynamicStyles from "@/components/ui/datagrid/hooks/useDataGridDynamicStyles";
import useFirstRender from "@/utilities/hooks/useFirstRender";
import { TimeUtil } from "@/utilities/timeUtil";
import { StringUtil } from "@/utilities/stringUtil";
import DateCellRenderer from "@/components/ui/datagrid/renderers/dateCellRenderer";
import BaseActionRenderer from "@/components/ui/datagrid/renderers/baseActionRenderer";
import Typography from "../typography";
import { Button as BaseButton } from "../button";
import RowOptionsActionRenderer from "@/components/ui/datagrid/renderers/rowOptionsActionRenderer";

ModuleRegistry.registerModules([AllCommunityModule]);

export type PaginationMode = "client" | "server" | "auto";
type ColumnFilterValue =
  | string
  | number
  | boolean
  | Array<string | number | boolean>;

export type TableActions<TData = Record<string, unknown>> = {
  refresh: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  getCurrentRowCount: () => number;
  getSelectedRows: <T = Record<string, unknown>>() => T[];
  getGridApi: () => GridApi | undefined;
};

export type ActionCallbackParams<T = Record<string, unknown>> = {
  data: T;
  actions: TableActions;
};

export type ColActionCallback<T = Record<string, unknown>> = (
  data: T,
  actions?: TableActions,
) => void | Promise<void>;

export type BaseDataGridProps<
  TData extends Record<any, unknown> = Record<any, unknown>,
> = {
  title?: string;
  uniqueRowId: keyof TData & string;

  /** The array of rows displayed in the grid */
  rows?: TData[];

  /** Column definitions */
  columns?: ColumnType[];

  /** Server-side row fetcher */
  fetchRows?: (params: ServerSideParams) => Promise<DataGridRows<TData>>;

  /** Callbacks for success/error */
  onFetchRowsSuccess?: (response: DataGridRows<TData>) => void;
  onFetchRowsError?: (error: unknown) => void;

  /** UI and feature toggles */
  showServerSideFilters?: boolean;
  serverSideOperationsConfig?: ServerSideOperationsConfig;
  isLoading?: boolean;
  autogenerateColumns?: boolean;
  shouldFetchRowsOnGridMount?: boolean;
  paginationMode?: PaginationMode;
  defaultPaginationConfig?: DefaultPaginationConfig;

  /** Custom renderers */
  customRowRenderer?: FC<{ row: TData }>;
  customHeaderRenderer?: FC;

  /** Column actions (view/edit/delete) */
  colActions?: {
    view?:
      | boolean
      | (Omit<ViewActionRendererProps, "onClick"> & {
          onClick?: ColActionCallback<TData>;
          autoRefresh?: boolean;
        });
    edit?:
      | boolean
      | (Omit<EditActionRendererProps, "onClick"> & {
          onClick?: ColActionCallback<TData>;
          autoRefresh?: boolean;
        });
    delete?:
      | boolean
      | (Omit<DeleteActionRendererProps, "onClick"> & {
          onClick?: ColActionCallback<TData>;
          autoRefresh?: boolean;
        });
  };

  /** Row options (right-click or overflow menu actions) */
  rowOptions?:
    | Array<{
        optionName: string;
        onClick: ColActionCallback<TData>;
        optionStyle?: CSSProperties;
        autoRefresh?: boolean;
        waitForCompletion?: boolean;
      }>
    | ((
        rowData: TData,
        actions?: TableActions<TData>,
      ) => Array<{
        optionName: string;
        onClick: ColActionCallback<TData>;
        optionStyle?: CSSProperties;
        autoRefresh?: boolean;
      }>);

  /** Filtering and customization */
  renderFilterPanel?: FC<FilterPanelProps>;
  availableFilterFields?: FilterPanelProps["availableFields"];
  defaultHeaderProps?: HeaderControlsProps;
  defaultFilterPanelProps?: FilterPanelProps;

  /** AG Grid options */
  gridOptions?: GridOptions<TData>;

  /** Misc */
  customization?: DataGridCustomization;
  showSerialNumberColumn?: boolean;
  suppressDefaultStatusRenderer?: boolean;
  expandCols?: boolean;

  /** Row click - callback for custom actions (opens modal, shows detail, etc.) */
  onRowClick?: (
    data: TData,
    event: RowClickedEvent<TData>,
  ) => void | Promise<void>;

  /** Row click route - BaseDataGrid automatically navigates to this route on row click */
  rowClickRoute?: (data: TData) => string;

  /** Target for row click navigation ('_self' for same tab, '_blank' for new tab) */
  rowClickTarget?: "_self" | "_blank";

  /** Maximum number of rows to export in server-side mode (default: 5000) */
  maxExportRows?: number;

  /** Handler for backend PDF export. When provided, delegates PDF exports to the backend. */
  pdfExportHandler?: () => Promise<void>;

  /** Called whenever the active filter set changes (apply or reset). */
  onFiltersChange?: (filters: Record<string, unknown>) => void;
};

export type BaseDataGridRef = {
  actions: TableActions;
};
const EnhancedPaginationPanel: React.FC<
  {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
    onPrevPage: () => void;
    onNextPage: () => void;
    onPageChange?: (pageNo: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
    showTotalRecords?: boolean;
    mode?: "client" | "server";
    hasKnownTotal?: boolean;
    currentRowCount?: number;
  } & React.HTMLAttributes<HTMLDivElement>
> = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPrevPage,
  onNextPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showTotalRecords = true,
  mode = "server",
  hasKnownTotal = true,
  currentRowCount = 0,
  ...divProps
}) => {
  const displayCurrentPage = currentPage + 1;

  // Calculate showing range
  const startItem = totalRecords > 0 ? currentPage * pageSize + 1 : 0;
  const endItem = Math.min((currentPage + 1) * pageSize, totalRecords);

  // Determine if next button should be disabled
  const isNextDisabled = hasKnownTotal
    ? currentPage >= totalPages - 1 || totalPages === 0
    : currentRowCount < pageSize; // If we got less than a full page, we're at the end

  return (
    <div
      {...divProps}
      className="flex justify-between items-center gap-4 p-5 py-3"
      style={{
        ...divProps.style,
      }}
    >
      {showTotalRecords && (
        <Typography size="sm">
          {hasKnownTotal
            ? `Showing ${startItem}-${endItem} of ${totalRecords}`
            : `Showing ${startItem}-${endItem}`}
        </Typography>
      )}

      <div className="flex items-center gap-4">
        <BaseButton
          onClick={onPrevPage}
          text="Previous"
          variant="secondary"
          size="small"
          disabled={currentPage === 0}
        />

        <Typography size="sm">
          {hasKnownTotal
            ? `Page ${displayCurrentPage} of ${totalPages}`
            : `Page ${displayCurrentPage}`}
        </Typography>

        <BaseButton
          onClick={onNextPage}
          text="Next"
          variant="secondary"
          size="small"
          disabled={isNextDisabled}
        />
      </div>

      {showPageSizeSelector && onPageSizeChange && (
        <div className="flex items-center gap-2">
          <Typography size="xs">Show:</Typography>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

const BaseDataGrid = memo(
  forwardRef<BaseDataGridRef, BaseDataGridProps<Record<string, unknown>>>(
    (props, ref) => {
      const gridRef = useRef<AgGridReact>(null);
      const isFetchingRef = useRef(false);
      const currentExportParamsRef = useRef<ServerSideParams | null>(null);

      const isFirstRender = useFirstRender();
      useCellCopy(gridRef);

      // Use the theme system
      const theme = useDataGridTheme(props.customization?.theme);
      const dynamicStyles = useDataGridDynamicStyles(theme);

      // Configuration defaults
      const shouldFetchRowsOnGridMount =
        props?.shouldFetchRowsOnGridMount ?? true;

      const title = useMemo(() => {
        return props?.title ?? "";
      }, [props?.title]);

      // =============================================================================
      // PAGINATION MODE DETERMINATION
      // =============================================================================
      const paginationMode = useMemo(() => {
        // 1. Use explicit mode if provided
        if (props.paginationMode && props.paginationMode !== "auto") {
          return props.paginationMode;
        }

        // 2. Auto-detect based on available data and capabilities
        if (props.fetchRows) {
          return "server"; // Prefer server-side when fetchRows is provided
        }
        if (props.rows && props.rows.length > 0) {
          return "client"; // Use client-side for static data
        }

        // 3. Default to server-side for empty states with fetchRows capability
        return "server";
      }, [props.paginationMode, props.fetchRows, props.rows]);

      // =============================================================================
      // STATE MANAGEMENT
      // =============================================================================
      const [rowData, setRowData] = useState(props?.rows ?? []);
      const [isLoading, setIsLoading] = useState(props?.isLoading ?? false);
      const [isExporting, setIsExporting] = useState(false);
      const [, setIsFiltered] = useState(false);
      const [showServerSideFilters, setShowServerSideFilters] = useState(
        props?.showServerSideFilters ?? false,
      );
      const [selectedRows, setSelectedRows] = useState<
        Record<string, unknown>[]
      >([]);

      // Filter state
      const [filterState, setFilterState] = useState<FilterState>({
        searchText: "",
        columnFilters: {},
        dateFilters: {},
        sort: {
          field: "",
          direction: "DESC",
        },
      });

      // Pagination state
      const [pagination, setPagination] = useState(() => {
        const defaultPageSize = props?.defaultPaginationConfig?.pageSize ?? 20;
        const defaultPageNumber =
          props?.defaultPaginationConfig?.pageNumber ?? 0;
        const isZeroIndexed =
          props?.defaultPaginationConfig?.isPageZeroIndexed ?? true;

        const internalPageNumber = isZeroIndexed
          ? defaultPageNumber
          : Math.max(0, defaultPageNumber - 1);

        let totalRecords = props?.defaultPaginationConfig?.totalRecords ?? 0;
        let totalPages = props?.defaultPaginationConfig?.totalPages ?? 0;
        const hasKnownTotal = true;

        if (paginationMode === "client" && props.rows) {
          totalRecords = props.rows.length;
          totalPages = Math.ceil(totalRecords / defaultPageSize);
        }

        return {
          pageNumber: internalPageNumber,
          pageSize: defaultPageSize,
          totalRecords,
          totalPages,
          hasKnownTotal,
          mode: paginationMode,
        };
      });
      // Update pagination when mode or rows change
      useEffect(() => {
        if (paginationMode === "client" && props.rows) {
          const totalRecords = props.rows.length;
          const totalPages = Math.ceil(totalRecords / pagination.pageSize);

          setPagination((prev) => ({
            ...prev,
            totalRecords,
            totalPages,
            // Reset to first page if data changes significantly
            pageNumber: prev.mode === paginationMode ? prev.pageNumber : 0,
            mode: paginationMode,
          }));
        }
      }, [paginationMode, props.rows, pagination.pageSize]);

      const rows = useMemo(() => {
        return props?.rows ?? rowData;
      }, [props?.rows, rowData]);
      const showSerialNumberColumn = props?.showSerialNumberColumn ?? true;

      const loading = useMemo(() => {
        return props?.isLoading || isLoading;
      }, [props?.isLoading, isLoading]);

      const isServerPageZeroIndexed = useMemo(() => {
        return props?.defaultPaginationConfig?.isPageZeroIndexed ?? true;
      }, [props?.defaultPaginationConfig?.isPageZeroIndexed]);

      const uniqueRowId = useMemo(() => {
        return props?.uniqueRowId?.trim() ? props.uniqueRowId : "";
      }, [props?.uniqueRowId]);

      useEffect(() => {
        setShowServerSideFilters(!!props?.showServerSideFilters);
      }, [props?.showServerSideFilters]);

      const dataColumnKeys: { label: string; value: string }[] = useMemo(() => {
        return [{ label: "Date Field", value: "" }];
      }, []);

      const baseColumns: ColumnType[] = useMemo(() => {
        if (!(rows?.length > 0)) return [];
        const autogenerateColumns = props?.autogenerateColumns ?? true;

        // Always start with consumer-defined columns if they exist
        const consumerColumns = props?.columns || [];

        // Get all row data keys
        const rowDataKeys = new Set(Object.keys(rows[0]));

        if (autogenerateColumns) {
          // Only add autogenerated columns for fields not defined by consumer
          const additionalColumns: ColumnType[] = Array.from(rowDataKeys)
            .filter(
              (key) => !consumerColumns?.some?.((col) => col.field === key),
            )
            .map((key) => ({ field: key }));
          return [...consumerColumns, ...additionalColumns];
        }

        // Return only consumer columns when autogeneration is disabled
        return [...consumerColumns];
      }, [props?.autogenerateColumns, props?.columns, rows]);

      // =============================================================================
      // DATA FETCHING & PAGINATION LOGIC
      // =============================================================================

      const handleFetchData = useCallback(
        async (
          serverSideOperation: ServerSideOperations,
          operationParams: Partial<ServerSideParams> = {},
          options?: { byPassLoading?: boolean },
        ) => {
          if (isFetchingRef.current) {
            console.log("Fetch already in progress, skipping...");
            return;
          }

          try {
            isFetchingRef.current = true;
            if (!options?.byPassLoading) setIsLoading(true);

            if (paginationMode === "server" && props.fetchRows) {
              const finalOperationConfig = {
                fetchRows:
                  props?.serverSideOperationsConfig?.[serverSideOperation]
                    ?.fetchRows || props?.fetchRows,
                onFetchRowsSuccess:
                  props?.serverSideOperationsConfig?.[serverSideOperation]
                    ?.onFetchRowsSuccess || props?.onFetchRowsSuccess,
                onFetchRowsError:
                  props?.serverSideOperationsConfig?.[serverSideOperation]
                    ?.onFetchRowsError || props?.onFetchRowsError,
              };

              if (!finalOperationConfig?.fetchRows) return;

              // Use operationParams for the request, not state values
              const internalPageNumber =
                operationParams.pageNumber ?? pagination.pageNumber;
              const requestPageSize =
                operationParams.pageSize ?? pagination.pageSize;

              // Convert internal zero-indexed page to server's expected format
              const serverPageNumber = isServerPageZeroIndexed
                ? internalPageNumber
                : internalPageNumber + 1;

              console.log("handleFetchData conversion:", {
                operation: serverSideOperation,
                internalPageNumber,
                isServerPageZeroIndexed,
                serverPageNumber,
                statePageNumber: pagination.pageNumber,
              });

              const serverParams: ServerSideParams = {
                search: filterState.searchText,
                filters: filterState.columnFilters,
                dateFilters: filterState.dateFilters,
                sortBy: filterState.sort?.field,
                sortDir: filterState.sort?.direction,
                ...operationParams,
                pageNumber: serverPageNumber,
                pageSize: requestPageSize,
              };

              console.log(
                `calling handleRefresh`,
                JSON.stringify(serverParams, null, 4),
              );
              const response =
                await finalOperationConfig.fetchRows(serverParams);
              const responseData = response?.data || [];

              // Store for export-all operations
              currentExportParamsRef.current = serverParams;

              // Handle missing totalRecords — backend may use totalItems (BasePaginationDTO)
              const rawResponse = response as Record<string, unknown>;
              let totalRecords =
                response?.totalRecords ??
                (rawResponse?.totalItems as number | undefined);
              let totalPages = response?.totalPages;
              const hasKnownTotal =
                response?.totalRecords !== undefined &&
                response?.totalRecords !== null;

              if (!hasKnownTotal) {
                console.warn(
                  "totalRecords not provided in fetchRows response. Using fallback calculation.",
                );

                if (responseData.length === requestPageSize) {
                  // Full page received - there might be more data
                  totalRecords = (internalPageNumber + 2) * requestPageSize;
                  totalPages = Math.ceil(totalRecords / requestPageSize);
                } else if (
                  responseData.length === 0 &&
                  internalPageNumber > 0
                ) {
                  // No data on a page beyond first - we've gone too far
                  // Don't update state, just return
                  console.warn("No data returned for page", internalPageNumber);
                  return;
                } else {
                  // Partial page or first page with data - this is likely the last page
                  totalRecords =
                    internalPageNumber * requestPageSize + responseData.length;
                  totalPages = internalPageNumber + 1;
                }
              } else {
                // Ensure totalRecords is a number, not undefined
                totalRecords = totalRecords ?? 0;
                totalPages = Math.ceil(totalRecords / requestPageSize);
              }

              // SINGLE state update with the actual values used in the request
              setPagination((prev) => ({
                ...prev,
                pageNumber: internalPageNumber, // Use internal zero-indexed value
                pageSize: requestPageSize,
                totalRecords,
                totalPages,
                hasKnownTotal,
              }));

              setRowData(responseData);
              finalOperationConfig?.onFetchRowsSuccess?.(response);
            } else {
              // CLIENT-SIDE pagination
              await new Promise((resolve) => setTimeout(resolve, 100));

              const {
                pageNumber = pagination.pageNumber,
                pageSize = pagination.pageSize,
              } = operationParams;

              const allData = props.rows || [];
              const startIndex = pageNumber * pageSize;
              const endIndex = startIndex + pageSize;
              const pageData = allData.slice(startIndex, endIndex);

              const totalRecords = allData.length;
              const totalPages = Math.ceil(totalRecords / pageSize);

              setPagination((prev) => ({
                ...prev,
                pageNumber,
                pageSize,
                totalRecords,
                totalPages,
                hasKnownTotal: true,
              }));

              setRowData(pageData);
            }

            // Clear selection on significant operations
            if (
              serverSideOperation === "filter" ||
              serverSideOperation === "refresh"
            ) {
              gridRef.current?.api.deselectAll();
            }
          } catch (error) {
            console.error(`Error in ${serverSideOperation}:`, error);
            if (paginationMode === "server") {
              const finalOperationConfig = {
                onFetchRowsError:
                  props?.serverSideOperationsConfig?.[serverSideOperation]
                    ?.onFetchRowsError || props?.onFetchRowsError,
              };
              finalOperationConfig.onFetchRowsError?.(error);
            }
          } finally {
            isFetchingRef.current = false;
            if (!options?.byPassLoading) {
              setTimeout(() => setIsLoading(false), 500);
            }
          }
        },
        [
          paginationMode,
          props?.fetchRows,
          props?.rows,
          props?.serverSideOperationsConfig,
          props?.onFetchRowsSuccess,
          props?.onFetchRowsError,
          pagination.pageNumber,
          pagination.pageSize,
          filterState,
          isServerPageZeroIndexed, // ADD THIS DEPENDENCY
        ],
      );

      // =============================================================================
      // PAGINATION OPERATIONS
      // =============================================================================

      // Refresh: Maintain current position
      const handleTableRefresh = useCallback(() => {
        return handleFetchData("refresh");
      }, [handleFetchData]);

      // Page change: Navigate to specific page
      const handlePageChange = useCallback(
        (newPage: number) => {
          console.log("Page change requested:", {
            newPage,
            currentPage: pagination.pageNumber,
            hasKnownTotal: pagination.hasKnownTotal,
            totalPages: pagination.totalPages,
            isServerPageZeroIndexed,
            willSendToServer: isServerPageZeroIndexed ? newPage : newPage + 1,
          });

          // Don't validate against totalPages when we don't have known totals
          const validatedPage = pagination.hasKnownTotal
            ? Math.max(0, Math.min(newPage, pagination.totalPages - 1))
            : Math.max(0, newPage);

          if (paginationMode === "server") {
            // For server-side, pass the page number directly to fetchData
            // Don't update pagination state here - let handleFetchData do it
            handleFetchData("paginate", { pageNumber: validatedPage });
          } else {
            // For client-side, handleFetchData will update pagination
            handleFetchData("paginate", {
              pageNumber: validatedPage,
              pageSize: pagination.pageSize,
            });
          }
        },
        [
          paginationMode,
          handleFetchData,
          pagination.totalPages,
          pagination.pageSize,
          pagination.hasKnownTotal,
          pagination.pageNumber,
          isServerPageZeroIndexed,
        ],
      );

      // Page size change: Reset to first page
      const handlePageSizeChange = useCallback(
        (newPageSize: number) => {
          if (paginationMode === "server") {
            setPagination((prev) => ({
              ...prev,
              pageNumber: 0,
              pageSize: newPageSize,
            }));
            handleFetchData("pageSizeChange", {
              pageNumber: 0,
              pageSize: newPageSize,
            });
          } else {
            handleFetchData("pageSizeChange", {
              pageNumber: 0,
              pageSize: newPageSize,
            });
          }
        },
        [paginationMode, handleFetchData],
      );

      const handlePrevPageClick = useCallback(() => {
        if (pagination.pageNumber > 0) {
          handlePageChange(pagination.pageNumber - 1);
        }
      }, [handlePageChange, pagination.pageNumber]);

      const handleNextPageClick = useCallback(() => {
        // If we have known totals, check if we're at the last page
        if (
          pagination.hasKnownTotal &&
          pagination.pageNumber >= pagination.totalPages - 1
        ) {
          return; // We're at the last page, don't proceed
        }

        // Otherwise, proceed with page change
        handlePageChange(pagination.pageNumber + 1);
      }, [
        handlePageChange,
        pagination.pageNumber,
        pagination.totalPages,
        pagination.hasKnownTotal,
      ]);

      // =============================================================================
      // TABLE ACTIONS & REF EXPOSURE
      // =============================================================================
      const tableActions = useMemo(
        (): TableActions => ({
          refresh: async () => {
            await handleTableRefresh();
          },
          setLoading: (loading: boolean) => {
            setIsLoading(loading);
          },
          getCurrentRowCount: () => {
            return (
              gridRef.current?.api?.getDisplayedRowCount() ?? rows?.length ?? 0
            );
          },
          getSelectedRows: () => {
            return gridRef.current?.api?.getSelectedRows() ?? [];
          },
          getGridApi: () => {
            return gridRef.current?.api;
          },
        }),
        [handleTableRefresh, rows?.length],
      );

      useImperativeHandle(
        ref,
        () => ({
          actions: tableActions,
        }),
        [tableActions],
      );

      // =============================================================================
      // COLUMN CONFIGURATION (Preserving your existing logic)
      // =============================================================================
      const colDefConfig = useMemo<ColDef<Record<string, unknown>>[]>(() => {
        if (!baseColumns) return [];

        const cols: ColDef<Record<string, unknown>>[] = baseColumns.map(
          (column) => {
            const firstRowValue =
              rows && rows.length > 0
                ? rows[0][column.field as keyof Record<string, unknown>]
                : "";

            // Date column
            if (
              column.isDate ??
              TimeUtil.isValidDate(String(firstRowValue || ""))
            ) {
              dataColumnKeys.push({
                label: StringUtil.convertToSentenceCase(column.field),
                value: column.field,
              });

              return {
                headerName: StringUtil.convertToSentenceCase(column.field),
                filter: "agDateColumnFilter",
                filterParams: {
                  filterOptions: ["inRange"],
                  inRangeInclusive: true,
                  comparator: (filterDate: Date, cellValue: string) => {
                    const cell = moment(cellValue);
                    const filter = moment(filterDate);
                    if (!cell.isValid()) return -1;
                    if (cell.isSame(filter, "day")) return 0;
                    if (cell.isBefore(filter, "day")) return -1;
                    return 1;
                  },
                  valueFormatter: (
                    params: ICellRendererParams<
                      Record<string, unknown>,
                      string
                    >,
                  ) => moment(params.value).format("YYYY-MM-DD HH:mm:ss"),
                  browserDatePicker: true,
                  closeOnApply: true,
                  buttons: ["apply", "reset", "cancel"],
                  defaultOption: "inRange",
                  maxNumConditions: 1,
                },
                cellRenderer: DateCellRenderer,
                cellRendererParams: {
                  onClick: column.onClick,
                  path: column.path,
                  isCurrency: column.isCurrency,
                  formatAmount: column.formatAmount,
                  isDate: column.isDate,
                },
                hide: column.hide ?? false,
                ...column,
              };
            }

            // Status Indicator
            if (column.field.toLowerCase() === "statusindicator") {
              return {
                headerName: StringUtil.convertToSentenceCase(column.field),
                filter: false,
                cellRenderer: (
                  params: ICellRendererParams<Record<string, unknown>>,
                ) => {
                  const status = (params.value as string) || "success";
                  const indicatorStatus: StatusIndicatorProps["status"] =
                    status === "success"
                      ? "success"
                      : status === "error"
                        ? "error"
                        : "pending";
                  return (
                    <div
                      className="flex items-center h-full"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <StatusIndicator status={indicatorStatus} />
                    </div>
                  );
                },
                hide: column.hide ?? false,
                ...column,
              };
            }

            // Generic status columns

            if (column.field.toLowerCase().includes("status")) {
              return {
                // Set base defaults
                headerName: StringUtil.convertToSentenceCase(column.field),
                filter: false,
                hide: false,

                // Spread user column config
                ...column,

                // Override ONLY if user didn't provide
                cellRenderer:
                  column.cellRenderer ||
                  props.customization?.components?.statusRenderer?.component ||
                  (!props.suppressDefaultStatusRenderer
                    ? StatusRenderer
                    : BaseActionRenderer),

                // Merge params with user params taking precedence
                cellRendererParams: {
                  ...(props.customization?.components?.statusRenderer?.params ||
                    {}),
                  ...(column.cellRendererParams || {}),
                },
              };
            }

            // Default renderer
            return {
              headerName: StringUtil.convertToSentenceCase(column.field),
              // headerClass: "ag-center-header",
              // cellClass: "ag-center-cell",
              filterParams: {
                closeOnApply: true,
                buttons: ["apply", "reset", "cancel"],
                maxNumConditions: 1,
              },
              cellRenderer: BaseActionRenderer,
              cellRendererParams: {
                onClick: column.onClick,
                path: column.path,
                isCurrency: column.isCurrency,
                formatAmount: column.formatAmount,
                isDate: column.isDate,
                onCellClicked: column.onCellClicked,
              },
              hide: column.hide ?? false,
              ...column,
            };
          },
        );

        // Include action columns, rowOptions, serial column, etc.
        if (props?.colActions?.edit) {
          const otherProps =
            typeof props?.colActions?.edit !== "boolean"
              ? props?.colActions?.edit
              : {};
          const shouldAutoRefresh = otherProps?.autoRefresh ?? true;

          cols.push({
            headerName: "",
            field: "action-edit",
            pinned: "right",
            filter: false,
            cellRenderer: EditActionRenderer,
            cellRendererParams: {
              title: title,
              ...otherProps,
              onClick: async (data: Record<string, unknown>) => {
                if (otherProps?.onClick) {
                  await otherProps.onClick(data, tableActions);
                  if (shouldAutoRefresh) {
                    await handleTableRefresh();
                  }
                }
              },
            },
            resizable: false,
            width: 50,
          });
        }

        if (props?.colActions?.view) {
          const otherProps =
            typeof props?.colActions?.view !== "boolean"
              ? props?.colActions?.view
              : {};
          const shouldAutoRefresh = otherProps?.autoRefresh ?? false;

          cols.push({
            headerName: "",
            field: "action-view",
            pinned: "right",
            filter: false,
            cellRenderer: ViewActionRenderer,
            cellRendererParams: {
              title: title,
              ...otherProps,
              onClick: async (data: Record<string, unknown>) => {
                if (otherProps?.onClick) {
                  await otherProps.onClick(data, tableActions);
                  if (shouldAutoRefresh) {
                    await handleTableRefresh();
                  }
                }
              },
            },
            resizable: false,
            width: 50,
          });
        }

        if (props?.colActions?.delete) {
          const otherProps =
            typeof props?.colActions?.delete !== "boolean"
              ? props?.colActions?.delete
              : {};
          const shouldAutoRefresh = otherProps?.autoRefresh ?? true;

          cols.push({
            headerName: "",
            field: "action-delete",
            pinned: "right",
            filter: false,
            cellRenderer: DeleteActionRenderer,
            cellRendererParams: {
              title: title,
              ...otherProps,
              onClick: async (data: Record<string, unknown>) => {
                if (otherProps?.onClick) {
                  await otherProps.onClick(data, tableActions);
                  if (shouldAutoRefresh) {
                    await handleTableRefresh();
                  }
                }
              },
            },
            resizable: false,
            width: 50,
          });
        }

        if (props?.rowOptions) {
          cols.push({
            headerName: "",
            field: "action",
            pinned: "right",
            filter: false,
            suppressRowClick: true,
            minWidth: 10,
            cellRenderer: RowOptionsActionRenderer,
            cellRendererParams: (
              params: ValueGetterParams<Record<string, unknown>>,
            ) => {
              const baseOptions =
                typeof props.rowOptions === "function"
                  ? props.rowOptions(
                      params.data as Record<string, unknown>,
                      tableActions,
                    )
                  : props.rowOptions;

              const enhancedOptions = baseOptions?.map((option) => {
                const shouldAutoRefresh = option?.autoRefresh ?? true;

                return {
                  ...option,
                  onClick: async (data: Record<string, unknown>) => {
                    await option.onClick(data, tableActions);
                    if (shouldAutoRefresh) {
                      await handleTableRefresh();
                    }
                  },
                };
              });

              return {
                title: title,
                rowOptions: enhancedOptions,
                referenceElement: gridRef?.current,
              };
            },
            resizable: false,
            width: 50,
          } as ColDef<Record<string, unknown>>);
        }

        if (rows?.length > 0 && showSerialNumberColumn) {
          const pageOffset = pagination.pageNumber * pagination.pageSize;
          cols.unshift({
            headerName: "",
            field: "serial",
            valueGetter: (params: ValueGetterParams<Record<string, unknown>>) =>
              pageOffset + Number(params?.node?.rowIndex) + 1,
            flex: 0,
            pinned: "left",
            minWidth: 50,
            maxWidth: 50,
            suppressSizeToFit: false,
            autoHeight: false,
            cellStyle: {
              borderRight: "0.5px solid #B6BBC3",
            },
          });
        }
        return [
          ...cols,
          ...((props.gridOptions?.columnDefs as ColDef<
            Record<string, unknown>
          >[]) ?? []),
        ];
      }, [
        baseColumns,
        props.colActions,
        props.rowOptions,
        props.gridOptions?.columnDefs,
        showSerialNumberColumn,
        props.customization?.components?.statusRenderer,
        props.suppressDefaultStatusRenderer,
        rows,
        dataColumnKeys,
        title,
        tableActions,
        handleTableRefresh,
      ]);

      // Generate available fields
      const availableFields = useMemo(() => {
        if (props.availableFilterFields) return props.availableFilterFields;

        // Auto-generate from columns if not provided
        return baseColumns.map((col) => ({
          field: col.field,
          label: col.headerName || StringUtil.convertToSentenceCase(col.field),
          type: col.isDate
            ? "date"
            : ("text" as FilterPanelProps["availableFields"][0]["type"]),
        }));
      }, [baseColumns, props.availableFilterFields]);

      // =============================================================================
      // FILTER OPERATIONS
      // =============================================================================
      const filterActions = useMemo(
        () => ({
          setSearchText: (text: string) =>
            setFilterState(
              (prev): FilterState => ({
                ...prev,
                searchText: text,
              }),
            ),

          setColumnFilter: (field: string, value: ColumnFilterValue | null) =>
            setFilterState(
              (prev): FilterState => ({
                ...prev,
                columnFilters: {
                  ...prev.columnFilters,
                  [field]: Array.isArray(value) ? value.join(",") : value,
                },
              }),
            ),

          setDateFilter: (
            field: string,
            range: { from?: string; to?: string },
          ) =>
            setFilterState(
              (prev): FilterState => ({
                ...prev,
                dateFilters: {
                  ...prev.dateFilters,
                  [field]: range,
                },
              }),
            ),

          setSort: (field: string, direction: "ASC" | "DESC") =>
            setFilterState(
              (prev): FilterState => ({
                ...prev,
                sort: { field, direction },
              }),
            ),

          resetFilters: () => {
            const initialState: FilterState = {
              searchText: "",
              columnFilters: {},
              dateFilters: {},
              sort: {
                field: "",
                direction: "DESC",
              },
            };

            setFilterState(initialState);

            // Reset pagination
            setPagination((prev) => ({ ...prev, pageNumber: 0 }));

            const params: Partial<ServerSideParams> = {
              pageNumber: 0,
              search: initialState.searchText,
              filters: initialState.columnFilters,
              dateFilters: initialState.dateFilters,
              sortBy: initialState.sort.field,
              sortDir: initialState.sort.direction,
            };

            props.onFiltersChange?.({});
            handleFetchData("filter", params).then(() => setIsFiltered(false));
          },

          applyFilters: () => {
            setPagination((prev) => ({ ...prev, pageNumber: 0 }));

            // Flatten dateFilters into filters for API consumption
            const flatDateFilters: Record<string, string> = Object.fromEntries(
              Object.entries(filterState.dateFilters || {})
                .filter(([, val]) => val?.from)
                .map(([key, val]) => [key, val.from as string]),
            );
            const mergedFilters = {
              ...filterState.columnFilters,
              ...flatDateFilters,
            };

            const params: Partial<ServerSideParams> = {
              pageNumber: 0,
              search: filterState.searchText,
              filters: filterState.columnFilters,
              dateFilters: filterState.dateFilters,
              sortBy: filterState.sort.field,
              sortDir: filterState.sort.direction,
            };

            props.onFiltersChange?.(mergedFilters);
            handleFetchData("filter", params).then(() => setIsFiltered(true));
          },
        }),
        [handleFetchData, filterState, props.onFiltersChange],
      );

      // =============================================================================
      // INITIAL DATA LOAD
      // =============================================================================
      useEffect(() => {
        if (shouldFetchRowsOnGridMount && isFirstRender) {
          // Notify parent of initial (empty) filter state
          props.onFiltersChange?.({});

          if (paginationMode === "server" && props.fetchRows) {
            handleFetchData("refresh", {
              pageNumber: pagination.pageNumber,
              pageSize: pagination.pageSize,
            });
          } else if (paginationMode === "client" && props.rows) {
            handleFetchData("refresh", {
              pageNumber: pagination.pageNumber,
              pageSize: pagination.pageSize,
            });
          }
        }
      }, [shouldFetchRowsOnGridMount, isFirstRender]);

      // =============================================================================
      // AG GRID CONFIGURATION
      // =============================================================================
      const expandCols = props.expandCols ?? true;
      const defaultColDef: ColDef = useMemo(() => {
        const baseColDef = {
          flex: expandCols ? 0 : 1,
          maxWidth: expandCols ? 400 : undefined,
          resizable: true,
          sortable: true,
          headerClass: "font-medium text-xs border-b-0",
          enableCellChangeFlash: false,
          cellStyle: {
            display: "flex",
            alignItems: "center",
            backgroundColor: "transparent",
          },
        };

        // Merge with user customization
        const customColDef = props.customization?.defaultColDef || {};
        const gridOptionsColDef = props?.gridOptions?.defaultColDef || {};

        return {
          ...baseColDef,
          ...customColDef,
          ...gridOptionsColDef,
        };
      }, [
        theme.row?.style,
        props.customization?.defaultColDef,
        props?.gridOptions?.defaultColDef,
      ]);

      const addSerialNumberColumn = useCallback(
        (data: Record<string, unknown>[]): Record<string, unknown>[] => {
          return data.map((row, index) => ({
            "S/N": index + 1,
            ...row,
          }));
        },
        [],
      );

      /** Helper to apply styled headers to Excel worksheet */
      const applyExcelStyling = useCallback(
        (worksheet: XLSX.WorkSheet): void => {
          if (!worksheet["!ref"]) return;

          const range = XLSX.utils.decode_range(worksheet["!ref"]);

          // Set column widths based on header text length (minimum 20 chars)
          worksheet["!cols"] = [];
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            const cell = worksheet[cellAddress];
            const headerText = cell?.v || String(col);
            const textLength = String(headerText).length;
            worksheet["!cols"].push({
              wch: Math.min(Math.max(textLength + 5, 20), 50),
            });
          }

          // Style the header row with primary theme color
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            const cell = worksheet[cellAddress];
            if (!cell) continue;

            cell.s = {
              font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
              fill: { patternType: "solid", fgColor: { rgb: "1E56A0" } },
              alignment: {
                horizontal: "left",
                vertical: "center",
                wrapText: false,
              },
            };
          }

          // Set header row height
          worksheet["!rows"] = [{ hpt: 24 }];

          // Add auto-filter and freeze header row
          if (worksheet["!ref"]) {
            worksheet["!autofilter"] = { ref: XLSX.utils.encode_range(range) };
          }
          worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };
        },
        [],
      );

      const exportToExcel = useCallback(
        (data: Record<string, unknown>[], filename: string) => {
          const dataWithSn = addSerialNumberColumn(data);
          const worksheet = XLSX.utils.json_to_sheet(dataWithSn);
          applyExcelStyling(worksheet);

          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
          const buffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            `${filename}.xlsx`,
          );
        },
        [addSerialNumberColumn, applyExcelStyling],
      );

      const exportToCsv = useCallback(
        (data: Record<string, unknown>[], filename: string) => {
          const dataWithSn = addSerialNumberColumn(data);
          const worksheet = XLSX.utils.json_to_sheet(dataWithSn);
          const csv = XLSX.utils.sheet_to_csv(worksheet);
          saveAs(
            new Blob([csv], { type: "text/csv;charset=utf-8;" }),
            `${filename}.csv`,
          );
        },
        [addSerialNumberColumn],
      );

      const handleExportData = useCallback(
        async (format: "csv" | "excel") => {
          setIsExporting(true);
          try {
            let dataToExport: Record<string, unknown>[];

            if (
              paginationMode === "server" &&
              props.fetchRows &&
              pagination.totalRecords > 0
            ) {
              const MAX_EXPORT = props.maxExportRows ?? 5000;
              const totalToExport = pagination.totalRecords;

              if (totalToExport > MAX_EXPORT) {
                const confirmed = window.confirm(
                  `This export contains ${totalToExport.toLocaleString()} records and may take a moment. Continue?`,
                );
                if (!confirmed) return;
              }

              const exportParams: ServerSideParams = {
                ...(currentExportParamsRef.current ?? {
                  pageNumber: isServerPageZeroIndexed ? 0 : 1,
                  pageSize: totalToExport,
                }),
                pageNumber: isServerPageZeroIndexed ? 0 : 1,
                pageSize: totalToExport,
              };

              const response = await props.fetchRows(exportParams);
              dataToExport = (response?.data || []) as Record<
                string,
                unknown
              >[];
            } else {
              dataToExport = (
                paginationMode === "server" ? rowData : props.rows || []
              ) as Record<string, unknown>[];
            }

            const datestamp = new Date().toISOString().slice(0, 10);
            const baseName = title
              ? title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "")
              : "export";
            const filename = `${baseName}_${datestamp}`;

            if (format === "excel") exportToExcel(dataToExport, filename);
            else if (format === "csv") exportToCsv(dataToExport, filename);
          } finally {
            setIsExporting(false);
          }
        },
        [
          paginationMode,
          pagination.totalRecords,
          props.fetchRows,
          props.maxExportRows,
          rowData,
          props.rows,
          title,
          isServerPageZeroIndexed,
          exportToExcel,
          exportToCsv,
        ],
      );

      const enhancedGridOptions: GridOptions<Record<string, unknown>> =
        useMemo(() => {
          const baseGridOptions: GridOptions<Record<string, unknown>> = {
            headerHeight: props.customization?.layout?.headerHeight ?? 44,
            rowHeight: props.customization?.layout?.rowHeight ?? 45,
            pagination: false,
            suppressPaginationPanel: true,
            domLayout: props.customization?.layout?.domLayout ?? "normal",
            rowSelection: props?.defaultHeaderProps?.onSelectRows
              ? "multiple"
              : undefined,
            suppressRowClickSelection: true,

            // Row click behavior
            // Combines new props (onRowClick, rowClickRoute) with existing customization callbacks
            onRowClicked: ((
              event: RowClickedEvent<Record<string, unknown>>,
            ) => {
              const rowData = event.data;

              // 1. Call new onRowClick prop if provided (highest priority)
              if (props.onRowClick) {
                (props.onRowClick as any)(rowData, event);
                return;
              }

              // 2. Handle rowClickRoute navigation if provided
              if (props.rowClickRoute && rowData) {
                const route = props.rowClickRoute(rowData);
                const target = props.rowClickTarget || "_self";
                if (target === "_blank") {
                  window.open(route, "_blank");
                } else {
                  window.location.href = route;
                }
                return;
              }

              // 3. Fall back to existing customization callback
              if (props.customization?.callbacks?.onRowClick) {
                props.customization.callbacks.onRowClick(event);
              }
            }) as (event: RowClickedEvent<Record<string, unknown>>) => void,

            onRowDoubleClicked: props.customization?.callbacks
              ?.onRowDoubleClick as
              | ((
                  event: RowDoubleClickedEvent<Record<string, unknown>>,
                ) => void)
              | undefined,
            onCellClicked: props.customization?.callbacks?.onCellClick as
              | ((event: CellClickedEvent<Record<string, unknown>>) => void)
              | undefined,
            onColumnResized: props.customization?.callbacks?.onColumnResized as
              | ((event: ColumnResizedEvent<Record<string, unknown>>) => void)
              | undefined,
            onSortChanged: props.customization?.callbacks?.onSortChanged as
              | ((event: SortChangedEvent<Record<string, unknown>>) => void)
              | undefined,
            onFilterChanged: props.customization?.callbacks?.onFilterChanged as
              | ((event: FilterChangedEvent<Record<string, unknown>>) => void)
              | undefined,
          };

          return {
            ...baseGridOptions,
            ...props?.gridOptions,
            ...props.customization?.gridOptions,
          };
        }, [
          props.customization?.layout,
          props.customization?.callbacks,
          props.customization?.gridOptions,
          props.onRowClick,
          props.rowClickRoute,
          props.rowClickTarget,
          props?.gridOptions,
        ]);

      // Enhanced container styling
      const containerStyle = useMemo(() => {
        const layout = props.customization?.layout;
        const baseStyle = {
          height: `${
            Number(enhancedGridOptions?.rowHeight ?? 45) *
              Math.min(rows?.length || 0, pagination.pageSize) +
            Number(enhancedGridOptions?.headerHeight ?? 45)
          }px`,
          maxHeight: layout?.containerMaxHeight || "500px",
          minHeight: layout?.containerMinHeight || "300px",
          display: "block",
        };

        // Override with custom container height if provided
        if (layout?.containerHeight) {
          baseStyle.height =
            typeof layout.containerHeight === "number"
              ? `${layout.containerHeight}px`
              : layout.containerHeight;
        }

        // Merge with custom container style
        return {
          ...baseStyle,
          ...props.customization?.containerStyle,
        };
      }, [
        pagination.pageSize,
        rows?.length,
        props.customization?.layout,
        props.customization?.containerStyle,
        enhancedGridOptions?.rowHeight,
        enhancedGridOptions?.headerHeight,
      ]);

      // Table className with theme support
      const tableClassName = useMemo(() => {
        const baseClasses = [
          theme.table?.agThemeClass || "ag-theme-quartz",
          "w-full rounded-none",
          theme.table?.className,
          props.customization?.className,
        ].filter(Boolean);

        return baseClasses.join(" ");
      }, [theme.table, props.customization?.className]);

      const selectionColumnDef: SelectionColumnDef = useMemo(() => {
        return {
          sortable: true,
          resizable: true,
          width: 100,
          suppressHeaderMenuButton: false,
          headerTooltip: "Checkboxes indicate selection",
          headerClass:
            "bg-muted font-medium text-xs text-muted-foreground border-b-0",
        };
      }, []);

      const getRowId: GridOptions["getRowId"] = useCallback(
        (params: GetRowIdParams) => {
          const id = params.data[uniqueRowId];

          // Make sure ID exists and is valid
          if (id === undefined || id === null) {
            console.warn(
              "getRowId: ID is null/undefined for data:",
              params.data,
            );
            return String(Math.random()); // Fallback to prevent issues
          }

          return String(id);
        },
        [uniqueRowId],
      );

      const handleSelectionChanged = useCallback(
        (event: SelectionChangedEvent) => {
          const selected = event.api.getSelectedRows();
          setSelectedRows(selected);
        },
        [],
      );

      const handleSelectRowClick = useCallback(() => {
        if (props?.defaultHeaderProps?.onSelectRows) {
          props.defaultHeaderProps.onSelectRows(selectedRows);
        }
      }, [selectedRows, props?.defaultHeaderProps]);

      // Component overrides
      const HeaderComponent =
        props.customization?.components?.header ||
        props?.customHeaderRenderer ||
        BaseTableHeaderControls;

      const FilterPanelComponent =
        props.customization?.components?.filterPanel ||
        props?.renderFilterPanel ||
        DefaultFilterPanel;

      const EmptyStateComponent =
        props.customization?.components?.emptyState || CustomTableEmptyState;

      // Render filter panel with customization
      const renderFilterPanel = () => {
        if (!showServerSideFilters) return null;
        const panelStyle = {
          ...theme.filterPanel?.style,
        };
        const panelClassName = [
          theme.filterPanel?.className,
          "flex flex-col gap-4 flex-wrap p-6 rounded-lg bg-card border border-border",
        ]
          .filter(Boolean)
          .join(" ");
        const filterPanelProps: FilterPanelProps = {
          ...filterState,
          ...filterActions,
          availableFields,
          onClose: () => setShowServerSideFilters(false),
          ...props?.defaultFilterPanelProps,
          style: panelStyle,
          className: panelClassName,
        };

        return <FilterPanelComponent {...filterPanelProps} />;
      };

      // Container styling with theme support
      const finalContainerStyle = {
        ...theme.container?.style,
      };

      const finalContainerClassName = [
        // Use theme variables for proper light/dark mode support
        "relative w-full flex flex-col font-inherit rounded-lg shadow-sm",
        "bg-background border border-border",
        theme.container?.className,
        props.customization?.className,
      ]
        .filter(Boolean)
        .join(" ");

      const rowClassName = [
        "font-normal text-sm border-0 text-muted-foreground",
        theme.row?.className,
      ]
        .filter(Boolean)
        .join(" ");

      // Apply dynamic CSS variables
      const tableStyle = {
        ...theme.table?.style,
        ...dynamicStyles,
      };

      // Calculate if there are active filters
      const hasActiveFilters = useMemo(() => {
        return Boolean(
          Object.keys(filterState.columnFilters).some(
            (key) =>
              filterState.columnFilters[key] &&
              filterState.columnFilters[key] !== "",
          ) ||
          filterState.searchText ||
          Object.keys(filterState.dateFilters).some(
            (key) =>
              filterState.dateFilters[key]?.from ||
              filterState.dateFilters[key]?.to,
          ),
        );
      }, [filterState]);

      // =============================================================================
      // RENDER
      // =============================================================================
      return (
        <div className={finalContainerClassName} style={finalContainerStyle}>
          {paginationMode === "server" && renderFilterPanel()}

          <HeaderComponent
            title={title}
            onRefresh={handleTableRefresh}
            onExport={handleExportData}
            onFilterClick={() =>
              paginationMode === "server" &&
              setShowServerSideFilters((prev) => !prev)
            }
            {...props?.defaultHeaderProps}
            isExporting={isExporting}
            hasActiveFilters={hasActiveFilters}
            onCreateClick={
              props?.defaultHeaderProps?.onCreateClick
                ? async () => {
                    await props?.defaultHeaderProps?.onCreateClick?.();
                    await handleTableRefresh();
                  }
                : undefined
            }
            onSelectRows={
              selectedRows.length > 0 ? handleSelectRowClick : undefined
            }
            selectedRows={selectedRows}
          />

          {/* AG Grid - only show when there's data or loading */}
          {(rows && rows.length > 0) || loading ? (
            <div className={tableClassName} style={tableStyle}>
              <AgGridReact
                ref={gridRef}
                rowData={rows}
                loading={loading}
                getRowId={uniqueRowId ? getRowId : undefined}
                selectionColumnDef={selectionColumnDef}
                onSelectionChanged={handleSelectionChanged}
                noRowsOverlayComponent={EmptyStateComponent}
                noRowsOverlayComponentParams={{ onRefresh: handleTableRefresh }}
                {...enhancedGridOptions}
                columnDefs={colDefConfig}
                containerStyle={containerStyle}
                defaultColDef={defaultColDef}
                className=""
                rowClass={rowClassName}
              />
            </div>
          ) : (
            /* Empty state - show standalone when no data */
            <div className={tableClassName} style={tableStyle}>
              <EmptyStateComponent onRefresh={handleTableRefresh} />
            </div>
          )}

          {!loading && tableActions.getCurrentRowCount() > 0 && (
            <EnhancedPaginationPanel
              currentPage={pagination.pageNumber}
              totalPages={pagination.totalPages}
              totalRecords={pagination.totalRecords}
              pageSize={pagination.pageSize}
              onPrevPage={handlePrevPageClick}
              onNextPage={handleNextPageClick}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[10, 20, 50, 100]}
              showPageSizeSelector={true}
              showTotalRecords={true}
              mode={paginationMode}
              currentRowCount={rows?.length || 0}
              hasKnownTotal={pagination.hasKnownTotal}
            />
          )}
        </div>
      );
    },
  ),
);

export default BaseDataGrid;
export { BaseDataGrid };
