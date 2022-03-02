import { JsonObject, Processor, Wrap, WrapId } from '../shared/packet'
import { Headers, PROTOCOL_VERSION } from '../shared/constants'
import { OldVersion} from '../shared/wrap'
import WebSocket from 'ws'

function getTime (out: any[]): string {
  const date = new Date()
  const hours = date.getHours().toString().padStart(2, '0')
  const mins = date.getMinutes().toString().padStart(2, '0')
  const secs = date.getSeconds().toString().padStart(2, '0')
  return `[${hours}:${mins}:${secs}] ${out.map(String).join(' ')}`
}

export class Server extends Processor {
  server!: WebSocket.Server

  start (port: number): void {
    this.server = new WebSocket.Server({
      port: port
    })

    this.server.on('connection', (socket, message) => {
      if (message.headers[Headers.PROTOCOL_VERSION] !== String(PROTOCOL_VERSION)) {
        this.send(socket, new OldVersion())
        socket.close()
        return
      }

      this.log(`${message.headers[Headers.NAMED] as string ?? 'unknown client'} has connected!`)
      socket.on('close', () => {
        this.log(`${message.headers[Headers.NAMED] as string ?? 'unknown client'} disconnected`)
      })

      socket.on('message', (data) => {
        this.receive(data.toString())
      })
    })

    this.server.on('listening', () => {
      this.log('Server started!')
    })
  }

  send (socket: WebSocket, wrap: Wrap): void {
    socket.send(this.wrap(wrap))
  }

  serialize (json: JsonObject): string {
    return JSON.stringify(json)
  }

  deserialize (json: string): [JsonObject | undefined, string] {
    let parsed
    try {
      parsed = JSON.parse(json)
    } catch (e) {
      return [undefined, String(e)]
    }
    return [parsed, '']
  }
  
  log (...data: any[]): void {
    console.log(getTime(data))
  }

  error (...data: any[]): void {
    console.error(getTime(data))
  }

  exit (...data: any[]): never {
    console.log(getTime(data))
    process.exit(1)
  }

  fromWrapId (wrapId: WrapId, data: JsonObject): Wrap {
    throw new Error('Method not implemented.')
  }
}
