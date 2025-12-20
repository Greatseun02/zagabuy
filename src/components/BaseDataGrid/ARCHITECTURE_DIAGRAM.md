# 🎯 BaseDataGrid — Architecture Diagram

## Visual Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BaseDataGrid Component                          │
│                          (BaseDataGrid.tsx)                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │         useBaseDataGrid Hook (Main Orchestrator)               │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │ State Management:                                        │  │   │
│  │  │ • Pagination (pageIndex, pageSize)                      │  │   │
│  │  │ • Sorting (columnId, direction)                         │  │   │
│  │  │ • Search (string)                                       │  │   │
│  │  │ • Query (server mode)                                   │  │   │
│  │  │ • Loading state                                         │  │   │
│  │  │ • Mode detection (client/server/auto)                  │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │ Orchestrator Returns:                                    │  │   │
│  │  │ • table (TanStack instance)                             │  │   │
│  │  │ • pagination + setPagination                           │  │   │
│  │  │ • sorting + setSorting                                 │  │   │
│  │  │ • search + setSearch                                   │  │   │
│  │  │ • query + setQuery                                     │  │   │
│  │  │ • data (filtered/server)                               │  │   │
│  │  │ • loading state                                        │  │   │
│  │  │ • stateRef (for imperative API)                        │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                Helper Hooks Used Inside                         │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐   │   │
│  │  │ useDataGrid      │  │ useDataGrid      │  │ useClient   │   │   │
│  │  │ Columns          │  │ Actions          │  │ Filtering   │   │   │
│  │  │                  │  │                  │  │             │   │   │
│  │  │ Generates cols   │  │ Exposes ref API  │  │ Search      │   │   │
│  │  └──────────────────┘  └──────────────────┘  └─────────────┘   │   │
│  │                                                                  │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐   │   │
│  │  │ useAuto          │  │ useServer        │  │ useRowActions   │   │
│  │  │ ColumnDetection  │  │ Filtering        │  │                 │   │
│  │  │                  │  │                  │  │ Row options     │   │
│  │  │ Type inference   │  │ Query state      │  │                 │   │
│  │  └──────────────────┘  └──────────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                      UI Component Rendering                             │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ┌─────────────────────────────────────────────────────────────┐  │  │
│  │ │             TableToolbar Component                         │  │  │
│  │ │  • Search Input (onSearch → setSearch)                    │  │  │
│  │ │  • Filter Controls (if needed)                           │  │  │
│  │ └─────────────────────────────────────────────────────────────┘  │  │
│  │                                                                    │  │
│  │ ┌─────────────────────────────────────────────────────────────┐  │  │
│  │ │              Table (HTML <table>)                          │  │  │
│  │ │  ┌───────────────────────────────────────────────────────┐  │  │  │
│  │ │  │ TableHeader Component                                │  │  │  │
│  │ │  │ • Renders <thead>                                   │  │  │  │
│  │ │  │ • Column names from ColumnDef.header                │  │  │  │
│  │ │  │ • Sortable headers                                  │  │  │  │
│  │ │  └───────────────────────────────────────────────────────┘  │  │  │
│  │ │                                                               │  │  │
│  │ │  ┌───────────────────────────────────────────────────────┐  │  │  │
│  │ │  │ <tbody> Rows                                         │  │  │  │
│  │ │  │ • Mapped from table.getRowModel().rows              │  │  │  │
│  │ │  │ • Each row renders cells                            │  │  │  │
│  │ │  │ • Cell types:                                       │  │  │  │
│  │ │  │   - StatusCell (for status columns)                │  │  │  │
│  │ │  │   - ImageCell (for images)                         │  │  │  │
│  │ │  │   - LinkCell (for links)                           │  │  │  │
│  │ │  │   - ColumnActions (for Edit/View/Delete)           │  │  │  │
│  │ │  │   - Custom cell from ColumnDef                     │  │  │  │
│  │ │  │   - Default text cell                              │  │  │  │
│  │ │  │ • RowOptionsMenu (⋮) for custom actions            │  │  │  │
│  │ │  └───────────────────────────────────────────────────────┘  │  │  │
│  │ │                                                               │  │  │
│  │ │  ┌───────────────────────────────────────────────────────┐  │  │  │
│  │ │  │ OR EmptyState if no rows                            │  │  │  │
│  │ │  │ OR Loading message if loading=true                  │  │  │  │
│  │ │  └───────────────────────────────────────────────────────┘  │  │  │
│  │ └─────────────────────────────────────────────────────────────┘  │  │
│  │                                                                    │  │
│  │ ┌─────────────────────────────────────────────────────────────┐  │  │
│  │ │         TablePagination Component                          │  │  │
│  │ │  • Page number display                                    │  │  │
│  │ │  • Page size selector (pageSizeOptions)                  │  │  │
│  │ │  • Prev/Next buttons → setPagination                     │  │  │
│  │ └─────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                      User Interaction                                 │
│  (Search, Sort, Paginate, Click Row, Click Action)                  │
└─────────────────────┬──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  Component Event Handlers                             │
│  • onSearch(string) → setSearch()                                    │
│  • onPageChange(idx) → setPagination()                               │
│  • onClick() → executeAction()                                       │
└─────────────────────┬──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    State Update (Hooks)                               │
│  useBaseDataGrid State → search, pagination, query, sorting         │
└─────────────────────┬──────────────────────────────────────────────┘
                      │
           ┌──────────┴──────────┐
           │                     │
           ▼                     ▼
      ┌─────────────────┐  ┌──────────────────┐
      │  Client Mode    │  │  Server Mode     │
      │                 │  │                  │
      │ useClientFilter │  │ useServerFilter  │
      │ → Filter data   │  │ → Make API call  │
      │   locally       │  │   fetchData(q)   │
      │                 │  │                  │
      │ Data Source:    │  │ Data Source:     │
      │ Props.data      │  │ API Response     │
      └────────┬────────┘  └────────┬─────────┘
               │                     │
               └──────────┬──────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │  useDataGridColumns Hook             │
        │  • Process columns definitions       │
        │  • Apply type detection              │
        │  • Normalize ColumnDef format        │
        └────────────┬────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────┐
        │  TanStack Table Instance             │
        │  • Apply sorting                     │
        │  • Apply filtering (if any)         │
        │  • Handle pagination                │
        │  • Generate getRowModel()           │
        └────────────┬────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────┐
        │  Component Rendering                 │
        │  • TableHeader (sorted columns)      │
        │  • <tbody> with processed rows       │
        │  • Cell components (Status, Image)  │
        │  • Row options menu                  │
        │  • TablePagination controls         │
        └────────────┬────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────┐
        │  DOM Update                          │
        │  User sees updated table             │
        └─────────────────────────────────────┘
