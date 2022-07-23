import { IncomingMessage } from 'http'
import * as readline from 'readline'
import WebSocket from 'ws'
import { DEFAULT_PORT } from '../shared/constants'
import { GlobalState, SidedState } from '../shared/data/state'
import { Networker } from '../shared/net/networker'
import { Command, run } from './command'
import { TurtleClient } from './net/client'
import names from './names.json'
import { Packet, PacketId } from '../shared/net/packet'
import { EmptyPacket } from '../shared/net/empty'
import { SaveCommand } from './command/save'

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

  override registerPackets (): void {
    super.registerPackets()
    this.packetRegistry.set(PacketId.SAVE, new EmptyPacket())
  }

  start (port = DEFAULT_PORT): void {
    this.socket = new WebSocket.Server({ port })
    this.socket.on('connection', (socket, request) => this.open(socket, request))

    this.interface.on('line', (line) => this.readLine(line))
    this.interface.prompt()
  }

  registerCommands (): void {
    Command.register('save', new SaveCommand(this))
  }

  generateTurtleId (turtle: TurtleClient): string {
    return `${names.names[Math.round(Math.random() * names.names.length)] as string}-${turtle.id}`
  }

  receive (client: TurtleClient, data: string): void {
    try {
      this.process(JSON.parse(data), this.assembleState(client))
    } catch (e) {
      console.error(e)
    }
  }

  send (turtle: TurtleClient, id: PacketId, data: any): void {
    if (!this.packetRegistry.has(id)) {
      throw new Error(`Received non-registered packet, id ${id}`)
    }

    const packet = this.packetRegistry.get(id) as Packet
    const ser = packet.send(data, this.assembleState(turtle))

    turtle.socket.send(JSON.stringify(ser))
  }

  broadcast (id: PacketId, data: any): void {
    this.clients.forEach((client) => {
      this.send(client, id, data)
    })
  }

  save (): void {
    this.broadcast(PacketId.SAVE, {})
  }

  allocateId (): number {
    return this.currentId++
  }

  disconnect (socket: WebSocket): boolean {
    return this.clients.delete(socket)
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
    try {
      run(line.split(' '))
    } catch (e) {
      console.error(e)
    }
    this.interface.prompt()
  }

  private assembleState (turtle?: TurtleClient): SidedState {
    return { global: this, isClient: false, turtle }
  }
}
