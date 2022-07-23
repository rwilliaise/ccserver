import { IncomingMessage } from 'http'
import WebSocket from 'ws'
import { Header, PROTOCOL_VERSION } from '../../shared/constants'
import { TurtleState } from '../../shared/data/state'
import { Vec3 } from '../../shared/math/vector'
import { PacketId } from '../../shared/net/packet'
import { Server } from '../server'

export class TurtleClient implements TurtleState {
  worldPosition?: Vec3
  auth?: string
  name?: string
  equipped = {}

  connectionAlive = true

  constructor (readonly socket: WebSocket, readonly owner: Server, request: IncomingMessage) {
    socket.on('close', (code, reason) => {
      console.log(`${String(this.name)} has disconnected (${code} ${reason})`)
    })

    if (request.headers[Header.PROTOCOL_VERSION] !== String(PROTOCOL_VERSION)) {
      this.send(PacketId.ERROR, { error: 'Old version' })
      socket.close(400, 'Old version')
      return
    }

    let name = request.headers[Header.NAMED]

    if (typeof name !== 'string') {
      name = owner.generateTurtleId()
      this.send(PacketId.UPDATE_TURTLE, { field: 'name', value: name })
      this.name = name
    }

    console.log(`${String(this.name)} has connected!`)

    setInterval(() => {
      if (!this.connectionAlive) {
        socket.close(400, 'Timed out')
      }

      this.connectionAlive = false
      socket.ping()

      this.send(PacketId.EMPTY, {})
    }, 10000)

    socket.on('message', (data) => {
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

  send (id: PacketId, data: any): void {
    this.owner.send(this, id, data)
  }
}
