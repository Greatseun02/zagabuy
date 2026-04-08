// Default theme configuration
import {useMemo} from "react";
import {DataGridTheme} from "@/components/ui/datagrid/types";

/**
 * Default theme for BaseDataGrid - aligned with erp-frontend table patterns
 *
 * Key styling decisions:
 * - Clean borders on cells and headers (like original erp-frontend)
 * - Light gray background for headers
 * - Subtle row hover effects
 * - Integration with Tailwind v4 theme variables
 */
const DEFAULT_THEME: DataGridTheme = {
    container: {
        borderRadius: '.5rem',
        backgroundColor: 'var(--background)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid var(--border)',
    },
    table: {
        agThemeClass: 'ag-theme-quartz',
        // AG Grid CSS variables that actually exist
        // Note: AG Grid doesn't have --ag-even-row-background-color
        // Even rows use --ag-background-color, odd rows use --ag-odd-row-background-color
        customCssVariables: {
            '--ag-wrapper-border-radius': '0px',
            '--ag-borders': '1px',
            '--ag-border-color': 'var(--border)',
            // Set both background colors to same value to disable alternating rows
            '--ag-background-color': 'var(--background)',
            '--ag-odd-row-background-color': 'var(--background)',
            '--ag-header-background-color': 'var(--muted)',
            '--ag-header-foreground-color': 'var(--muted-foreground)',
            '--ag-foreground-color': 'var(--foreground)',
            '--ag-row-hover-color': 'var(--primary) / 0.08',
            '--ag-selected-row-background-color': 'var(--primary) / 0.15',
        }
    },
    header: {
        backgroundColor: 'var(--muted)',
        fontWeight: '600',
        fontSize: '.75rem',
        color: 'var(--muted-foreground)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        height: '44px',
        borderBottom: '1px solid var(--border)',
    },
    row: {
        borderColor: 'var(--border)',
        rowBackgroundColor: 'var(--background)',
        borderBottom: '1px solid var(--border)',
        hoverBackgroundColor: 'transparent',
    },
    layout: {
        headerHeight: 44,
        rowHeight: 48,
    }
};

// Hook for merging themes
export const useDataGridTheme = (customTheme?: DataGridTheme): DataGridTheme => {
    return useMemo(() => {
        if (!customTheme) return DEFAULT_THEME;

        return {
            container: {...DEFAULT_THEME.container, ...customTheme.container},
            table: {
                ...DEFAULT_THEME.table,
                ...customTheme.table,
                customCssVariables: {
                    ...DEFAULT_THEME.table?.customCssVariables,
                    ...customTheme.table?.customCssVariables,
                },
            },
            header: {...DEFAULT_THEME.header, ...customTheme.header},
            row: {...DEFAULT_THEME.row, ...customTheme.row},
            layout: {...DEFAULT_THEME.layout, ...customTheme.layout},
            pagination: {...DEFAULT_THEME.pagination, ...customTheme.pagination},
            filterPanel: {...DEFAULT_THEME.filterPanel, ...customTheme.filterPanel},
        };
    }, [customTheme]);
};

export default useDataGridTheme;
