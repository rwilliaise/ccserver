import { Action, Actor, Goal, WorldState } from './index'
import WebSocket from 'ws'
import { Peripheral, sendDetection } from '../protocol'
import { BlockPos } from '../utils'
import { TurtleNetwork } from '../network'

/**
 * A goal of each turtle is to create another turtle.
 */
class ReproduceGoal extends Goal {
  isValid(state: WorldState): boolean {
    // 1 child allowed per turtle
    return state.get('children') === 0 && Turtle.clients.length < 15
  }

  reachedGoal(state: WorldState): boolean {
    // we have reached 1 child
    return state.get('children') === 1
  }
}

/**
 * A goal of each turtle is to have enough fuel.
 */
class RefuelGoal extends Goal {
  isValid(state: WorldState): boolean {
    return (
      state.get('needsFuel') !== undefined &&
      (state.get('fuel') as number) <= 200
    )
  }

  reachedGoal(state: WorldState): boolean {
    return (state.get('fuel') as number) > 200
  }
}

class RefuelAction extends Action {
  checkProceduralPreconditions(state: WorldState): boolean {
    const id = state.get('id') as number
    return TurtleNetwork.hasItem(id, 'minecraft:coal')
  }

  getCost(): number {
    return 0
  }

  isDone(): boolean {
    return false
  }

  perform(actor: Actor): boolean {
    return false
  }

  populate(state: WorldState): WorldState {
    return state.set('fuel', (state.get('fuel') as number) + 100)
  }
}

class TakeTaskAction extends Action {
  getCost(): number {
    return 10
  }

  isDone(): boolean {
    return false
  }

  perform(actor: Actor): boolean {
    return false
  }

  populate(state: WorldState): WorldState {
    return state.set('hasTask', true)
  }
}

class MoveAction extends Action {
  public constructor() {
    super()
    this.addPrecondition('hasTarget', true)
  }

  getCost(): number {
    // since the turtle needs to use fuel
    return 100
  }

  isDone(): boolean {
    return false
  }

  perform(actor: Turtle): boolean {
    return false
  }

  populate(state: WorldState): WorldState {
    return state.set('position', state.get('target'))
  }
}

export class Turtle extends Actor {
  static clients: Turtle[] = []

  socket: WebSocket
  equipped?: Peripheral
  pos: BlockPos = new BlockPos()

  fuel = 0
  needsFuel = true
  children = 0
  target?: BlockPos

  constructor(socket: WebSocket) {
    super()
    this.socket = socket
    this.addAction(new MoveAction())
    this.addAction(new RefuelAction())
    this.addGoal(new ReproduceGoal())
    this.addGoal(new RefuelGoal())
  }

  send(data: unknown): void {
    this.socket.send(data)
  }

  update(): void {
    super.update()
    sendDetection(this)
  }

  get id(): number {
    return Turtle.clients.indexOf(this)
  }

  static broadcast(data: unknown): void {
    Turtle.clients.forEach((client) => {
      client.send(data)
    })
  }

  getState(): WorldState {
    const out: WorldState = new Map()
    out.set('world', TurtleNetwork.world)
    out.set('position', this.pos)
    out.set('hasTarget', this.target !== undefined)
    out.set('target', this.target)
    out.set('children', this.children)
    out.set('fuel', this.fuel)
    out.set('needsFuel', this.needsFuel)
    out.set('id', this.id)
    return out
  }
}
