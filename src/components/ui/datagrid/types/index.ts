import {ColDef, GridOptions, SelectionChangedEvent} from "ag-grid-community";
import {CSSProperties} from "react";
import {StatusRendererProps} from "@/components/ui/datagrid/renderers/statusRenderer";
import {HeaderControlsProps} from "@/components/ui/datagrid/tablePanels/baseTableHeaderControls";
import {BaseInputProps} from "../../input/baseInput";
import {ModernSelectProps} from "../../select/modernSelect";
import {BaseDatePickerProps} from "../../datepicker/baseDatePicker";

export type ColumnType = Omit<ColDef, "field"> & {
    // The field of the row object to get the cell's data from. Deep references into a row object is supported via dot notation, i. e 'address. firstLine'.
    field: string;
    style?: React.CSSProperties;
    onClick?: (data: any) => void;
    path?: string;
    isCurrency?: boolean;
    formatAmount?: boolean;
    isDate?: boolean;
    statusIndicator?: "fail" | "success" | "normal";
    // For server-side sort
    sortable?: boolean;

    enableCopy?: boolean;

    // Filter specific properties
    filterable?: boolean;
    filterType?: "text" | "number" | "date" | "select" | "boolean";
    filterOptions?: { label: string; value: any }[];
    filterPlaceholder?: string;

    // Row click exclusion - when true, clicking this column won't trigger row click
    suppressRowClick?: boolean;
};

// Theme customization interface
export interface DataGridTheme {
    container?: {
        className?: string;
        style?: CSSProperties;
        borderRadius?: string;
        backgroundColor?: string;
        boxShadow?: string;
        border?: string;
    };
    table?: {
        className?: string;
        style?: CSSProperties;
        agThemeClass?: string; // For ag-grid themes like 'ag-theme-alpine', 'ag-theme-material', etc.
        customCssVariables?: Partial<Record<BaseDataGridCssVariable, string>>;
    };
    header?: {
        className?: string;
        style?: CSSProperties;
        backgroundColor?: string;
        fontWeight?: string | number;
        fontSize?: string;
        color?: string;
        height?: string;
        textTransform?: string;
        letterSpacing?: string;
        borderBottom?: string;
    };
    row?: {
        className?: string;
        style?: CSSProperties;
        alternateRowBackgroundColor?: string;
        hoverColor?: string;
        selectedColor?: string;
        borderColor?: string;
        rowBackgroundColor?: string;
        borderBottom?: string;
        hoverBackgroundColor?: string;
    };
    layout?: {
        headerHeight?: number;
        rowHeight?: number;
    };
    pagination?: {
        className?: string;
        style?: CSSProperties;
    };
    filterPanel?: {
        className?: string;
        style?: CSSProperties;
        backgroundColor?: string;
        borderRadius?: string;
        boxShadow?: string;
    };
}

export interface DataGridLayout {
    containerHeight?: string | number;
    containerMinHeight?: string | number;
    containerMaxHeight?: string | number;
    rowHeight?: number;
    headerHeight?: number;
    domLayout?: "normal" | "autoHeight" | "print";
    pagination?: {
        pageSize?: number;
        pageSizeSelector?: number[] | false;
        suppressPaginationPanel?: boolean;
    };
}

// Enhanced customization options
export interface DataGridCustomization {
    theme?: DataGridTheme;
    layout?: DataGridLayout;
    defaultColDef?: Partial<ColDef>;
    gridOptions?: Partial<GridOptions>;
    containerStyle?: CSSProperties;
    className?: string;

    // Component overrides
    components?: {
        header?: React.FC<HeaderControlsProps>;
        filterPanel?: React.FC<FilterPanelProps>;
        emptyState?: React.FC<any>;
        loadingOverlay?: React.FC<any>;
        pagination?: React.FC<any>;
        statusRenderer?: {
            component: React.FC<StatusRendererProps>;
            params?: StatusRendererProps;
        };
    };

    // Event handlers and callbacks
    callbacks?: {
        onRowClick?: (event: any) => void;
        onRowDoubleClick?: (event: any) => void;
        onCellClick?: (event: any) => void;
        onSelectionChanged?: (event: SelectionChangedEvent) => void;
        onColumnResized?: (event: any) => void;
        onSortChanged?: (event: any) => void;
        onFilterChanged?: (event: any) => void;
    };
}

export type ServerSideParams = {
    pageNumber: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
    sortDir?: "ASC" | "DESC";
    filters?: Record<string, any>;
    dateFilters?: Record<string, { from?: string; to?: string }>;
};

/**
 * Base field configuration - common properties for all field types
 */
type BaseFieldConfig = {
    field: string;
    label: string;
};

/**
 * Text field configuration with BaseInput-specific props
 */
