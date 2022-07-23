import { IncomingMessage } from 'http'
import * as readline from 'readline'
import WebSocket from 'ws'
import { DEFAULT_PORT } from '../shared/constants'
import { GlobalState, SidedState } from '../shared/data/state'
import { Networker } from '../shared/net/networker'
import { run } from './command'
import { TurtleClient } from './net/client'

import names from './names.json'
import { Packet, PacketId } from '../shared/net/packet'

export class Server extends Networker implements GlobalState {
  currentId = 0
  knownTurtles = []
  claims = []
  socket!: WebSocket.Server

  locked = false
  interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\n> '
  })

  private readonly clients = new Map<WebSocket, TurtleClient>()

  start (port = DEFAULT_PORT): void {
    this.socket = new WebSocket.Server({ port })
    this.socket.on('connection', this.open)

    this.interface.on('line', this.readLine)
    this.interface.prompt()
  }

  generateTurtleId (): string {
    return names.names[Math.round(Math.random() * names.names.length)]
  }

  receive (client: TurtleClient, data: string): void {
    this.process(JSON.parse(data), this.assembleState(client))
  }

  send (turtle: TurtleClient, id: PacketId, data: any): void {
    if (!this.packetRegistry.has(id)) {
      throw new Error(`Received non-registered packet, id ${id}`)
    }

    const packet = this.packetRegistry.get(id) as Packet
    const ser = packet.send(data, this.assembleState(turtle))

    turtle.socket.send(JSON.stringify(ser))
  }

  save (): void {

  }

  private load (): void {

  }

  private open (socket: WebSocket, request: IncomingMessage): void {
    if (this.locked) {
      socket.close(403, 'Forbidden')
    }

    this.clients.set(socket, new TurtleClient(socket, this, request))
  }

  private readLine (line: string): void {
    run(line.split(' '))
    this.interface.prompt()
  }

  private assembleState (turtle?: TurtleClient): SidedState {
    return { global: this, isClient: false, turtle }
  }
}