```

---

## File Organization

```
BaseDataGrid/
│
├─ Core Files (3)
│  ├─ BaseDataGrid.tsx ............... Entry point, combines everything
│  ├─ BaseDataGrid.types.ts ......... All TypeScript types
│  └─ BaseDataGrid.context.tsx ...... Optional React Context
│
├─ Hooks (8)
│  ├─ useBaseDataGrid.ts ............ ⭐ Main orchestrator
│  │  └─ Uses: useDataGridColumns, useClientFiltering,
│  │           useServerFiltering, TanStack Table
│  │
│  ├─ useDataGridColumns.ts ......... Column logic
│  │  └─ Uses: normalizeColumns, useAutoColumnDetection
│  │
│  ├─ useDataGridActions.ts ........ Ref API, imperative methods
│  │
│  ├─ useClientFiltering.ts ........ Client-side search
│  │
│  ├─ useServerFiltering.ts ........ Server query state
│  │
│  ├─ useRowActions.ts ............. Row action helpers
│  │
│  ├─ useStatusRenderer.ts ......... Status cell JSX
│  │
│  ├─ useAutoColumnDetection.ts .... Type inference
│  │  └─ Uses: inferColumnType
│  │
│  └─ useEdgeCases.ts .............. Edge case warnings
│
├─ Components (9)
│  ├─ TableHeader.tsx .............. <thead> rendering
│  ├─ TableToolbar.tsx ............. Search input bar
│  ├─ TablePagination.tsx .......... Prev/Next, page size
│  ├─ ColumnActions.tsx ............ Action button group
│  ├─ RowOptionsMenu.tsx ........... Dropdown ⋮ menu
│  ├─ StatusCell.tsx ............... Badge with colors
│  ├─ ImageCell.tsx ................ <img> with lazy loading
│  ├─ LinkCell.tsx ................. <a> with proper attrs
│  └─ EmptyState.tsx ............... "No data" message
│
├─ Utils (6)
│  ├─ inferColumnType.ts ........... Detect: date, number, image, link
│  ├─ normalizeColumns.ts .......... TanStack ColumnDef cleanup
│  ├─ isImageField.ts .............. Check if image column
│  ├─ isLinkField.ts ............... Check if link column
│  ├─ safeGet.ts ................... Deep obj access (a.b.c.d)
│  └─ formatters.ts ................ Format date, number, currency
│
├─ Exports
│  ├─ index.ts ..................... Public API (30 exports)
│  └─ BaseDataGrid.examples.tsx .... 4 usage patterns
│
└─ Documentation (7 guides)
   ├─ GETTING_STARTED.md ........... 5-min quickstart
   ├─ README.md .................... Feature overview
   ├─ BaseDataGrid.md .............. Full guide (500+ lines)
   ├─ INDEX.md ..................... Complete index
   ├─ SETUP_VERIFICATION.md ........ Setup checklist
   ├─ COMPLETION_SUMMARY.md ........ Project summary
   ├─ FILE_MANIFEST.md ............. File listing
   └─ PACKAGE_OVERVIEW.md .......... This package overview
