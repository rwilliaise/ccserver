
export function matchSchema<T> (data: any, schema: T): data is T {
  if (typeof data !== typeof schema) {
    return false
  }
  return Object.entries(schema)
    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion */
    .every(([key, obj]) => typeof data[key as string] === typeof obj)
}
