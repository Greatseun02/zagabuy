export function isImageField(key: string, value?: any): boolean {
  return (
    key.toLowerCase().includes("image") ||
    (typeof value === "string" &&
      value.match(/https?:\/\/.+\.(png|jpe?g|gif|webp)$/i) !== null)
  );
}
