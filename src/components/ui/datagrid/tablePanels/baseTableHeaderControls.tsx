"use client";

import React, {useEffect, useRef, useState} from "react";
import BaseButton from "@/components/ui/button/baseButton";
import RefreshIcon from "@/components/icon/refreshIcon";
import DownloadIcon from "@/components/icon/downloadIcon";
import Typography from "@/components/ui/typography/typography";
import FilterIcon from "@/components/icon/filterIcon";
import PlusIcon from "@/components/icon/plusIcon";
import { GridOptions } from "ag-grid-community";
import { UploadIcon, ChevronDown } from "lucide-react";

/* =====================
   TYPES
===================== */

export type ExportFormat = "csv" | "excel";

/**
 * Generic header control props for tables.
 * You can pass your row data type for `selectedRows` via the generic.
 */
export interface HeaderControlsProps<TData = Record<string, unknown>> {
  /** Main title for the table header */
  title?: string;

  /** Called when the refresh button is clicked */
  onRefresh?: () => void;

  /** Called when the filter button is clicked */
  onFilterClick?: () => void;

  /** Whether there are currently active filters */
  hasActiveFilters?: boolean;

  /** Called when the create button is clicked */
  onCreateClick?: () => Promise<void>;

  /** Text for the "Create" button */
  createBtnText?: string;

  /** Called when the bulk upload button is clicked */
  onBulkUploadClick?: () => Promise<void>;

  /** Text for the "Bulk Upload" button */
  bulkUploadBtnText?: string;

  /** Called when an export action is triggered */
  onExport?: (format: ExportFormat) => void;

  /** Whether an export is currently in progress */
  isExporting?: boolean;

  /** Optional dropdown options for filtering by date */
  dateFilterSelectOptions?: Array<{ label: string; value: string }>;

  /** Options for selecting which column to filter by date */
  mainDateColumnFilterKeyOptions?: Array<{ label: string; value: string }>;

  /** Called when the selected date filter changes */
  onDateFilterChange?: (val: string) => void;

  /** Called when the date column key changes */
  onDateColumnChange?: (val: string) => void;

  /** Current search box value */
  searchValue?: string;

  /** Called when search value changes */
  onSearchChange?: (val: string) => void;

  /** Total number of results (for display) */
  resultCount?: number;

  /** AG Grid configuration */
  gridOptions?: GridOptions<TData>;

  /** Called when rows are selected */
  onSelectRows?: (selectedRows: TData[]) => void;

  /** Currently selected rows */
  selectedRows?: TData[];
}

/* =====================
   COMPONENT
===================== */

export default function BaseTableHeaderControls<
  TData = Record<string, unknown>,
>({
  title,
  onRefresh,
  onExport,
  isExporting,
  hasActiveFilters,
  onCreateClick,
  createBtnText,
  onFilterClick,
  onSelectRows,
  selectedRows,
  onBulkUploadClick,
  bulkUploadBtnText,
}: HeaderControlsProps<TData>) {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close export dropdown on outside click
  useEffect(() => {
    if (!exportOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [exportOpen]);

  return (
    <div className="flex flex-col gap-2 px-4 py-3 border-b border-border">
      <div className="flex items-center justify-between gap-4">
        <Typography size="lg" weight="medium" color="primary">
          {title || ""}
        </Typography>

        <div className="flex items-center gap-2 flex-wrap">
          {onRefresh && (
            <BaseButton
              type="icon"
              textIcon={RefreshIcon}
              variant="secondary"
              size="small"
              onClick={onRefresh}
              title="Refresh"
            />
          )}

          {onFilterClick && (
            <div className="relative">
              <BaseButton
                type="icon"
                textIcon={FilterIcon}
                variant={hasActiveFilters ? "primary" : "secondary"}
                size="small"
                onClick={onFilterClick}
                title="Filter"
              />
              {hasActiveFilters && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background pointer-events-none" />
              )}
            </div>
          )}

          {onExport && (
            <div className="relative" ref={exportRef}>
              <BaseButton
                text="Download"
                textIcon={DownloadIcon}
                variant="secondary"
                size="small"
                disabled={isExporting}
                endIcon={<ChevronDown className="size-3.5" />}
                onClick={() => setExportOpen(prev => !prev)}
              />
              {exportOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 min-w-[160px] bg-card border border-border rounded-md shadow-lg py-1">
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => {
                      onExport("excel");
                      setExportOpen(false);
                    }}
                  >
                    Export Excel
                  </button>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => {
                      onExport("csv");
                      setExportOpen(false);
                    }}
                  >
                    Export CSV
                  </button>
                </div>
              )}
            </div>
          )}

          {onBulkUploadClick && (
            <BaseButton
              text={bulkUploadBtnText || "Bulk Upload"}
              startIcon={<UploadIcon className="size-4" />}
              variant="secondary"
              size="small"
              onClick={onBulkUploadClick}
            />
          )}

          {onCreateClick && (
            <BaseButton
              text={createBtnText || "Create"}
              textIcon={PlusIcon}
              variant="primary"
              size="small"
              onClick={onCreateClick}
            />
          )}
        </div>
      </div>

      {onSelectRows && (selectedRows?.length ?? 0) > 0 && (
        <div className="flex items-center gap-3 px-3 py-2 bg-primary/10 rounded-md">
          <Typography size="sm" weight="medium">
            {(selectedRows?.length ?? 0)} row{(selectedRows?.length ?? 0) !== 1 ? "s" : ""} selected
          </Typography>
          <BaseButton
            text="Perform Action"
            size="x-small"
            variant="primary"
            onClick={() => onSelectRows(selectedRows ?? [])}
          />
        </div>
      )}
    </div>
  );
}
