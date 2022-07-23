import { Rect } from '../math/rect'
import { Vec3 } from '../math/vector'

export interface TurtleState {
  worldPosition?: Vec3
  auth?: string
  name?: string
}

export interface GlobalState {
  claims: Rect[]
  knownTurtles: string[]
}

export interface SidedState {
  isClient: boolean
  global: GlobalState
  turtle?: TurtleState
}
