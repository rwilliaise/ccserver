import { Headers, PROTOCOL_VERSION } from '../shared/constants'
import { Wrap, WrapId, Processor } from '../shared/packet'
import { JsonObject } from '../shared/util'
import { OldVersion } from '../shared/wrap'
import { createSocket, deserializeJson, receiveSocket } from './util'
import { ClientName } from './wrap'

function debugInfo (level = 3): string {
  const info = debug.getinfo(level, 'Sl')
  return `[${os.date('%H:%M:%S')}] [${info?.short_src ?? 'anonymous'}:${info?.currentline ?? '0'}]`
}

export class Client extends Processor {
  stack = []
  socket!: lWebSocket

  generateHeaders (): http.Headers {
    return {
      [Headers.NAMED]: os.getComputerLabel(),
      [Headers.PROTOCOL_VERSION]: tostring(PROTOCOL_VERSION)
    }
  }

  listen (): void {
    const [message, binary] = receiveSocket(this.socket, 60)

    if (message === undefined) {
      this.exit('Timed out')
    }

    if (binary) {
      this.log('Received binary message, ignoring.')
    } else {
      this.receive(message)
    }
  }

  /**
   * Starts a basic event loop, listening to the websocket. Never returns.
   * @param url Url to listen to
   */
  start (url: string): never {
    this.socket = createSocket(url, this.generateHeaders())

    while (true) {
      this.listen()
    }
  }

  override log (...data: any[]): void {
    print(debugInfo(), ...data)
  }

  override error (...data: any[]): void {
    printError(debugInfo(), ...data)
  }

  override exit (...data: any[]): never {
    error([debugInfo()].concat(data).join(' '), 0)
  }

  override fromWrapId (wrapId: WrapId, data: JsonObject): Wrap | undefined {
    switch (wrapId) {
      case WrapId.OLD_VERSION:
        return new OldVersion()
      case WrapId.NAMED:
        return new ClientName(tostring(data.name))
    }
  }

  override isClient (): boolean {
    return true
  }

  override serialize (json: object): string {
    return textutils.serializeJSON(json, false)
  }

  override deserialize (json: string): [JsonObject | undefined, string] {
    const [out, err] = deserializeJson(json)

    if (out === undefined) {
      return [{}, err]
    }

    return [out, '']
  }
}
