export function safeGet(obj: any, path: string, fallback?: any): any {
  const keys = path.split(".");
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
  }
  return result !== undefined ? result : fallback;
}
