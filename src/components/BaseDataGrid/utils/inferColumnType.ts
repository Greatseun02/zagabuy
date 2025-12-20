export function inferColumnType(values: any[]): string {
  const nonNull = values.filter((v) => v !== null && v !== undefined);
  if (nonNull.length === 0) return "string";
  const sample = nonNull[0];
  if (typeof sample === "number") return "number";
  if (typeof sample === "boolean") return "boolean";
  if (String(sample).match(/\d{4}-\d{2}-\d{2}/)) return "date";
  if (String(sample).match(/https?:\/\/.+\.(png|jpe?g|gif|webp)$/i))
    return "image";
  if (String(sample).startsWith("http")) return "link";
  return "string";
}
