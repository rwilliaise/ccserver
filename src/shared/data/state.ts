import { Rect } from '../math/rect'
import { Vec3 } from '../math/vector'

export interface Equipped {
  right?: string
  left?: string
}

export class ListenersTable extends Map<keyof TurtleState, <F extends keyof TurtleState>(key: F, oldValue: TurtleState[F], newValue: TurtleState[F]) => void> {}

export interface TurtleState {
  worldPosition?: Vec3
  auth?: string
  name?: string
  equipped: Equipped
  id: number

  listeners: ListenersTable
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
