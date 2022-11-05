import { Rect } from '../math/rect'
import { Vec3 } from '../math/vector'
import { TaskExecutor } from '../task/executor'

type Listener<T extends keyof TurtleState> = (key: T, oldValue: TurtleState[T], newValue: TurtleState[T]) => void
export type TurtleId = string

export interface Equipped {
  right?: string
  left?: string
}

export class ListenersTable extends Map<keyof TurtleState, Listener<keyof TurtleState>> {
  on<T extends keyof TurtleState>(key: T, value: Listener<T>): void {
    this.set(key, value as Listener<keyof TurtleState>)
  }
}

export interface TurtleState extends TaskExecutor {
  worldPosition?: Vec3
  auth?: string
  equipped: Equipped
  id: TurtleId
  listeners: ListenersTable
}

export interface GlobalState {
  claims: Rect[]
  knownTurtles: string[]

  getAvailableTurtles: () => TurtleState[]
}

export interface SidedState {
  isClient: boolean
  global: GlobalState
  turtle?: TurtleState
}
