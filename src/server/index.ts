import { DEFAULT_PORT } from '../shared/constants'
import { Server } from './server'

export function start (port = DEFAULT_PORT): void {
  const server = new Server()
  server.start(port)
}
