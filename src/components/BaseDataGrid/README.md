# BaseDataGrid — Production-Grade Data Table Component

A **headless, modular, composable** data table component built with React, TypeScript, TanStack Table v8, and Tailwind CSS.

Inspired by AG Grid but implemented with modern React patterns, hooks, and full composability.

## 📋 Quick Start

### Installation

Ensure you have TanStack Table installed:

```bash
npm install @tanstack/react-table
```

### Basic Usage

```tsx
import { useRef } from "react";
import BaseDataGrid from "@/components/BaseDataGrid";
import type { BaseDataGridRef } from "@/components/BaseDataGrid";

function MyTable() {
  const tableRef = useRef<BaseDataGridRef>(null);

  const data = [
    { id: 1, name: "Alice", age: 28 },
    { id: 2, name: "Bob", age: 35 },
  ];

  return <BaseDataGrid ref={tableRef} data={data} rowId="id" />;
}
```

✅ **That's it!** Columns auto-generate, search & pagination included.

---

## 🎯 Architecture

### Folder Structure

```
BaseDataGrid/
├── BaseDataGrid.tsx               # Public component entry
├── BaseDataGrid.types.ts          # All TypeScript types
├── BaseDataGrid.context.tsx       # Optional React context
├── BaseDataGrid.md                # Full documentation
├── BaseDataGrid.examples.tsx      # Usage examples
├── index.ts                       # Public exports
│
├── hooks/
│   ├── useBaseDataGrid.ts         # ⭐ Main orchestrator (state + logic)
│   ├── useDataGridColumns.ts      # Column generation & normalization
│   ├── useDataGridActions.ts      # Ref imperative API
│   ├── useClientFiltering.ts      # Client-side search
│   ├── useServerFiltering.ts      # Server-side query state
│   ├── useRowActions.ts           # Row actions helper
│   ├── useStatusRenderer.ts       # Status cell rendering
│   ├── useAutoColumnDetection.ts  # Auto infer columns from data
│   └── useEdgeCases.ts            # Edge case warnings
│
├── components/
│   ├── TableHeader.tsx            # Table header row
│   ├── TableToolbar.tsx           # Search bar + filters
│   ├── TablePagination.tsx        # Pagination controls
│   ├── ColumnActions.tsx          # Action buttons
│   ├── RowOptionsMenu.tsx         # Row menu (⋮)
│   ├── StatusCell.tsx             # Status badge
│   ├── ImageCell.tsx              # Image thumbnail
│   ├── LinkCell.tsx               # Hyperlink
│   └── EmptyState.tsx             # No data fallback
│
└── utils/
    ├── inferColumnType.ts         # Type detection
    ├── normalizeColumns.ts        # Column def normalization
    ├── isImageField.ts            # Image detection
    ├── isLinkField.ts             # Link detection
    ├── safeGet.ts                 # Deep value access
    └── formatters.ts              # Date, number, currency
```

### Design Principles

| Principle                  | How                                              | Why                                |
| -------------------------- | ------------------------------------------------ | ---------------------------------- |
| **Separation of Concerns** | Logic → hooks, UI → components, Types → types.ts | Easier testing, reuse, maintenance |
| **Composable**             | Every feature is opt-in                          | Only pay for what you use          |
| **Modular**                | No monolithic files                              | Easier to understand and extend    |
| **Typed**                  | Full TypeScript support                          | Catch errors at build time         |
| **Flexible**               | Controlled + uncontrolled modes                  | Works with any state management    |

---

## 🚀 Features

### ✅ Core

- [x] Automatic column generation from data
- [x] Manual column definitions (TanStack ColumnDef)
- [x] Client-side search & filtering
- [x] Server-side filtering & pagination
- [x] Ref API for external control
- [x] Row click handlers
- [x] Horizontal scroll for wide tables
- [x] Empty state & loading states

### ✅ Column Features

- [x] Status badges with color mapping
- [x] Image thumbnails (auto-detect or manual)
- [x] Hyperlink rendering (internal/external)
- [x] Auto column type detection (date, number, string)
- [x] Column actions (Edit, View, Delete)

### ✅ Row Features

- [x] Overflow menu (⋮) with custom actions
- [x] Dynamic row options (per-row visibility)
- [x] Auto-refresh after actions
- [x] Safe row ID handling (string, number, function)

### ✅ Edge Cases

- [x] Empty data handling
- [x] Loading + empty states
- [x] Missing row IDs (fallback to index)
- [x] Deeply nested values (safeGet util)
- [x] Mixed column types
- [x] SSR safety (hydration mismatch)
- [x] Rapid refetch prevention
- [x] Client ↔ Server mode switching

---

## 📖 Usage Patterns

### Pattern 1: Uncontrolled Client-Side

```tsx
<BaseDataGrid data={items} rowId="id" />
```

**Features:** Auto-generated columns, client search, pagination.

---

### Pattern 2: Controlled Server-Side

```tsx
const [data, setData] = useState([])

<BaseDataGrid
  data={data}
  fetchData={async (query) => {
    const res = await fetch(`/api/items?${serialize(query)}`)
    const { rows } = await res.json()
    setData(rows)
    return { rows }
  }}
  mode="server"
  onQueryChange={(q) => console.log('Query:', q)}
/>
```

