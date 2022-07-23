
type Schema<T> = { [P in keyof T]: T[P] | SchemaSpec }

export class SchemaSpec {
  constructor (public compare: <T>(data: any, schema: Schema<T>, key: string) => boolean) {}
}

export class MultiSpec extends SchemaSpec {
  constructor (...comparables: any[]) {
    super((data, _, key) => comparables.some((value) => typeof data[key] === typeof value))
  }
}

export function matchSchema<T> (data: any, schema: Schema<T>): data is T {
  if (typeof data !== typeof schema) {
    return false
  }
  return Object.entries(schema)
    .every(([key, obj]) => {
      if (obj instanceof SchemaSpec) {
        return obj.compare<T>(data, schema, key)
      }
      return typeof data[key] === typeof obj
    })
}