```

---

## Component Composition

```
BaseDataGrid
├─ TableToolbar
│  └─ Input (search)
│
├─ Table
│  ├─ TableHeader
│  │  └─ <thead> with column headers
│  │
│  └─ <tbody>
│     └─ Row for each item
│        ├─ StatusCell (if type='status')
│        ├─ ImageCell (if type='image')
│        ├─ LinkCell (if type='link')
│        ├─ ColumnActions (Edit/View/Delete)
│        │  └─ Action buttons
│        ├─ RowOptionsMenu (⋮)
│        │  └─ Dropdown menu
│        └─ Default cell rendering
│
└─ TablePagination
   ├─ Page number display
   ├─ Page size selector
   ├─ Prev button
   └─ Next button
```

---

## Mode Architecture

```
Input: props (data, fetchData, mode, etc)
         │
         ▼
Detect Mode (auto → client or server)
         │
         ├─────────────────┬─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    "client"          "server"            "auto"
         │                 │                 │
         │                 │        Decide based on:
         │                 │        fetchData? → "server"
         │                 │        else → "client"
         │                 │
    Client Flow          Server Flow
         │                 │
    useClientFilter   useServerFilter
    → Local search    → Query state (search, sort, page)
    → Filter props.   → Send to fetchData callback
      data            → Get response
    → Paginate        → Update props.data
    → Sort            → TanStack handles render
         │                 │
         └─────────────────┴─────────────────┐
                                             │
                                             ▼
                                    Render via TanStack
                                    (Same for both modes)
```

---

## Ref API Architecture

```
useDataGridActions Hook
│
├─ useImperativeHandle(props.ref, () => ({
│
│  ├─ refetch: () => stateRef.current.refetch()
│  │           └─ Call fetchData(getTableState())
│  │
│  ├─ setLoading: (v) => stateRef.current.loading = v
│  │              └─ Control loading state
│  │
│  ├─ getSelectedRows: () => stateRef.current.getSelectedRows()
│  │                   └─ Return selected rows
│  │
│  ├─ getCurrentRows: () => stateRef.current.getCurrentRows()
│  │                 └─ Return visible rows (after filtering)
│  │
│  └─ getTableState: () => stateRef.current.getTableState()
│                    └─ Return { pagination, sorting, filters, search }
│
└─ (All stateRef methods updated on every render)
```

---

## Type System

```
BaseDataGridProps<TData>
├─ data?: TData[]
├─ fetchData?: (q: ServerQueryState) => Promise<{rows: TData[], total?}>
├─ columns?: ColumnDef<TData>[]
├─ autoGenerateColumns?: boolean
├─ mode?: 'client' | 'server' | 'auto'
├─ rowId?: string | (row: TData) => string | number
├─ colActions?: ColActions<TData>
├─ rowOptions?: RowOption<TData>[] | (row: TData) => RowOption<TData>[]
├─ onQueryChange?: (q: ServerQueryState) => void
├─ onRowClick?: (row: TData) => void
├─ pageSizeOptions?: number[]
├─ loading?: boolean
├─ className?: string
├─ emptyState?: React.ReactNode
└─ renderers?: Partial<Record<string, React.ComponentType>>

BaseDataGridRef
├─ refetch: () => Promise<void>
├─ setLoading: (value: boolean) => void
├─ getSelectedRows: <T>() => T[]
├─ getCurrentRows: <T>() => T[]
└─ getTableState: () => {...}

ServerQueryState
├─ search?: string
├─ filters?: Record<string, unknown>
├─ sort?: { field: string; direction: 'asc' | 'desc' } | null
└─ pagination?: { page: number; pageSize: number }
```

---

## Summary

✅ **Modular architecture** — Small, focused files  
✅ **Clear separation** — Hooks, components, utils, types  
✅ **Composable** — Everything works together  
✅ **Extensible** — Easy to add features  
✅ **Performant** — Optimized renders  
✅ **Typed** — 100% TypeScript  
✅ **Documented** — 7 comprehensive guides  
✅ **Production-ready** — No placeholders

---

**Built for scale and maintainability.** 🚀
