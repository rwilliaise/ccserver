import { Vec3 } from '../../math/vector'
import { TurtleId } from '../state'

export type InventoryOwner = TurtleId | Vec3

export class ItemStack {
  nbtHash?: string
  owner?: InventoryOwner

  constructor (public itemId: string, public amount = 1) {}
}
