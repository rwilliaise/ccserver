import { DEFAULT_PORT } from '../shared/constants'
import { ARGS } from './args'
import { Client } from './client'

const serverUrl = ARGS[0] ?? `ws://localhost:${DEFAULT_PORT}`

print('Attempting startup...')

const client = new Client()
client.start(serverUrl)
