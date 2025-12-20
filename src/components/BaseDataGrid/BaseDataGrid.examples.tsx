/**
 * Example usage of BaseDataGrid
 * Shows both client-side and server-side implementations
 */

import { useRef, useState } from "react";
import { BaseDataGrid } from "@/components/BaseDataGrid";
import type {
  BaseDataGridRef,
  ServerQueryState,
} from "@/components/BaseDataGrid/BaseDataGrid.types";
import { ColumnDef } from "@tanstack/react-table";

// ============================================================================
// Data types
// ============================================================================

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  avatar?: string;
}

// ============================================================================
// Example 1: Client-side table (auto columns)
// ============================================================================

export function ClientTableBasic() {
  const data: User[] = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      status: "pending",
      joinDate: "2024-02-20",
    },
  ];

  return <BaseDataGrid data={data} rowId="id" pageSizeOptions={[5, 10, 20]} />;
}

// ============================================================================
// Example 2: Client-side with manual columns
// ============================================================================

export function ClientTableManualColumns() {
  const data: User[] = [
    {
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      status: "active",
      joinDate: "2024-01-15",
      avatar: "https://i.pravatar.cc/32?img=1",
    },
  ];

  const columns: ColumnDef<User>[] = [
    {
      id: "avatar",
      accessorKey: "avatar",
      header: "Avatar",
      cell: (info) => (
        <img
          src={info.getValue() as string}
          alt="avatar"
          className="w-8 h-8 rounded"
        />
      ),
    },
    { id: "name", accessorKey: "name", header: "Name" },
    { id: "email", accessorKey: "email", header: "Email" },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        const colors = {
          active: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          inactive: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded text-xs ${
              colors[status as keyof typeof colors]
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <BaseDataGrid<User>
      data={data}
      columns={columns}
      autoGenerateColumns={false}
      rowId="id"
    />
  );
}

// ============================================================================
// Example 3: Server-side with fetching
// ============================================================================

async function fetchUsers(
  query: ServerQueryState
): Promise<{ rows: User[]; total: number }> {
  // Simulate API call
  const pageIndex = query.pagination?.pageIndex ?? 0;
  const pageSize = query.pagination?.pageSize ?? 10;
  const search = query.search ?? "";

  // Mock data
  const allUsers: User[] = [
    {
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Bob",
      email: "bob@example.com",
      status: "pending",
      joinDate: "2024-02-20",
    },
    {
      id: "3",
      name: "Charlie",
      email: "charlie@example.com",
      status: "active",
      joinDate: "2024-03-10",
    },
  ];

  // Filter
  let filtered = allUsers;
  if (search) {
    filtered = allUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Paginate
  const start = pageIndex * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  return {
    rows,
    total: filtered.length,
  };
}

export function ServerTable() {
  const tableRef = useRef<BaseDataGridRef>(null);
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => tableRef.current?.refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
        <button
          onClick={() => {
            const state = tableRef.current?.getTableState();
            console.log("Table state:", state);
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Log State
        </button>
      </div>

      <BaseDataGrid<User>
        ref={tableRef}
        data={data}
        loading={loading}
        fetchData={async (q) => {
          setLoading(true);
          try {
            const result = await fetchUsers(q);
            setData(result.rows);
            return result;
          } finally {
            setLoading(false);
          }
        }}
        mode="server"
        rowId="id"
        colActions={{
          view: {
            icon: "👁️",
            tooltip: "View",
            onClick: async (row) => {
              alert(`View: ${row.name}`);
            },
          },
          delete: {
            icon: "🗑️",
            tooltip: "Delete",
            onClick: async (row, actions) => {
              if (confirm(`Delete ${row.name}?`)) {
                // Call API to delete
                alert("Deleted");
                await actions.refetch();
              }
            },
            danger: true,
          },
        }}
        rowOptions={(row) => [
          {
            label: "Send Email",
            onClick: (r) => {
              console.log(`Email sent to ${r.email}`);
            },
          },
          {
            label: "Archive",
            onClick: (r) => {
              console.log(`Archived ${r.name}`);
            },
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// Example 4: Using ref for external control
// ============================================================================

export function RefControlExample() {
  const tableRef = useRef<BaseDataGridRef>(null);
  const [status, setStatus] = useState<string>("");

  async function handleExport() {
    const rows = tableRef.current?.getCurrentRows();
    const state = tableRef.current?.getTableState();
    setStatus(`Exported ${rows?.length} rows`);
  }

  const data: User[] = [
    {
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Bob",
      email: "bob@example.com",
      status: "inactive",
      joinDate: "2024-02-20",
    },
  ];

  return (
    <div className="space-y-4">
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Export
      </button>
      {status && <div className="text-sm text-green-600">{status}</div>}

      <BaseDataGrid<User> ref={tableRef} data={data} rowId="id" />
    </div>
  );
}
