import { DEFAULT_PORT } from '../shared/constants'
import { Server } from './server'

export function start (port: number = DEFAULT_PORT): void {
  const server = new Server()
  server.start(port)
}
