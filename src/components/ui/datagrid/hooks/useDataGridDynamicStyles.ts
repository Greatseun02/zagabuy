// Hook for generating dynamic styles
import {useMemo} from "react";
import {DataGridTheme} from "@/components/ui/datagrid/types";

const useDataGridDynamicStyles = (theme: DataGridTheme) => {
    return useMemo(() => {
        const cssVariables: Record<string, string> = {};

        // Apply ag-grid CSS variables from theme.customCssVariables
        if (theme.table?.customCssVariables) {
            Object.assign(cssVariables, theme.table.customCssVariables);
        }

        // Convert theme properties to CSS variables (only for AG Grid variables that exist)
        if (theme.header?.backgroundColor) {
            cssVariables['--ag-header-background-color'] = theme.header.backgroundColor;
        }
        if (theme.header?.color) {
            cssVariables['--ag-header-foreground-color'] = theme.header.color;
        }
        // Note: AG Grid doesn't have --ag-even-row-background-color
        // Even rows use --ag-background-color, odd rows use --ag-odd-row-background-color
        if (theme.row?.rowBackgroundColor) {
            cssVariables['--ag-background-color'] = theme.row.rowBackgroundColor;
            cssVariables['--ag-odd-row-background-color'] = theme.row.rowBackgroundColor;
        }

        return cssVariables;
    }, [theme]);
};

export default useDataGridDynamicStyles;
