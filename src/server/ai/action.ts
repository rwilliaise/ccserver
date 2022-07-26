import { GlobalState } from '../../shared/data/state'

export abstract class Action {
  abstract condition (state: GlobalState): boolean
  abstract effect (state: GlobalState): GlobalState
  abstract cost (state: GlobalState): number

  abstract execute (state: GlobalState): boolean
}