**Features:** Server controls all filtering, search, pagination.

---

### Pattern 3: Manual Columns

```tsx
const columns: ColumnDef<Item>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => <StatusBadge value={info.getValue()} />,
  },
]

<BaseDataGrid data={data} columns={columns} autoGenerateColumns={false} />
```

**Features:** Full control over rendering.

---

### Pattern 4: With Actions

```tsx
<BaseDataGrid
  data={data}
  colActions={{
    edit: {
      icon: "✏️",
      onClick: async (row, actions) => {
        await editItem(row);
        await actions.refetch();
      },
      autoRefresh: true,
    },
    delete: {
      icon: "🗑️",
      onClick: async (row, actions) => {
        if (confirm("Delete?")) {
          await deleteItem(row.id);
          await actions.refetch();
        }
      },
      danger: true,
    },
  }}
  rowOptions={(row) => [{ label: "Duplicate", onClick: (r) => duplicate(r) }]}
/>
```

**Features:** Column actions + row overflow menu.

---

### Pattern 5: With Ref Control

```tsx
const tableRef = useRef<BaseDataGridRef>(null);

// Later...
tableRef.current?.refetch(); // Re-fetch data
tableRef.current?.getSelectedRows(); // Get selected rows
tableRef.current?.getCurrentRows(); // Get visible rows
tableRef.current?.getTableState(); // { pagination, sorting, ... }
```

---

## 🔍 Type Safety

All types are exported from `BaseDataGrid.types`:

```tsx
import type {
  BaseDataGridProps, // Props
  BaseDataGridRef, // Ref API
  ServerQueryState, // Server query
  ActionConfig, // Action config
  ColActions, // Column actions
  RowOption, // Row option
  SortDirection, // Sort direction
} from "@/components/BaseDataGrid";
```

---

## 🎨 Styling

Uses **Tailwind CSS** exclusively. All classes are customizable:

```tsx
<BaseDataGrid
  className="border-2 border-red-300"
  emptyState={<div className="py-12">No items</div>}
/>
```

To globally customize, edit component CSS in:

- `components/TableHeader.tsx`
- `components/TablePagination.tsx`
- etc.

---

## 🧪 Examples

See [BaseDataGrid.examples.tsx](./BaseDataGrid.examples.tsx) for:

1. Client-side auto-columns
2. Manual columns with custom rendering
3. Server-side fetching
4. Ref control patterns

---

## 📚 Full Documentation

See [BaseDataGrid.md](./BaseDataGrid.md) for:

- Installation
- Philosophy
- Client-side example (detailed)
- Server-side example (detailed)
- Ref API usage
- Column actions
- Row options
- Status customization
- Image & link handling
- Controlled vs uncontrolled
- Edge cases & gotchas
- Performance notes
- Comparison with AG Grid
- Troubleshooting

---

## 🔧 Extending BaseDataGrid

### Adding a Custom Hook

1. Create `hooks/useMyFeature.ts`
2. Export from `index.ts`
3. Use in your component or in `BaseDataGrid.tsx`

Example:

```tsx
// hooks/useMyFeature.ts
export function useMyFeature(data: any[]) {
  // Logic here
  return { computed };
}

// In BaseDataGrid.tsx
import { useMyFeature } from "./hooks/useMyFeature";
const { computed } = useMyFeature(data);
```

### Adding a Custom Component

1. Create `components/MyCell.tsx`
2. Use in column definition:

```tsx
{
  id: 'custom',
  cell: (info) => <MyCell value={info.getValue()} />
}
```

### Customizing Styles

Edit Tailwind classes directly in component files. No CSS-in-JS, just plain Tailwind.

---

## 🚨 Common Gotchas

### Q: Why is my table not re-rendering?

**A:** Ensure `data` is a new reference on change (not mutated).

### Q: How do I trigger a refetch?

**A:** Use the ref: `tableRef.current?.refetch()`

### Q: Can I use this with Next.js?

**A:** Yes, but wrap in `useEffect` or use `suppressHydrationWarning` for SSR.

### Q: How do I export data?

**A:** Use ref to get rows: `tableRef.current?.getCurrentRows()`

---

## 🎯 Best Practices

1. **Always provide `rowId`** — Prevents key-based bugs
2. **Memoize data** — Prevent unnecessary re-renders
3. **Use server-side for large datasets** — Better performance
4. **Cache columns** — Use `useMemo` for manual columns
5. **Handle errors** — Wrap `fetchData` in try/catch

---

## 📦 Bundle Size

- **BaseDataGrid**: ~15KB (gzipped)
- **TanStack Table**: ~20KB (gzipped)
- **Total**: ~35KB (gzipped)

vs AG Grid: ~2MB 🎉

---

## 🤝 Contributing

To add a feature:

1. Add types to `BaseDataGrid.types.ts`
2. Create hook in `hooks/`
3. Create component in `components/`
4. Update `index.ts` exports
5. Document in `BaseDataGrid.md`

---

## 📝 License

Open source. Use freely in any project.

---

**Built for scalability and developer experience.** Happy table building! 🎉
