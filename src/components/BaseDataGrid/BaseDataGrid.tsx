import React, { forwardRef, useState } from "react";
import { flexRender } from "@tanstack/react-table";
import type { BaseDataGridProps, BaseDataGridRef } from "./BaseDataGrid.types";
import { useBaseDataGrid } from "./hooks/useBaseDataGrid";
import { useDataGridActions } from "./hooks/useDataGridActions";
import { useEdgeCases } from "./hooks/useEdgeCases";
import TableHeader from "./components/TableHeader";
import TableToolbar from "./components/TableToolbar";
import TablePagination from "./components/TablePagination";
import EmptyState from "./components/EmptyState";
import ColumnVisibilityPanel from "./components/ColumnVisibilityPanel";

function BaseDataGridInner<TData extends object = any>(
  props: BaseDataGridProps<TData>,
  ref: any
) {
  const {
    rowId,
    onRowClick,
    className,
    emptyState,
    pageSizeOptions = [10, 25, 50],
  } = props;

  const [showColumnPanel, setShowColumnPanel] = useState(false);

  // Edge cases warning
  useEdgeCases(props);

  // Main orchestrator
  const {
    table,
    pagination,
    setPagination,
    search,
    setSearch,
    query,
    setQuery,
    data,
    loading,
    mode,
    stateRef,
  } = useBaseDataGrid(props);

  // Expose ref API
  useDataGridActions(props, stateRef);

  return (
    <div
      className={`w-full border py-3 px-5 rounded-md flex flex-col ${
        className ?? ""
      }`}
    >
      <div className="relative">
        <TableToolbar
          search={search}
          onSearch={(s: string) => {
            setSearch(s);
            if (mode === "server") {
              setQuery({ ...query, search: s });
            }
          }}
          onRefetch={() => stateRef.current?.refetch?.()}
          loading={loading}
          onToggleColumnVisibility={() => setShowColumnPanel(!showColumnPanel)}
        />
        {showColumnPanel && (
          <ColumnVisibilityPanel
            table={table}
            onClose={() => setShowColumnPanel(false)}
          />
        )}
      </div>

      <div className="flex-1 overflow-auto border rounded mt-3">
        <table className="w-full divide-y">
          <TableHeader table={table} />
          <tbody className="bg-sidebar divide-y">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="p-6">
                  {loading ? (
                    <div className="text-center text-sm text-gray-500">
                      Loading...
                    </div>
                  ) : (
                    emptyState ?? <EmptyState />
                  )}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const rowKey = rowId
                  ? typeof rowId === "function"
                    ? rowId(row.original)
                    : (row.original as any)[rowId]
                  : row.id;
                return (
                  <tr
                    key={rowKey ?? row.id}
                    className="hover:bg-sidebar/80 cursor-pointer"
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2 text-sm whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <TablePagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          onPageChange={(idx: number) =>
            setPagination((p) => ({ ...p, pageIndex: idx }))
          }
          onPageSizeChange={(s: number) =>
            setPagination((p) => ({ ...p, pageSize: s, pageIndex: 0 }))
          }
          pageSizeOptions={pageSizeOptions}
        />
      </div>
    </div>
  );
}

const BaseDataGrid = forwardRef(BaseDataGridInner) as <
  TData extends object = any
>(
  props: BaseDataGridProps<TData> & { ref?: React.Ref<BaseDataGridRef> }
) => React.ReactElement;

export default BaseDataGrid;
