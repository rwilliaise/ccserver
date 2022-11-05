import { IncomingMessage } from 'http'
import WebSocket from 'ws'
import { Header, PROTOCOL_VERSION } from '../../shared/constants'
import { ListenersTable, TurtleState } from '../../shared/data/state'
import { Vec3 } from '../../shared/math/vector'
import { PacketId } from '../../shared/net/packet'
import { QueuedTask } from '../../shared/task/executor'
import { Server } from '../server'

export class TurtleClient implements TurtleState {
  worldPosition?: Vec3
  auth?: string
  equipped = {}
  id = '<unknown>'
  listeners = new ListenersTable()
  taskQueue = []
  registeredTasks = new Map()
  runningTasks = new Set<QueuedTask>()

  connectionAlive = true

  constructor (readonly socket: WebSocket, readonly owner: Server, request: IncomingMessage) {
    socket.on('close', (code, reason) => {
      console.log(`${String(this.id)} has disconnected (${code} ${reason})`)
    })

    if (request.headers[Header.PROTOCOL_VERSION] !== String(PROTOCOL_VERSION)) {
      this.send(PacketId.ERROR, { error: 'Old version' })
      socket.close(400, 'Old version')
      return
    }

    let name = request.headers[Header.NAMED]

    if (typeof name !== 'string') {
      name = owner.generateTurtleId(this)
      this.send(PacketId.UPDATE_TURTLE, { field: 'id', value: name })
    }

    console.log(`${String(this.id)} has connected!`)

    setInterval(() => {
      if (!this.connectionAlive) {
        socket.close(400, 'Timed out')
      }

      this.connectionAlive = false
      socket.ping()

      this.send(PacketId.EMPTY, {}) // just so the timeout doesn't get triggered
    }, 10000)

    socket.on('message', (data) => {
      this.connectionAlive = true
      if (typeof data === 'string') {
        owner.receive(this, data)
      } else {
        console.log('Received invalid data.')
      }
    })

    socket.on('pong', () => {
      this.connectionAlive = true
    })
  }

  send<F extends keyof TurtleState> (id: PacketId.UPDATE_TURTLE, data: { field: F, value: TurtleState[F] }): void
  send (id: Exclude<PacketId, PacketId.UPDATE_TURTLE>, data: any): void
  send (id: PacketId, data: any): void {
    this.owner.send(this, id, data)
  }

  replicate (): void {}
}
