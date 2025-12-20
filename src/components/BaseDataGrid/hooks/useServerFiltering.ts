import { useState } from "react";
import type { ServerQueryState } from "../BaseDataGrid.types";

export function useServerFiltering(initial?: ServerQueryState) {
  const [query, setQuery] = useState<ServerQueryState>(initial ?? {});

  function update(q: Partial<ServerQueryState>) {
    setQuery((prev) => ({ ...prev, ...q }));
  }

  return { query, setQuery: update };
}
