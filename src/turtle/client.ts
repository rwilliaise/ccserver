import { ARGS } from 'args'
import { createSocket } from 'util'
import { DEFAULT_PORT, Header, PROTOCOL_VERSION } from 'shared/constants'

export const CONNECTED_URL = ARGS[0] ?? `ws://127.0.0.1:${DEFAULT_PORT}`
export const socket = createSocket(CONNECTED_URL, {
  [Header.PROTOCOL_VERSION]: tostring(PROTOCOL_VERSION)
})

export async function listen (): Promise<void> {
  while (true) {
    const [msg] = socket.receive()
    const [obj, error] = textutils.unserializeJSON(msg)

    if (obj === undefined) {
      print(`WARNING: JSON parse error: ${error}`)
    }
  }
}
