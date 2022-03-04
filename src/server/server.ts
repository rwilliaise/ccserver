import { EmptyWrap, JsonObject, Processor, Wrap, WrapId } from '../shared/packet'
import { Headers, PROTOCOL_VERSION } from '../shared/constants'
import { Name, OldVersion } from '../shared/wrap'
import WebSocket from 'ws'
import names from './names.json'

function getTime (out: any[]): string {
  const date = new Date()
  const hours = date.getHours().toString().padStart(2, '0')
  const mins = date.getMinutes().toString().padStart(2, '0')
  const secs = date.getSeconds().toString().padStart(2, '0')
  return `[${hours}:${mins}:${secs}] ${out.map(String).join(' ')}`
}

export class Server extends Processor {
  server!: WebSocket.Server
  nextCid = 0

  start (port: number): void {
    this.server = new WebSocket.Server({
      port: port
    })

    this.server.on('connection', (socket, message) => {
      let name = message.headers[Headers.NAMED]
      if (message.headers[Headers.PROTOCOL_VERSION] !== String(PROTOCOL_VERSION)) {
        this.send(socket, new OldVersion())
        socket.close()
        return
      }

      if (name === undefined) {
        name = this.chooseName()
        this.send(socket, new Name(name))
      }

      this.log(`${name as string} has connected!`)
      socket.on('close', () => {
        this.log(`${name as string} disconnected`)

        // clearInterval(id)
      })

      socket.on('pong', () => {
        
      })

      socket.on('message', (data) => {
        if (typeof data === 'string') {
          this.receive(data)
        } else {
          this.log('Received invalid binary data.')
        }
      })
    })

    this.server.on('listening', () => {
      this.log('Server started!')
    })

    setInterval(() => {
      this.server.clients.forEach((ws) => {
        ws.ping()
      })
    }, 30000)
  }

  chooseName (): string {
    return `${String(names.names[Math.floor(Math.random() * names.names.length)])}-${this.nextCid++}`
  }

  send (socket: WebSocket, wrap: Wrap): void {
    socket.send(this.wrap(wrap))
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
