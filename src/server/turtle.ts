import * as http from 'http'
import WebSocket from 'ws'
import { Server } from './server'
import { Headers, PROTOCOL_VERSION } from '../shared/constants'
import { Name, OldVersion } from '../shared/wrap'
import { Wrap } from '../shared/packet'

export class Turtle {
  isAlive = true

  constructor (
    readonly ws: WebSocket,
    start: http.IncomingMessage,
    readonly server: Server,
    readonly cid: number
  ) {
    let name = start.headers[Headers.NAMED]
    if (start.headers[Headers.PROTOCOL_VERSION] !== String(PROTOCOL_VERSION)) {
      this.send(new OldVersion())
      ws.close()
      return
    }

    if (name === undefined) {
      name = server.chooseName(cid)
      this.send(new Name(name))
    }

    server.log(`${name as string} has connected!`)

    ws.on('close', () => {
      server.log(`${name as string} disconnected`)
    })

    setInterval(() => {
      if (!this.isAlive) {
        ws.close()
      }

      this.isAlive = false
      ws.ping()
    }, 10000)

    ws.on('pong', () => {
      this.isAlive = true
    })

    ws.on('message', (data) => {
      if (typeof data === 'string') {
        server.receiveServer(this, data)
      } else {
        server.log('Received invalid binary data.')
      }
    })
  }

  send (wrap: Wrap): void {
    this.ws.send(this.server.wrap(wrap))
  }
}
