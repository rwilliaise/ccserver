import { matchSchema } from '../data/util'
import { Packet, PacketId, SerializedPacket } from './packet'
import { PacketState } from '../state'
import { AuthorizePacket } from './authorize'

export abstract class Networker {
  packetRegistry = new Map<PacketId, Packet>()

  constructor () {
    this.registerPackets()
  }

  registerPackets (): void {
    this.packetRegistry.set(PacketId.AUTHORIZE, new AuthorizePacket())
  }

  /**
   * Process incoming serialized packet.
   * @param obj Serialized packet
   */
  process (obj: object, state?: PacketState): void {
    if (!matchSchema(obj, { id: 0, data: {} })) {
      throw new Error('Received malformed packet.')
    }

    const ser = obj as SerializedPacket

    if (!this.packetRegistry.has(ser.id)) {
      throw new Error(`Received non-registered packet, id ${ser.id}`)
    }

    this.packetRegistry.get(ser.id)?.receive(ser.data, state)
  }
}
