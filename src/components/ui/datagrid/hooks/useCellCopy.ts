"use client";

import {useCallback, useEffect} from "react";
import {AgGridReact} from "ag-grid-react";
import type {ColDef} from "ag-grid-community";

/**
 * Generic hook for copying selected cells / rows from an AG Grid instance.
 * TData should be a record-like type (object with string keys).
 */
export const useCellCopy = <TData extends Record<string, unknown> = Record<string, unknown>>(
    gridRef: React.RefObject<AgGridReact<TData> | null>
) => {
    const copySelectedCells = useCallback(() => {
        const api = gridRef.current?.api;
        if (!api) return;

        const focusedCell = api.getFocusedCell();
        if (!focusedCell) return;

        const rowNode = api.getDisplayedRowAtIndex(focusedCell.rowIndex);
        if (!rowNode) return;

        // rowNode.data may be undefined at runtime — guard it
        if (!rowNode.data) return;

        const colId = focusedCell.column.getColId();
        if (typeof colId !== "string") return;

        // rowNode.data is guaranteed to be present and is indexable as Record<string, unknown>
        const cellValue = (rowNode.data as Record<string, unknown>)[colId];

        const text = String(cellValue ?? "");

        // Copy to clipboard (modern + fallback)
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).catch(() => {
                /* ignore clipboard errors */
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }

        console.log(`Copied: ${text}`);
    }, [gridRef]);

    const copySelectedRows = useCallback(() => {
        const api = gridRef.current?.api;
        if (!api) return;

        const selectedRows = api.getSelectedRows() as TData[];
        if (!selectedRows || selectedRows.length === 0) return;

        const columnDefs = (api.getColumnDefs() ?? []) as ColDef<TData>[];
        const headers = columnDefs.map((col) => col.headerName ?? String(col.field ?? ""));

        // Build tab-delimited rows safely by indexing row as Record<string, unknown>
        const csvContent = [
            headers.join("\t"),
            ...selectedRows.map((row) =>
                headers
                    .map((header) => {
                        const col = columnDefs.find((c) => (c.headerName ?? String(c.field ?? "")) === header);
                        const field = col?.field;
                        if (!field) return "";
                        // field could be string or number; treat row as indexable record
                        const cell = (row as Record<string, unknown>)[String(field)];
                        return String(cell ?? "");
                    })
                    .join("\t")
            ),
        ].join("\n");

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(csvContent).catch(() => {
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = csvContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }

        console.log(`Copied ${selectedRows.length} rows`);
    }, [gridRef]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") {
                event.preventDefault();

                const api = gridRef.current?.api;
                if (!api) return;

                const selectedRows = api.getSelectedRows();
                if (selectedRows && selectedRows.length > 0) {
                    copySelectedRows();
                } else {
                    copySelectedCells();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [copySelectedCells, copySelectedRows, gridRef]);

    return {copySelectedCells, copySelectedRows};
};

export default useCellCopy;
