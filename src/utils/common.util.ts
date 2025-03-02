/* eslint-disable @typescript-eslint/no-explicit-any */

// convert camelCase keys to snake_case
export function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    newObj[snakeKey] = value;
  }
  return newObj;
}

// convert snake_case keys to camelCase
export function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => snakeToCamel(item));
  } else if (obj !== null && typeof obj === "object") {
    const newObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/(_\w)/g, (matches) =>
        matches[1].toUpperCase(),
      );
      newObj[camelKey] = snakeToCamel(value);
    }
    return newObj;
  }
  return obj;
}
