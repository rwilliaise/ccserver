import { JsonObject } from './packet'

export class WorldData {
  palette: Record<string, string> = {}

  getPalette (str: string): number {
    for (const key of Object.keys(this.palette)) {
      if (this.palette[key] === str.trim()) {
        return Number(key)
      }
    }
    return -1
  }

  wrap (): JsonObject {
    return this.palette
  }
}
