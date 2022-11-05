import { Task, TaskId } from '.'

/*
 * Task that requires a specific precondition to be met before starting
 */
export abstract class SetupTask<T extends object> extends Task {
  abstract prepare (obj: T): void
  abstract precondition (obj: T): boolean
  abstract execute (obj: T): void

  abstract match (obj: object): obj is T

  run (obj: object): void {
    if (!this.match(obj)) {
      throw new Error('Malformed task input')
    }

    if (!this.precondition(obj)) {
      this.prepare(obj)
    }
  }
}
