import { matchSchema } from '../data/util'
import { Packet, PacketId, SerializedPacket } from './packet'
import { SidedState } from '../data/state'
import { Header } from '../constants'

import { S2CAuthorizePacket } from './authorize'
import { S2CErrorPacket } from './error'

export abstract class Networker {
  packetRegistry = new Map<PacketId, Packet>()

  constructor () {
    this.registerPackets()
  }

  registerPackets (): void {
    this.packetRegistry.set(PacketId.AUTHORIZE, new S2CAuthorizePacket())
    this.packetRegistry.set(PacketId.ERROR, new S2CErrorPacket())
  }

  /**
   * Process incoming serialized packet.
   * @param serPacket Serialized packet
   */
  process (serPacket: object, state?: SidedState): void {
    if (!matchSchema<SerializedPacket>(serPacket, { id: 0, headers: {}, data: {} })) {
      throw new Error('Received malformed packet.')
    }

    if (!this.packetRegistry.has(serPacket.id)) {
      throw new Error(`Received non-registered packet, id ${serPacket.id}`)
    }

    const packet = this.packetRegistry.get(serPacket.id) as Packet

    if (!(state?.isClient ?? false) && packet.requiresAuth && (serPacket.headers[Header.AUTHORIZATION] === undefined || serPacket.headers[Header.AUTHORIZATION] !== state?.turtle?.auth)) {
      throw new Error('Request unauthorized.')
    }

    packet.receive(serPacket.data, state)
  }
}
