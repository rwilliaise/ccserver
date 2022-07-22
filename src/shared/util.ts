
export interface JsonObject {
  [key: string]: number | string | boolean | object | JsonObject
}

export function matchSchema (data: JsonObject, schema: JsonObject): boolean {
  const dataKeys = Object.keys(data)
  return Object.keys(schema)
    .every((key) => dataKeys.includes(key) && typeof data[key] === typeof schema[key])
}
