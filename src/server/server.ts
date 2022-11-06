
import { WebSocket, WebSocketServer } from 'ws'
import { Header, NetError, PROTOCOL_VERSION } from '../shared/constants'
import { TurtleState } from '../shared/turtle'

class ServerTurtleState extends TurtleState {
  elevated = false

  constructor (readonly ws: WebSocket) {
    super()
  }
}

export class ServerState {
  ws: WebSocketServer
  turtles = new Set<ServerTurtleState>()

  constructor (readonly port: number) {
    this.ws = new WebSocketServer({ port })
  }

  async run (): Promise<void> {
    this.ws.on('connection', (socket, request) => {
      const vers = request.headers[Header.PROTOCOL_VERSION]
      if (vers !== PROTOCOL_VERSION.toString()) {
        const safe: string = (vers?.toString() ?? '(null)')
        console.log('Client connected with old version: ' + safe)

        socket.send(NetError.OLD_VERSION)
        socket.close(400, NetError.OLD_VERSION)
      }

      const state = new ServerTurtleState(socket)
      this.turtles.add(state)
    })
  }
}
