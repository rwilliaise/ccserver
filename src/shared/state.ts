import { Rect } from './math/rect'
import { Vec3 } from './math/vector'

export interface TurtleState {
  worldPosition: Vec3
  auth?: string
}

export interface GlobalState {
  claims: Rect[]
}

export interface PacketState {
  global: GlobalState
  turtle?: TurtleState
}
