export function isLinkField(key: string, value?: any): boolean {
  return (
    key.toLowerCase().includes("url") ||
    key.toLowerCase().includes("link") ||
    (typeof value === "string" && value.startsWith("http"))
  );
}