type TextFieldConfig = BaseFieldConfig & {
    type: "text";
    /** Props to pass to the BaseInput component */
    componentProps?: Partial<
        Omit<BaseInputProps<any>, "name" | "label" | "inputProps">
    >;
    /** Props to pass to the underlying input element */
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

/**
 * Select field configuration with ModernSelect-specific props
 */
type SelectFieldConfig = BaseFieldConfig & {
    type: "select";
    /** Available options for the select dropdown */
    options?: string[];
    /** Props to pass to the ModernSelect component */
    componentProps?: Partial<
        Omit<
            ModernSelectProps,
            "label" | "selectOptions" | "onOptionSelect" | "value"
        >
    >;
};

/**
 * Date field configuration with BaseDatePicker-specific props
 */
type DateFieldConfig = BaseFieldConfig & {
    type: "date";
    /** Props to pass to the BaseDatePicker component */
    componentProps?: Partial<
        Omit<BaseDatePickerProps<any>, "name" | "label" | "selected" | "onSelect">
    >;
    /**
     * Shorthand for dateFormat configuration
     * If provided, will override componentProps.dateFormat
     */
    dateFormat?: BaseDatePickerProps<any>["dateFormat"];
};

/**
 * Number field configuration (for future implementation)
 */
type NumberFieldConfig = BaseFieldConfig & {
    type: "number";
    componentProps?: Partial<
        Omit<BaseInputProps<any>, "name" | "label" | "inputProps">
    >;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

/**
 * Union type of all available field configurations
 * This provides type safety based on the field type
 */
export type AvailableFieldConfig =
    | TextFieldConfig
    | SelectFieldConfig
    | DateFieldConfig
    | NumberFieldConfig;

// ===== FILTER STATE & ACTIONS =====

export type FilterState = {
    searchText: string;
    columnFilters: Record<string, any>;
    dateFilters: Record<string, { from?: string; to?: string }>;
    sort: {
        field: string;
        direction: "ASC" | "DESC";
    };
};

export type FilterActions = {
    setSearchText: (text: string) => void;
    setColumnFilter: (field: string, value: any) => void;
    setDateFilter: (field: string, range: { from?: string; to?: string }) => void;
    setSort: (field: string, direction: "ASC" | "DESC") => void;
    resetFilters: () => void;
    applyFilters: () => void;
};

// ===== ENHANCED FILTER PANEL PROPS =====

export type FilterPanelProps = FilterState &
    FilterActions & {
    /**
     * Type-safe field configurations with component-specific props
     * Each field type provides appropriate prop suggestions in IDE
     */
    availableFields: AvailableFieldConfig[];
    onClose?: () => void;
    showGlobalSearch?: boolean;
    showColumnFilters?: boolean;
    showSortingControls?: boolean;
    style?: React.CSSProperties;
    className?: string;
};

export type ServerSideOperations =
    | "refresh"
    | "search"
    | "filter"
    | "sort"
    | "pagination"
    | "paginate"
    | "pageSizeChange";

export type ServerSideOperationsConfig = Partial<
    Record<
        ServerSideOperations,
        {
            fetchRows?: (params: ServerSideParams) => Promise<DataGridRows>;
            onFetchRowsSuccess?: (response: DataGridRows) => void;
            onFetchRowsError?: (error: unknown) => void;
        }
    >
>;

export type DataGridRows<T = any> = {
    data: T[];
    // current server side page number
    pageNumber?: number;
    // current server side page size
    pageSize?: number;
    // means to know the total pages based on the total records gotten over the page size
    totalPages?: number;
    // total number of rows generated by the endpoint call
    totalRecords?: number;
};

export type DefaultPaginationConfig = {
    // indicates whether api pagination mechanism starts from page 0 or page 1. defaults to true
    isPageZeroIndexed?: boolean;
    // page number to use when calling api. defaults to 1.
    pageNumber?: number;
    // page size to use when calling api. defaults to 100.
    pageSize?: number;
    // total records to display
    totalRecords?: number;
    // total pages to display
    totalPages?: number;
    pageSizeOptions?: Array<number>;
};
// 1. CSS Variables Documentation and Helper
export const BASE_DATA_GRID_CSS_VARIABLES = {
    // Layout & Sizing
    "--ag-row-height": 'Height of each row (e.g., "45px")',
    "--ag-header-height": 'Height of header row (e.g., "44px")',
    "--ag-cell-horizontal-padding": 'Horizontal padding in cells (e.g., "12px")',
    "--ag-cell-vertical-padding": 'Vertical padding in cells (e.g., "8px")',
    "--ag-grid-size": 'Base size unit for consistent spacing (e.g., "8px")',

    // Colors - Background
    "--ag-background-color": "Main grid background color",
    "--ag-header-background-color": "Header background color",
    "--ag-odd-row-background-color": "Alternate row background color",
    "--ag-row-hover-color": "Row hover background color",
    "--ag-selected-row-background-color": "Selected row background color",

    // Colors - Foreground/Text
    "--ag-foreground-color": "Main text color",
    "--ag-header-foreground-color": "Header text color",
    "--ag-secondary-foreground-color": "Secondary text color (disabled, etc.)",

    // Borders
    "--ag-border-color": "Main border color for cells",
    "--ag-header-border-color": "Header border color",
    "--ag-row-border-color": "Row border color",
    "--ag-borders": "Enable/disable borders (1 or 0)",
    "--ag-borders-critical": "Critical borders only (1 or 0)",

    // Interactive Elements
    "--ag-checkbox-checked-color": "Checkbox checked color",
    "--ag-checkbox-unchecked-color": "Checkbox unchecked color",
    "--ag-input-focus-border-color": "Input focus border color",

    // Advanced
    "--ag-wrapper-border-radius": "Grid wrapper border radius",
    "--ag-card-shadow": "Card/panel shadow",
    "--ag-popup-shadow": "Popup/dropdown shadow",
} as const;

// Helper function to get available CSS variables with descriptions
export const getAvailableCssVariables = () => BASE_DATA_GRID_CSS_VARIABLES;

// Type for CSS variables with IntelliSense
export type BaseDataGridCssVariable = keyof typeof BASE_DATA_GRID_CSS_VARIABLES;
