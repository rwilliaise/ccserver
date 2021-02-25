import { ipcRenderer } from 'electron'

export type Item = {
  count: number
  nbtHash?: string
  name: string
  damage: number
}

export class Network {
  world: number[][][] = []

  private _items: Item[][] = []
  private _cache?: Item[]

  setInventory(id: number, items: Item[]): void {
    this._cache = undefined
    this._items[id] = items
  }

  getInventory(id: number): Item[] {
    return this._items[id] || []
  }

  hasItem(id: number, name: string): boolean {
    return this.getInventory(id).some((item) => {
      return item.name === name
    })
  }

  removeInventory(id: number): void {
    this._items.splice(id, 1)
  }

  get items(): Item[] {
    if (this._cache) {
      return this._cache
    }
    const cache = new Map<string, number>() // map of items and the count
    this._items.forEach((inventory) => {
      inventory.forEach((item) => {
        const key = `${item.nbtHash || 'nil'}.${item.name}.${item.damage}`
        if (cache.has(key)) {
          cache.set(key, cache.get(key)! + item.count)
        } else {
          cache.set(key, item.count)
        }
      })
    })
    const out: Item[] = []
    cache.forEach((value, key) => {
      const split = key.split('.')
      const nbtHash = split[0] == 'nil' ? undefined : split[0]
      const name = split[1]
      const damage = parseInt(split[2])

      out.push({ count: value, nbtHash: nbtHash, damage: damage, name: name })
    })
    this._cache = out
    return out
  }
}

export const TurtleNetwork = new Network()
