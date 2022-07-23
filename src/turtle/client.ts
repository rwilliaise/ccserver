import { Header, PROTOCOL_VERSION } from '../shared/constants'
import { Vec3 } from '../shared/math/vector'
import { Networker } from '../shared/net/networker'
import { GlobalState, SidedState, TurtleState } from '../shared/data/state'
import { createSocket, deserializeJson, receiveSocket } from './util'
import { matchSchema } from '../shared/data/util'
import { Packet, PacketId } from '../shared/net/packet'

const SAVE_LOCATION = '/.hive_data'

interface SaveData {
  worldPosition?: Vec3
}

export class Client extends Networker implements TurtleState, GlobalState {
  auth?: string
  worldPosition?: Vec3
  name?: string = os.getComputerLabel()

  knownTurtles = []
  claims = []
  socket!: lWebSocket

  constructor () {
    super()
    this.load()
  }

  /**
   * Checks if the saved world position equals GPS-based coordinates.
   */
  private checkPosition (): void {
    const vec = new Vec3(...gps.locate(3) ?? [])
    if (vec === Vec3.ZERO) {
      return
    }

    if (vec !== this.worldPosition) {
      printError('Failed position check - position changed. Updating position...')

      // this.send(PacketId.UPDATE_TURTLE)
    }
  }

  private load (): void {
    if (!fs.exists(SAVE_LOCATION)) {
      return
    }

    const [handle] = fs.open(SAVE_LOCATION, 'r')
    let data: string | null = null

    if (handle === null || (data = handle.readAll()) === null) {
      return
    }

    const [processed, err] = deserializeJson(data)

    if (processed === undefined) {
      printError(`Failed to load, err: ${err}`)
      return
    }

    if (matchSchema<SaveData>(processed, {})) {
      this.worldPosition = processed.worldPosition
    }
  }

  private save (): void {

  }

  private generateHeaders (): http.Headers {
    return {
      [Header.NAMED]: os.getComputerLabel(),
      [Header.PROTOCOL_VERSION]: tostring(PROTOCOL_VERSION)
    }
  }

  send (id: PacketId, data: object): void {
    if (!this.packetRegistry.has(id)) {
      throw new Error(`Received non-registered packet, id ${id}`)
    }

    const packet = this.packetRegistry.get(id) as Packet
    const ser = packet.send(data, this.assembleState())

    this.socket.send(ser)
  }

  start (url: string): void {
    this.socket = createSocket(url, this.generateHeaders())

    this.checkPosition()

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
            this.process(obj, this.assembleState())
          } catch (e) {
            printError(e)
          }
        }
      }
    }
  }

  assembleState (): SidedState {
    return { turtle: this, isClient: true, global: this }
  }
}
