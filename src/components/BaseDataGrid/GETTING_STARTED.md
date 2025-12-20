# 🚀 BaseDataGrid — Getting Started

## Installation

### 1. Ensure Dependencies

```bash
npm install @tanstack/react-table tailwindcss
```

### 2. Verify Tailwind CSS

Make sure Tailwind CSS is configured in your `tailwind.config.js`:

```js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 3. Files Ready to Use

All files are in: `src/components/BaseDataGrid/`

No build steps needed — copy and use!

---

## 5-Minute Quick Start

### Step 1: Import

```tsx
import BaseDataGrid from "@/components/BaseDataGrid";
import type { BaseDataGridRef } from "@/components/BaseDataGrid";
```

### Step 2: Define Data

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
}

const users: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com", status: "active" },
  { id: "2", name: "Bob", email: "bob@example.com", status: "inactive" },
];
```

### Step 3: Render Table

```tsx
function UsersTable() {
  const tableRef = useRef<BaseDataGridRef>(null);

  return (
    <div className="p-6">
      <BaseDataGrid<User> ref={tableRef} data={users} rowId="id" />
    </div>
  );
}
```

**Done!** ✅

You now have:

- ✅ Auto-generated columns from data
- ✅ Full-text search
- ✅ Pagination (10 rows/page)
- ✅ Sortable headers
- ✅ Responsive design

---

## Common Patterns

### Pattern 1: Server-Side Data

```tsx
async function fetchUsers(query: ServerQueryState) {
  const res = await fetch(
    `/api/users?search=${query.search}&page=${query.pagination?.page}`
  );
  return res.json();
}

<BaseDataGrid<User> fetchData={fetchUsers} mode="server" rowId="id" />;
```

### Pattern 2: Custom Columns

```tsx
const columns: ColumnDef<User>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => {
      const status = info.getValue() as string
      return (
        <span className={status === 'active' ? 'text-green-600' : 'text-red-600'}>
          {status}
        </span>
      )
    },
  },
]

<BaseDataGrid<User>
  data={users}
  columns={columns}
  autoGenerateColumns={false}
/>
```

### Pattern 3: With Actions

```tsx
<BaseDataGrid<User>
  data={users}
  colActions={{
    edit: {
      icon: "✏️",
      onClick: (user) => {
        console.log("Edit:", user);
      },
    },
    delete: {
      icon: "🗑️",
      onClick: (user) => {
        console.log("Delete:", user);
      },
      danger: true,
    },
  }}
/>
```

### Pattern 4: Ref Control

```tsx
const tableRef = useRef<BaseDataGridRef>(null);

function handleRefresh() {
  tableRef.current?.refetch();
}

function handleExport() {
  const rows = tableRef.current?.getCurrentRows();
  console.log("Exporting:", rows);
}

return (
  <>
    <button onClick={handleRefresh}>Refresh</button>
    <button onClick={handleExport}>Export</button>
    <BaseDataGrid<User> ref={tableRef} data={users} />
  </>
);
```

---

## Documentation Map

| Want to...        | Read                                                     |
| ----------------- | -------------------------------------------------------- |
| See all features  | [README.md](./README.md)                                 |
| Learn everything  | [BaseDataGrid.md](./BaseDataGrid.md)                     |
| See code examples | [BaseDataGrid.examples.tsx](./BaseDataGrid.examples.tsx) |
| Find all exports  | [INDEX.md](./INDEX.md)                                   |
| Check setup       | [SETUP_VERIFICATION.md](./SETUP_VERIFICATION.md)         |
| Understand types  | [BaseDataGrid.types.ts](./BaseDataGrid.types.ts)         |

---

## Customization

### Change Styles

All components use Tailwind CSS. To customize:

1. Edit `components/TableHeader.tsx` for header styles
2. Edit `components/TablePagination.tsx` for pagination
3. Edit `components/StatusCell.tsx` for status colors
4. etc.

Example — Change header background:

```tsx
// components/TableHeader.tsx
<thead className="bg-blue-100">
  {" "}
  {/* was: bg-gray-50 */}
  {/* ... */}
</thead>
```

### Add Custom Components

Create a custom cell:

```tsx
function CustomCell({ value }: { value: string }) {
  return <div className="font-bold">{value}</div>
}

// Use in column:
{
  id: 'name',
  accessorKey: 'name',
  cell: (info) => <CustomCell value={info.getValue() as string} />
}
```

### Add Custom Hooks

Create `hooks/useMyFeature.ts`:

```tsx
export function useMyFeature(data: any[]) {
  const computed = useMemo(() => {
    // Your logic
    return data.map(...)
  }, [data])
  return { computed }
}
```

Export from `index.ts` and use anywhere.

---

## Troubleshooting

### Q: Table not rendering

**A:** Ensure:

- `data` is defined and is an array
- `rowId` matches a field in data
- Tailwind CSS is loaded

### Q: Styles look wrong

**A:** Verify:

- Tailwind CSS is properly configured
- `tailwind.config.js` includes `src/**/*.{tsx}`
- No CSS conflicts

### Q: Search not working

**A:** Check:

- For **client-side**: Ensure `data` is changing
- For **server-side**: Implement `fetchData` callback
- Check console for errors

### Q: Pagination doesn't work

**A:** Verify:

- `rowId` is unique per row
- `pageSizeOptions` contains valid numbers
- Page size doesn't exceed data length

### Q: Ref is null

**A:** Use `useRef` correctly:

```tsx
const tableRef = useRef<BaseDataGridRef>(null)  // ✅ Right
<BaseDataGrid ref={tableRef} ... />

// Later...
tableRef.current?.refetch()  // ✅ Works
```

---

## Performance Tips

1. **Memoize data** — Prevent unnecessary renders

   ```tsx
   const data = useMemo(() => items, [items]);
   ```

2. **Use `rowId`** — Helps React identify rows

   ```tsx
   <BaseDataGrid rowId="id" />
   ```

3. **Server-side for large datasets** — Better performance

   ```tsx
   <BaseDataGrid fetchData={...} mode="server" />
   ```

4. **Cache columns** — Use `useMemo`

   ```tsx
   const columns = useMemo(() => [...], [])
   ```

5. **Lazy load images** — Built-in
   ```tsx
   // ImageCell already has loading="lazy"
   ```

---

## Next Steps

1. ✅ Read [README.md](./README.md) for overview
2. ✅ Try examples in [BaseDataGrid.examples.tsx](./BaseDataGrid.examples.tsx)
3. ✅ Customize styles in `components/`
4. ✅ Read [BaseDataGrid.md](./BaseDataGrid.md) for full docs
5. ✅ Deploy to production!

---

## Support

- 📖 **Full docs:** [BaseDataGrid.md](./BaseDataGrid.md)
- 💡 **Examples:** [BaseDataGrid.examples.tsx](./BaseDataGrid.examples.tsx)
- 🔍 **Types:** [BaseDataGrid.types.ts](./BaseDataGrid.types.ts)
- 📋 **File index:** [INDEX.md](./INDEX.md)

---

**Happy table building! 🎉**
