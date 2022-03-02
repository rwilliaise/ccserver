import { DEFAULT_PORT } from '../shared/constants'
import { ARGS } from './args'
import { Client } from './client'

/** @noSelf */
export function start (): void {
  const serverUrl = ARGS[0] ?? `ws://localhost:${DEFAULT_PORT}`

  const client = new Client()
  client.log('Starting!')
  client.start(serverUrl)
}

start()
