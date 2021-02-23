interface Node {
  parent?: Node
  runningCost: number
  runningState: WorldState
  currentAction?: Action
}

export type WorldState = Map<string, unknown>
type FiniteState = (this: Actor) => void

class StateMachine {
  public stack: FiniteState[] = []
  public actor: Actor

  public constructor(actor: Actor) {
    this.actor = actor
  }

  update() {
    const func = this.stack[this.stack.length - 1]
    func.apply(this.actor) // checkmate, stupidity
  }

  push(func: FiniteState) {
    this.stack.push(func)
  }

  pop() {
    this.stack.pop()
  }
}

/**
 * Used by the planner to set a concrete goal that the AI should go after.
 */
export abstract class Goal {
  /**
   * Checks if a goal should be pursued.
   *
   * @param state State that the Goal should check against.
   */
  abstract isValid(state: WorldState): boolean

  /**
   * Checks if a state reaches the given goal.
   *
   * @param state State that the Goal should check.
   */
  abstract reachedGoal(state: WorldState): boolean

  // TODO: probably should implement this system one of these days

  /*
   * Used to bias the planner towards some goals instead of others. The weight
   * of a given Goal is procedurally produced, based on the current state. This
   * allows the planner to plan more dynamically than if it were a fixed cost.
   *
   * Currently, this is not implemented. Hopefully, this will be implemented.
   *
   * @param state Given state that the Goal should assess.
   */
  // abstract getWeight(state: WorldState): number;
}

/**
 * Actions are used alongside other Actions to reach a given goal.
 */
export abstract class Action {
  private preconditions: WorldState = new Map()

  /**
   * Checks whether or not the current world state is valid for this given
   * action.
   *
   * @param state State that the Action should check against.
   */
  isValid(state: WorldState): boolean {
    for (const [index, value] of this.preconditions) {
      let match = false
      for (const [otherIndex, otherValue] of state) {
        if (otherIndex === index && otherValue === value) {
          match = true
        }
      }
      if (!match) {
        // HAS to meet ALL preconditions, or fails
        return false
      }
    }
    return this.checkProceduralPreconditions(state)
  }

  /**
   * Invoked after all constant preconditions are checked. This flags whether
   * or not a given state is good for this given action.
   *
   * @param state State to check against.
   */
  checkProceduralPreconditions(state: WorldState): boolean {
    return true
  }

  /**
   * Sets a given state to be a precondition.
   *
   * @param index Index of given value in the WorldState
   * @param value Value to be put as a condition.
   */
  addPrecondition(index: string, value: unknown): void {
    this.preconditions.set(index, value)
  }

  /**
   * Used to get how the given Action will affect the state.
   *
   * @param state State that the Action should mutate.
   */
  abstract populate(state: WorldState): WorldState

  /**
   * Perform the given action.
   */
  abstract perform(actor: Actor): boolean

  /**
   * Get the cost of a given state.
   */
  abstract getCost(): number

  /**
   * Used to assess when the Action is done performing.
   */
  abstract isDone(): boolean

  /**
   * Clean up variables and other things within the Action.
   */
  reset(): void {
    // nothing to clean up!
  }
}

/**
 * Action that requires the Actor to be at a given target position.
 */
// export abstract class MovingAction extends Action {
// 	public target?: Vector3;
// 	public inRange = false;
//
// 	checkProceduralPreconditions(state: WorldState) {
// 		const foundTarget = this.findTarget(state);
// 		if (foundTarget) {
// 			this.target = foundTarget;
// 			return true;
// 		}
// 		return false;
// 	}
//
// 	reset() {
// 		this.target = undefined;
// 		this.inRange = false;
// 	}
//
// 	/**
// 	 * Tries to find a viable target, and returns the position.
// 	 *
// 	 * @param state State to get target from
// 	 */
// 	abstract findTarget(state: WorldState): Vector3 | undefined;
// }

export class Planner {
  // AI goals and possible actions
  private goals: Goal[] = []
  private actions: Action[] = []

