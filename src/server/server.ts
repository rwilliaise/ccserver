import { JsonObject, Processor, Wrap, WrapId } from '../shared/packet'
import WebSocket from 'ws'
import names from './names.json'
import { ServerWrap } from './wrap'
import { Turtle } from './turtle'

function getTime (out: any[]): string {
  const date = new Date()
  const hours = date.getHours().toString().padStart(2, '0')
  const mins = date.getMinutes().toString().padStart(2, '0')
  const secs = date.getSeconds().toString().padStart(2, '0')
  return `[${hours}:${mins}:${secs}] ${out.map(String).join(' ')}`
}

export class Server extends Processor {
  server!: WebSocket.Server
  turtles = new Set()
  nextCid = 0

  start (port: number): void {
    this.server = new WebSocket.Server({
      port: port
    })

    this.server.on('connection', (socket, message) => {
      const turtle = new Turtle(socket, message, this, this.nextCid++)
      this.turtles.add(turtle)
    })

    this.server.on('listening', () => {
      this.log('Server started!')
    })
  }

  close (turtle: Turtle): boolean {
    return this.turtles.delete(turtle)
  }

  initialize (turtle: Turtle): void {

  }

  receiveServer (turtle: Turtle, data: string): void {
    const [out, error] = this.deserialize(data)

    if (out === undefined) {
      this.error('Malformed json', error)
      return
    }

    if (!this.matchSchema(out, { type: 0, data: {} })) {
      this.error('Invalid packet')
      return
    }

    const packet = out as { type: number, data: JsonObject }
    const processed = this.fromWrapId(packet.type, packet.data)

    if (processed !== undefined) {
      if (processed instanceof ServerWrap) {
        processed.receiveServer(turtle, this)
      } else {
        processed.receive(this)
      }
    }
  }

  chooseName (cid: number): string {
    return `${String(names.names[Math.floor(Math.random() * names.names.length)])}-${cid}`
  }

  override serialize (json: JsonObject): string {
    return JSON.stringify(json)
  }

  override deserialize (json: string): [JsonObject | undefined, string] {
    let parsed
    try {
      parsed = JSON.parse(json)
    } catch (e) {
      return [undefined, String(e)]
    }
    return [parsed, '']
  }

  override log (...data: any[]): void {
    console.log(getTime(data))
  }

  override error (...data: any[]): void {
    console.error(getTime(data))
  }

  override exit (...data: any[]): never {
    console.log(getTime(data))
    process.exit(1)
  }

  override fromWrapId (wrapId: WrapId, data: JsonObject): Wrap | undefined {
    throw new Error('Method not implemented.')
  }
}
