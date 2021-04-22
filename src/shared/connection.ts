import { PROTOCOL_VERSION } from './utils'
import { Packet, NetHandler } from './base'

export class PacketConnect extends Packet {
  protocolVersion!: number

  constructor(id: number, protocolVersion?: number) {
    super(id)
    if (protocolVersion) {
      this.protocolVersion = protocolVersion;
    }
  }

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

Packet.addPacket(0, PacketConnect)
