import { DEFAULT_PORT } from '../shared/constants'
import { Args } from './args'
import { listen } from './client'

// every 5 seconds, try connecting
const RETRY_RATE = 5

const path = shell.getRunningProgram()
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
const name = (fs as unknown as { getName: (this: void, path: string) => string }).getName(path)

if (Args.length !== 1) { // TODO: || turtle === null
  error(`Usage: ${name} <server>`, 0)
}

if (Args[0] === '-v' || Args[0] === '--version') {
  error(`Client version: 0.1.0
Connectable server version: 0.1.0`)
}

let address = Args[0]

if (string.match(address, '.+:%d+') === undefined) {
  address = `${address}:${DEFAULT_PORT}`
}

if (string.match(address, 'ws://.+') === undefined) {
  address = `ws://${address}`
}

print('Attempting to connect to ' + address)

while (true) {
  listen(address)
  os.sleep(RETRY_RATE)
}
