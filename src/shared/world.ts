import { JsonObject } from './packet'

export class WorldData {
  palette: Record<string, string> = {}

  getPalette (str: string): string | undefined {
    for (const key of Object.keys(this.palette)) {
      if (this.palette[key] === str.trim()) {
        return key
      }
    }
    return undefined
  }

  wrap (): JsonObject {
    return this.palette
  }
}
