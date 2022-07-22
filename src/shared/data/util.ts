
export function matchSchema (data: any, schema: any): boolean {
  return Object.entries(schema)
    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion */
    .every(([key, obj]) => typeof data[key as string] === typeof obj)
}
