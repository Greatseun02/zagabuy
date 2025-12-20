# BaseDataGrid Documentation

A production-grade, modular, composable data table component built with React, TypeScript, TanStack Table, and Tailwind CSS.

## Table of Contents

1. [Installation](#installation)
2. [Philosophy](#philosophy)
3. [Basic Usage](#basic-usage)
4. [Client-Side Example](#client-side-example)
5. [Server-Side Example](#server-side-example)
6. [Ref API](#ref-api)
7. [Column Actions](#column-actions)
8. [Row Options](#row-options)
9. [Status Customization](#status-customization)
10. [Image & Link Handling](#image--link-handling)
11. [Controlled vs Uncontrolled](#controlled-vs-uncontrolled)
12. [Edge Cases](#edge-cases)
13. [Performance Notes](#performance-notes)
14. [Comparison with AG Grid](#comparison-with-ag-grid)

---

## Installation

BaseDataGrid requires:

- React 18+
- TypeScript 4.5+
- TanStack Table (React Table) v8+
- Tailwind CSS 3+

```bash
npm install @tanstack/react-table
```

Import the component:

```tsx
import BaseDataGrid from "@/components/BaseDataGrid";
import type { BaseDataGridRef } from "@/components/BaseDataGrid/BaseDataGrid.types";
```

---

## Philosophy

### Core Principles

- **Separation of Concerns**: Logic lives in hooks, UI in components, types in dedicated files
- **Composability**: Everything is opt-in and overrideable
- **No Monoliths**: Break things down into manageable pieces
- **Clarity First**: Code should be easy to read and understand
- **Extensibility**: Built as a framework primitive, not a page-specific table

### Architecture

```
BaseDataGrid/
├── BaseDataGrid.tsx           # Public entry point
├── BaseDataGrid.types.ts      # All shared types
├── BaseDataGrid.context.tsx   # Optional context for provider mode
├── hooks/
│   ├── useBaseDataGrid.ts         # (Future) Main orchestrator
│   ├── useDataGridColumns.ts      # Column generation & normalization
│   ├── useDataGridActions.ts      # Ref + imperative actions
│   ├── useClientFiltering.ts      # Client-side search/filter
│   ├── useServerFiltering.ts      # Server-side query state
│   ├── useRowActions.ts           # Row-level actions
│   ├── useStatusRenderer.ts       # Status badge rendering
│   ├── useAutoColumnDetection.ts  # Auto-infer columns from data
│   └── useEdgeCases.ts            # Edge case handling
├── components/
│   ├── TableHeader.tsx        # Table header row
│   ├── TableToolbar.tsx       # Search & filter bar
│   ├── TablePagination.tsx    # Pagination controls
│   ├── ColumnActions.tsx      # Action buttons per column
│   ├── RowOptionsMenu.tsx     # Row overflow menu (⋮)
│   ├── StatusCell.tsx         # Status badge component
│   ├── ImageCell.tsx          # Image thumbnail
│   ├── LinkCell.tsx           # Hyperlink component
│   └── EmptyState.tsx         # No data fallback
├── utils/
│   ├── inferColumnType.ts     # Type detection from values
│   ├── normalizeColumns.ts    # Column def normalization
│   ├── isImageField.ts        # Image detection
│   ├── isLinkField.ts         # Link detection
│   ├── safeGet.ts             # Safe nested value access
│   └── formatters.ts          # Date, number, currency formatters
└── BaseDataGrid.md            # This file
```

---

## Basic Usage

### Minimal Example

```tsx
import { useRef } from "react";
import BaseDataGrid from "@/components/BaseDataGrid";
import type { BaseDataGridRef } from "@/components/BaseDataGrid/BaseDataGrid.types";

function MyTable() {
  const tableRef = useRef<BaseDataGridRef>(null);

  const data = [
    { id: 1, name: "Alice", age: 28, status: "active" },
    { id: 2, name: "Bob", age: 35, status: "pending" },
    { id: 3, name: "Charlie", age: 42, status: "inactive" },
  ];

  return <BaseDataGrid ref={tableRef} data={data} rowId="id" />;
}
```

**What happens here:**

- ✅ Auto-generates columns from data keys
- ✅ Client-side search enabled by default
- ✅ Pagination (default 10 rows/page)
- ✅ No configuration required

---

## Client-Side Example

Client-side mode: all filtering, sorting, pagination happens in the browser.

```tsx
import BaseDataGrid from "@/components/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import type { BaseDataGridProps } from "@/components/BaseDataGrid/BaseDataGrid.types";

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  avatar?: string;
}

function UserTable() {
  const data: User[] = [
    {
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      status: "active",
      avatar: "https://example.com/alice.png",
    },
    { id: "2", name: "Bob", email: "bob@example.com", status: "pending" },
  ];

  const columns: ColumnDef<User>[] = [
    { id: "name", accessorKey: "name", header: "Name" },
    { id: "email", accessorKey: "email", header: "Email" },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const value = info.getValue() as string;
        const color =
          value === "active"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800";
        return (
          <span className={`px-2 py-1 rounded text-xs ${color}`}>{value}</span>
        );
      },
    },
    {
      id: "avatar",
      accessorKey: "avatar",
      header: "Avatar",
      cell: (info) => {
        const src = info.getValue() as string | undefined;
        return src ? (
          <img src={src} alt="avatar" className="w-8 h-8 rounded" />
        ) : null;
      },
    },
  ];

  return (
    <BaseDataGrid<User>
      data={data}
      columns={columns}
      autoGenerateColumns={false}
      mode="client"
      rowId="id"
      pageSizeOptions={[5, 10, 20]}
      className="p-4"
    />
  );
}
```

**Key props:**

- `data`: Array of rows
- `columns`: Optional manual column definitions (auto-generated if omitted)
- `autoGenerateColumns`: Defaults to `true`
- `mode`: `'client'` (default if no `fetchData`)
- `rowId`: Unique row identifier

---

## Server-Side Example

Server-side mode: filtering, search, pagination, sorting are controlled and sent to backend.

```tsx
import { useRef, useState } from "react";
import BaseDataGrid from "@/components/BaseDataGrid";
import type {
  BaseDataGridRef,
  ServerQueryState,
} from "@/components/BaseDataGrid/BaseDataGrid.types";

interface Product {
  id: string;
  name: string;
  price: number;
  status: string;
}

async function fetchProducts(
  query: ServerQueryState
): Promise<{ rows: Product[]; total: number }> {
  // Send query to API
  const params = new URLSearchParams({
    search: query.search || "",
    sort: query.sort ? `${query.sort.field}:${query.sort.direction}` : "",
    page: String(query.pagination?.page || 1),
    pageSize: String(query.pagination?.pageSize || 10),
  });

  const res = await fetch(`/api/products?${params}`);
  return res.json();
}

function ProductTable() {
  const tableRef = useRef<BaseDataGridRef>(null);
  const [data, setData] = useState<Product[]>([]);

  return (
    <BaseDataGrid<Product>
      ref={tableRef}
      data={data}
      fetchData={fetchProducts}
      mode="server"
      rowId="id"
      onQueryChange={(q) => {
        console.log("Query changed:", q);
        fetchProducts(q).then((res) => setData(res.rows));
      }}
      loading={false}
    />
  );
}
```

**Key props:**

- `fetchData`: Function that accepts `ServerQueryState` and returns `{ rows, total? }`
- `mode`: `'server'` (auto-detected if `fetchData` provided)
- `onQueryChange`: Emitted when filters, search, sort, or pagination change

---

## Ref API

The ref provides external control:

```tsx
const tableRef = useRef<BaseDataGridRef>(null);

// Later...
tableRef.current?.refetch(); // Re-fetch data
tableRef.current?.setLoading(true); // Set loading state
tableRef.current?.getSelectedRows(); // Get currently selected rows
tableRef.current?.getCurrentRows(); // Get visible rows after filtering
tableRef.current?.getTableState(); // Get full table state: { pagination, sorting, filters, search }
```

Example usage:

```tsx
function Actions() {
  const tableRef = useRef<BaseDataGridRef>(null);

  async function handleRefresh() {
    await tableRef.current?.refetch();
  }

  function handleExport() {
    const rows = tableRef.current?.getCurrentRows();
    console.log("Export:", rows);
  }

  return (
    <>
      <button onClick={handleRefresh}>Refresh</button>
      <button onClick={handleExport}>Export</button>
    </>
  );
}
```

---

## Column Actions

Support for Edit, View, Delete actions on each row.

```tsx
<BaseDataGrid<User>
  data={users}
  colActions={{
    view: {
      icon: "👁️",
      tooltip: "View",
      onClick: async (row, actions) => {
        alert(`View user: ${row.name}`);
      },
    },
    edit: {
      icon: "✏️",
      tooltip: "Edit",
      onClick: async (row, actions) => {
        console.log("Edit:", row);
        // After edit, refresh:
        await actions.refetch();
      },
      autoRefresh: true,
    },
    delete: {
      icon: "🗑️",
      tooltip: "Delete",
      onClick: async (row, actions) => {
        if (confirm("Delete this row?")) {
          await deleteUser(row.id);
          await actions.refetch();
        }
      },
      danger: true,
      autoRefresh: true,
    },
  }}
/>
```

**ActionConfig options:**

- `onClick`: Function called when action is triggered
- `icon`: React node or custom icon
- `tooltip`: Hover text
- `autoRefresh`: Auto-refresh table after action
- `danger`: Style as destructive (red)

---

## Row Options

Dropdown menu (⋮) for additional row actions.

```tsx
<BaseDataGrid<User>
  data={users}
  rowOptions={(row) => [
    {
      label: "Duplicate",
      onClick: async (r, actions) => {
        await duplicateUser(r.id);
        await actions.refetch();
      },
    },
    {
      label: "Archive",
      onClick: async (r, actions) => {
        await archiveUser(r.id);
        await actions.refetch();
      },
      autoRefresh: true,
    },
    {
      label: "Delete",
      onClick: async (r, actions) => {
        if (confirm("Delete?")) {
          await deleteUser(r.id);
          await actions.refetch();
        }
      },
      danger: true,
    },
  ]}
/>
```

**RowOption options:**

- `label`: Display text
- `onClick`: Handler function
- `autoRefresh`: Auto-refresh after action
- `danger`: Style as destructive

**Dynamic row options:**

```tsx
rowOptions={(row) => {
  const opts = [{ label: 'View', onClick: () => {} }]
  if (row.status === 'pending') {
    opts.push({ label: 'Approve', onClick: () => {} })
  }
  return opts
}}
```

---

## Status Customization

Automatic status cell rendering with custom color mappings.

```tsx
<BaseDataGrid<Task>
  data={tasks}
  columns={[
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const value = info.getValue() as string;
        const mapping: Record<string, string> = {
          open: "bg-blue-100 text-blue-800",
          in_progress: "bg-yellow-100 text-yellow-800",
          closed: "bg-green-100 text-green-800",
          blocked: "bg-red-100 text-red-800",
        };
        const color = mapping[value] || "bg-gray-100 text-gray-800";
        return (
          <span className={`px-2 py-1 rounded text-xs ${color}`}>{value}</span>
        );
      },
    },
  ]}
/>
```

**Auto-detection:**

If a column is named `status` or contains `status`, a StatusCell is rendered by default:

```tsx
// Auto-renders with sensible defaults
const columns = [
  {
    id: "status",
    accessorKey: "status",
    // StatusCell handles this automatically
  },
];
```

---

## Image & Link Handling

### Image Fields

Images are auto-detected by:

- Column name containing `'image'`
- Value is an image URL (e.g., `.png`, `.jpg`, `.gif`)

```tsx
// Auto-renders as image
const data = [
  { id: 1, name: 'Product A', thumbnailUrl: 'https://example.com/a.png' },
]

// Or manual:
<BaseDataGrid
  columns={[
    {
      id: 'thumbnail',
      accessorKey: 'thumbnailUrl',
      cell: (info) => {
        const src = info.getValue() as string
        return <img src={src} alt="thumb" className="w-12 h-12 object-cover rounded" />
      },
    },
  ]}
/>
```

### Link Fields

Links are auto-detected by:

- Column name containing `'url'` or `'link'`
- Value starts with `http`

```tsx
// Auto-renders as link
const data = [{ id: 1, title: 'Article', articleUrl: 'https://example.com/article' }]

// Or manual:
<BaseDataGrid
  columns={[
    {
      id: 'url',
      accessorKey: 'url',
      cell: (info) => {
        const href = info.getValue() as string
        return (
          <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 underline">
            Open
          </a>
        )
      },
    },
  ]}
/>
```

---

## Controlled vs Uncontrolled

### Uncontrolled (Default)

Table manages its own state:

```tsx
<BaseDataGrid data={data} />
```

### Controlled (Server-Side)

You control data, pagination, filtering:

```tsx
const [data, setData] = useState([])
const [query, setQuery] = useState<ServerQueryState>({})

<BaseDataGrid
  data={data}
  fetchData={async (q) => {
    setQuery(q)
    const res = await fetch(`/api/items?${serialize(q)}`)
    const { rows, total } = await res.json()
    setData(rows)
    return { rows, total }
  }}
  onQueryChange={(q) => {
    // Handle query changes if needed
    console.log('Query:', q)
  }}
/>
```

---

## Edge Cases

### Empty Data

```tsx
// Renders EmptyState component
<BaseDataGrid data={[]} emptyState={<div>No items found</div>} />
```

### Loading + Empty

```tsx
<BaseDataGrid data={loading ? [] : data} loading={loading} />
```

### Server Pagination with Unknown Total

```tsx
// When API doesn't return total count
const [hasMore, setHasMore] = useState(true)

<BaseDataGrid
  data={data}
  fetchData={async (q) => {
    const res = await fetch(`/api/items?page=${q.pagination?.page}`)
    const items = await res.json()
    setHasMore(items.length === q.pagination?.pageSize)
    return { rows: items }
  }}
/>
```

### Missing Row IDs

```tsx
// Falls back to array index
<BaseDataGrid data={data} /> // ⚠️ Not recommended for dynamic data

// Better: provide rowId
<BaseDataGrid data={data} rowId="id" />

// Or use function
<BaseDataGrid data={data} rowId={(row) => `${row.userId}_${row.timestamp}`} />
```

### Deeply Nested Values

```tsx
import { safeGet } from "@/components/BaseDataGrid/utils/safeGet";

<BaseDataGrid
  data={data}
  columns={[
    {
      id: "authorName",
      accessorFn: (row) => safeGet(row, "author.profile.name", "N/A"),
      header: "Author",
    },
  ]}
/>;
```

### Mixed Column Data Types

```tsx
// Type detection is automatic, but you can override:
<BaseDataGrid
  data={data}
  columns={[
    {
      id: "mixedField",
      accessorKey: "mixedField",
      cell: (info) => {
        const value = info.getValue();
        return typeof value === "number" ? value.toFixed(2) : String(value);
      },
    },
  ]}
/>
```

### Very Wide Tables

```tsx
// Use horizontal scroll
<div className="overflow-x-auto">
  <BaseDataGrid data={data} className="min-w-max" />
</div>
```

### Rapid Refetch Calls

```tsx
const tableRef = useRef<BaseDataGridRef>(null);
const [pending, setPending] = useState(false);

async function handleRefresh() {
  if (pending) return; // Debounce

  setPending(true);
  try {
    await tableRef.current?.refetch();
  } finally {
    setPending(false);
  }
}
```

### Switching Between Client ↔ Server Modes

```tsx
const [useServer, setUseServer] = useState(false)

<BaseDataGrid
  data={data}
  fetchData={useServer ? fetchData : undefined}
  mode={useServer ? 'server' : 'client'}
/>

<button onClick={() => setUseServer(!useServer)}>Toggle Mode</button>
```

### Hydration Mismatch (SSR Safety)

```tsx
import { useEffect, useState } from "react";

function SSRSafeTable() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <BaseDataGrid data={data} />;
}
```

---

## Performance Notes

### Optimization Tips

1. **Memoize data**: Prevent unnecessary re-renders when data hasn't changed

   ```tsx
   const data = useMemo(() => items, [items]);
   ```

2. **Use `rowId`**: Helps React identify rows correctly in virtualized lists

   ```tsx
   <BaseDataGrid rowId="id" data={data} />
   ```

3. **Lazy load columns**: Only render visible columns

   ```tsx
   const columns = useMemo(() => generateColumns(data), [data]);
   ```

4. **Server-side pagination**: For large datasets, always use server-side mode

   ```tsx
   <BaseDataGrid fetchData={fetchFromServer} mode="server" />
   ```

5. **Avoid inline functions**: Use `useCallback` for handlers
   ```tsx
   const handleDelete = useCallback(async (row) => { ... }, [])
   <BaseDataGrid colActions={{ delete: { onClick: handleDelete } }} />
   ```

---

## Comparison with AG Grid

| Feature            | AG Grid                      | BaseDataGrid              |
| ------------------ | ---------------------------- | ------------------------- |
| **Bundle Size**    | ~2MB                         | ~50KB                     |
| **License**        | Freemium (paid for features) | Open (customize freely)   |
| **API Style**      | Options object               | React/hooks pattern       |
| **Column Actions** | Built-in menus               | Manual `rowOptions`       |
| **Virtualization** | Yes                          | Via TanStack Table        |
| **Filtering**      | Complex                      | Simple, server-controlled |
| **TypeScript**     | ✅                           | ✅                        |
| **Headless**       | No (opinionated UI)          | Yes (Tailwind)            |
| **Extensibility**  | Limited                      | Complete                  |
| **Learning Curve** | Steep                        | Gradual                   |

### Why Choose BaseDataGrid?

- **Lightweight**: Only pays for what you use
- **Modern React**: Hooks, composability, no class components
- **Full Control**: Customize every part
- **Open Source**: No licensing concerns
- **Production-Ready**: Handles edge cases, well-typed

### When to Choose AG Grid?

- **Enterprise features** needed (charts, master-detail)
- **Out-of-box experience** desired
- **Premium support** required
- **Complex pivot tables** needed

---

## Examples

### Complete Customer Table

```tsx
import BaseDataGrid from "@/components/BaseDataGrid";
import type {
  BaseDataGridRef,
  ServerQueryState,
} from "@/components/BaseDataGrid/BaseDataGrid.types";
import { useRef, useState } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
  status: "active" | "inactive";
  createdAt: string;
}

async function fetchCustomers(query: ServerQueryState) {
  const params = new URLSearchParams({
    search: query.search || "",
    page: String(query.pagination?.page || 1),
  });
  const res = await fetch(`/api/customers?${params}`);
  return res.json();
}

export default function CustomerTable() {
  const tableRef = useRef<BaseDataGridRef>(null);
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button
          onClick={() => tableRef.current?.refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Refresh
        </button>
      </div>

      <BaseDataGrid<Customer>
        ref={tableRef}
        data={data}
        loading={loading}
        fetchData={async (q) => {
          setLoading(true);
          try {
            const result = await fetchCustomers(q);
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
            onClick: async (row) => {
              alert(`View: ${row.name}`);
            },
          },
          edit: {
            icon: "✏️",
            onClick: async (row, actions) => {
              alert(`Edit: ${row.name}`);
              await actions.refetch();
            },
            autoRefresh: true,
          },
          delete: {
            icon: "🗑️",
            onClick: async (row, actions) => {
              if (confirm("Delete?")) {
                await fetch(`/api/customers/${row.id}`, { method: "DELETE" });
                await actions.refetch();
              }
            },
            danger: true,
          },
        }}
      />
    </div>
  );
}
```

---

## Troubleshooting

### Q: Table doesn't render

**A:** Ensure `data` is defined and `columns` are valid.

### Q: Pagination not working

**A:** Verify `pageSizeOptions` contains valid numbers and `rowId` is correct.

### Q: Search doesn't filter

**A:** For server-side, implement search in `fetchData`. For client-side, ensure `mode="client"`.

### Q: Ref is null

**A:** Use `forwardRef` and pass `ref` prop correctly.

### Q: Images not displaying

**A:** Check URLs are valid and CORS is allowed.

---

## Contributing

To extend BaseDataGrid:

1. Add hook to `hooks/`
2. Add component to `components/`
3. Add types to `BaseDataGrid.types.ts`
4. Update docs

---

**Built for scalability and developer experience.**
