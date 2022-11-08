
export interface ItemStack {
  owner?: number
  count: number
  id: string
}

export function newStack (id: string, count = 1): ItemStack {
  return { count, id }
}
