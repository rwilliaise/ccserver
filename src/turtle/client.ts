import { Headers, PROTOCOL_VERSION } from '../shared/constants'
import { Vec3 } from '../shared/math/vector'
import { Networker } from '../shared/net/networker'
import { GlobalState, TurtleState } from '../shared/state'
import { createSocket, deserializeJson, receiveSocket } from './util'

export class Client extends Networker implements TurtleState, GlobalState {
  auth?: string
  worldPosition = new Vec3()

  claims = []

  socket!: lWebSocket

  start (url: string): never {
    this.socket = createSocket(url, this.generateHeaders())

    while (true) {
      const [message, binary] = receiveSocket(this.socket, 60)

      if (message === undefined) {
        throw new Error('Timed out')
      }

      if (!binary) {
        const [obj, msg] = deserializeJson(message)

        if (obj === undefined) {
          printError(`Received malformed JSON: ${msg}`)
        } else {
          try {
            this.process(obj, { turtle: this, global: this })
          } catch (e) {
            printError(e)
          }
        }
      }
    }
  }

  generateHeaders (): http.Headers {
    return {
      [Headers.NAMED]: os.getComputerLabel(),
      [Headers.PROTOCOL_VERSION]: tostring(PROTOCOL_VERSION)
    }
  }
}
