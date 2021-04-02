import { PROTOCOL_VERSION } from './utils'
import { Packet, NetHandler } from './base'

export class PacketConnect extends Packet {
  protocolVersion!: number

  processPacket (handler: NetHandler): void {
    throw new Error('Method not implemented.')
  }

  writePacketData (buffer: Buffer): void {
    throw new Error('Method not implemented.')
  }

  readPacketData (buffer: Buffer): void {
    buffer.readInt16BE()
  }

  getPacketSize (): number {
    throw new Error('Method not implemented.')
  }
}

export const CONNECT_PACKET = new PacketConnect()
Packet.addPacket(0, CONNECT_PACKET)