  /**
   * Creates a new plan for the AI to follow.
   */
  plan(state: WorldState): Action[] {
    this.actions.forEach((value) => {
      value.reset()
    })

    // goals that arent valid at the start of planning probably wont be valid at the end of planning
    // this may be a fallacy but i dont really care LMAO
    const pursuableGoals = this.goals.filter((value) => {
      return value.isValid(state)
    })

    // build the graph, and see if it found a solution
    const [success, leaves] = this.build(this.actions, pursuableGoals, {
      runningCost: 0,
      runningState: state
    }) as [boolean, Node[]] // typing nonsense, but works :shrug:

    if (!success) {
      // no way to meet any goals, oh well
      return []
    }

    let cheapestLeaf: Node | undefined = undefined
    for (const node of leaves) {
      if (!cheapestLeaf) {
        cheapestLeaf = node
        continue
      }
      if (node.runningCost < cheapestLeaf.runningCost) {
        cheapestLeaf = node
      }
    }

    const out: Action[] = []
    let node = cheapestLeaf

    while (node !== undefined) {
      if (node.currentAction) {
        out.unshift(node.currentAction)
      }
      node = node.parent
    }

    return out
  }

  /**
   * Build an Action graph, with one path being the cheapest.
   *
   * @param actions An array of possible actions that the AI could take.
   * @param goals
   * @param parent
   * @param leaves
   */
  private build(
    actions: Action[],
    goals: Goal[],
    parent: Node,
    leaves?: Node[]
  ): boolean | [boolean, Node[]] {
    const flag = leaves === undefined
    leaves = leaves || []

    let found = false

    // loop through all possible actions, testing to see if this given action will meet any goal.
    for (const action of actions) {
      if (action.isValid(parent.runningState)) {
        // okay! this action can be done
        const currentState = action.populate(parent.runningState)
        const node = {
          parent: parent,
          runningCost: parent.runningCost + action.getCost(),
          runningState: currentState,
          currentAction: action
        }

        // meets ANY goal
        // TODO: allow weighted goals, some are preferred over others
        const meetsGoal = goals.some((value) => {
          return value.reachedGoal(currentState)
        })

        // if it meets literally ANY goal, we are good to go
        // possibly could subtract goal weight from runningCost
        if (meetsGoal) {
          leaves.push(node)
          found = true
        } else {
          const subset = actions.filter((value) => {
            return action !== value
          })
          found = found || (this.build(subset, goals, node, leaves) as boolean)
        }
      }
    }

    if (flag) {
      return [found, leaves]
    }
    return found
  }

  addAction(action: Action): void {
    this.actions.push(action)
  }

  addGoal(goal: Goal): void {
    this.goals.push(goal)
  }
}

/**
 * A humanoid that can plan and do those plans accordingly.
 */
export abstract class Actor {
  private planner: Planner = new Planner()

  private stack: StateMachine = new StateMachine(this)
  private currentPlan: Action[] | undefined

  protected constructor() {
    this.stack.push(this.idle)
  }

  /**
   * Idle state for the FSM
   */
  idle(): void {
    const plan = this.planner.plan(this.getState())

    if (plan) {
      this.currentPlan = plan

      this.stack.pop()
      this.stack.push(this.perform)
    } else {
      this.failedPlan()
      this.stack.pop()
      this.stack.push(this.idle)
    }
  }

  /**
   * Perform action state for the FSM
   */
  perform(): void {
    if (!this.currentPlan) {
      this.stack.pop()
      this.stack.push(this.idle)
      return
    }

    if (this.currentPlan?.length === 0) {
      this.stack.pop()
      this.stack.push(this.idle)
      return
    }

    let action = this.currentPlan[this.currentPlan.length - 1]

    if (action.isDone()) {
      this.currentPlan.pop()
    }

    if (this.currentPlan.length > 0) {
      action = this.currentPlan[this.currentPlan.length - 1]

      const success = action.perform(this)

      if (!success) {
        this.stack.pop()
        this.stack.push(this.idle)
      }
    } else {
      this.stack.pop()
      this.stack.push(this.idle)
    }
  }

  /**
   * Runs the AI, including the current FSM state.
   */
  update(): void {
    this.stack.update()
  }

  addAction(action: Action): void {
    this.planner.addAction(action)
  }

  addGoal(goal: Goal): void {
    this.planner.addGoal(goal)
  }

  /**
   * Called when a plan fails, or a plan cannot be formulated.
   */
  failedPlan(): void {
    // nothing, probably would only use this for debugging
  }

  /**
   * Creates a WorldState with variables outside of the Actor.
   */
  abstract getState(): WorldState
}
