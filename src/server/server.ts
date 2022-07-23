import { IncomingMessage } from 'http'
import WebSocket from 'ws'
import { DEFAULT_PORT } from '../shared/constants'
import { GlobalState } from '../shared/data/state'
import { Networker } from '../shared/net/networker'
import { TurtleClient } from './net/client'

export class Server extends Networker implements GlobalState {
  knownTurtles = []
  claims = []
  socket!: WebSocket.Server

  private readonly clients = new Map<WebSocket, TurtleClient>()

  start (port = DEFAULT_PORT): void {
    this.socket = new WebSocket.Server({ port })

    this.socket.on('connection', this.open)
  }

  private readonly open = (socket: WebSocket, request: IncomingMessage): void => {
    this.clients.set(socket, new TurtleClient(socket))
  }
}
