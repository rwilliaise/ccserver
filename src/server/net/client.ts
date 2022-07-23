import WebSocket from 'ws'
import { TurtleState } from '../../shared/data/state'
import { Vec3 } from '../../shared/math/vector'

export class TurtleClient implements TurtleState {
  worldPosition?: Vec3
  auth?: string
  name?: string

  constructor (public socket: WebSocket) {}
}
