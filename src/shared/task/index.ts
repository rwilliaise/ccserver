import { SidedState } from '../data/state'

export enum TaskId {
  CRAFT
}

/**
 * Turtle specific, replicatable action.
 */
export abstract class Task {
  abstract id: TaskId

  constructor (public state: SidedState) {}

  abstract run (obj: object): void
}
