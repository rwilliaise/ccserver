import { Actor, WorldState } from './index'
import WebSocket from 'ws'
import { Peripheral, sendDetection } from '../protocol'
import { BlockPos } from '../utils'

export class Turtle extends Actor {
  static clients: Turtle[] = []

  socket: WebSocket
  equipped?: Peripheral
  pos: BlockPos = new BlockPos()

  constructor(socket: WebSocket) {
    super()
    this.socket = socket
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
    out.set('position', this.pos)
    return out
  }
}
