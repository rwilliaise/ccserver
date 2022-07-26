import { TurtleState } from '../data/state'

export enum TaskId {
  PATHFIND
}

/**
 * Turtle specific, replicatable action.
 */
export abstract class Task {
  abstract id: TaskId

  constructor (public state: TurtleState) {}

  abstract run (obj: object): void
}
