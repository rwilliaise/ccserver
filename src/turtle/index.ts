import { DEFAULT_PORT } from '../shared/constants'
import { ARGS } from './args'

const serverUrl = ARGS[0] ?? `ws://localhost:${DEFAULT_PORT}`
