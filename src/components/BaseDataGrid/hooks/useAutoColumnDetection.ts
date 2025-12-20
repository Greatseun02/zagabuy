import { useMemo } from "react";
import { inferColumnType } from "../utils/inferColumnType";

export function useAutoColumnDetection<T extends Record<string, any>>(
  data?: T[]
) {
  return useMemo(() => {
    if (!data || data.length === 0) return [] as string[];
    const keys = new Set<string>();
    data.forEach((r) => Object.keys(r).forEach((k) => keys.add(k)));
    return Array.from(keys).map((key) => ({
      key,
      type: inferColumnType(data.map((d) => d[key])),
    }));
  }, [data]);
}
