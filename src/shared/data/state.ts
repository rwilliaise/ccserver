import { Rect } from '../math/rect'
import { Vec3 } from '../math/vector'

export interface Equipped {
  right?: string
  left?: string
}

export interface TurtleState {
  worldPosition?: Vec3
  auth?: string
  name?: string
  equipped: Equipped
}

export interface GlobalState {
  claims: Rect[]
  knownTurtles: string[]
  currentId: number
}

export interface SidedState {
  isClient: boolean
  global: GlobalState
  turtle?: TurtleState
}
