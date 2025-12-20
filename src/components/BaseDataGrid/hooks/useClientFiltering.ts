import { useMemo, useState } from "react";

export function useClientFiltering<T>(data: T[] = []) {
  const [search, setSearch] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    if (!search || !search.trim()) return data;
    const s = search.toLowerCase();
    return data.filter((r: any) => JSON.stringify(r).toLowerCase().includes(s));
  }, [data, search]);

  return { filtered, search, setSearch };
}
