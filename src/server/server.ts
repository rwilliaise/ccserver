import { DEFAULT_PORT, PROTOCOL_VERSION } from '../shared/constants'
import WebSocket from 'ws'

let server: WebSocket.Server | undefined

export function start (port: number = DEFAULT_PORT): void {
  if (server !== undefined) {
    throw new Error('Invalid state: socket has already started!')
  }
  server = new WebSocket.Server({
    port: port
  })
  server.on('connection', (socket, message) => {
    if (message.headers['protocol-version'] !== String(PROTOCOL_VERSION)) {
      const out = {
        id: 0,
        code: 400,
        reason: 'Old version!'
      }
      socket.send(JSON.stringify(out))
      socket.close()
      return
    }
    console.log(`${message.headers.named as string ?? 'unknown client'} has connected!`)
    socket.on('close', () => {
      console.log(`${message.headers.named as string ?? 'unknown client'} disconnected`)
    })
  })
  server.on('listening', () => {
    console.log('Server started!')
  })
}
