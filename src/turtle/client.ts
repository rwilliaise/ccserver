import { FatalError, Header, PROTOCOL_VERSION } from '../shared/constants'
import { Vec3 } from '../shared/math/vector'
import { Networker } from '../shared/net/networker'
import { Equipped, GlobalState, ListenersTable, SidedState, TurtleState } from '../shared/data/state'
import { createSocket, deserializeJson, receiveSocket } from './util'
import { matchSchema } from '../shared/data/util'
import { Packet, PacketId } from '../shared/net/packet'
import { deserializeVec3, SerializedVec3 } from '../shared/data/serde'
import { S2CSavePacket } from './net/save'

const SAVE_LOCATION = '/.hive_data'

interface SaveData {
  worldPosition?: SerializedVec3
  equipped: Equipped
}

export class Client extends Networker implements TurtleState, GlobalState {
  auth?: string
  worldPosition?: Vec3
  name?: string = os.getComputerLabel()
  equipped = {}
  registeredTasks = new Map()

  knownTurtles = []
  claims = []
  taskQueue = []
  socket!: lWebSocket
  id!: number
  listeners = new ListenersTable()

  constructor () {
    super()
    this.load()

    this.listeners.on('name', (_k, _o, n) => { os.setComputerLabel(n) })
  }

  override registerPackets (): void {
    super.registerPackets()
    this.packetRegistry.set(PacketId.SAVE, new S2CSavePacket(this))
  }

  save (): void {

  }

  send<F extends keyof TurtleState> (id: PacketId.UPDATE_TURTLE, data: { field: F, value: TurtleState[F] }): void
  send (id: Exclude<PacketId, PacketId.UPDATE_TURTLE>, data: any): void
  send (id: PacketId, data: any): void {
    if (!this.packetRegistry.has(id)) {
      throw new Error(`Received non-registered packet, id ${id}`)
    }

    const packet = this.packetRegistry.get(id) as Packet
    const ser = packet.send(data, this.assembleState())

    this.socket.send(textutils.serializeJSON(ser))
  }

  start (url: string): void {
    this.socket = createSocket(url, this.generateHeaders())
    this.checkPosition()

    try {
      while (true) {
        const [message, binary] = receiveSocket(this.socket, 15)

        print(message)

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
              if (e instanceof FatalError) {
                throw e
              }

              printError(e)
            }
          }
        }
      }
    } catch (e) {
      printError(e)
    }

    this.save()
  }

  getAvailableTurtles (): TurtleState[] {
    return [this]
  }

  assembleState (): SidedState {
    return { turtle: this, isClient: true, global: this }
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

      this.send(PacketId.UPDATE_TURTLE, { field: 'worldPosition', value: vec })
    }
  }

  /**
   * Loads turtle data from a JSON file at /.hive_data
   */
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

    if (matchSchema<SaveData>(processed, { equipped: {} })) {
      this.worldPosition = deserializeVec3(processed.worldPosition)
      this.equipped = processed.equipped
    }
  }

  private generateHeaders (): http.Headers {
    return {
      [Header.NAMED]: os.getComputerLabel(),
      [Header.PROTOCOL_VERSION]: tostring(PROTOCOL_VERSION)
    }
  }
}
