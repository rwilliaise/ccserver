import WebSocket from 'ws'

export class NetHandler {
  handleConnection(data: any, client?: WebSocket): void { }
  sendConnectionCheck(): void { }
}

export type PacketConstructor = { new(...args: any[]): Packet };

export class Packet {
  static packetMap: Map<number, PacketConstructor> = new Map()

  constructor(public readonly id: number) {

  }

  processPacket(handler: NetHandler): void {
    throw new Error('Method not implemented!')
  }

  readPacketData(buffer: Buffer): void {
    throw new Error('Method not implemented!')
  }

  writePacketData(buffer: Buffer): void {
    throw new Error('Method not implemented!')
  }

  getPacketSize(): number {
    throw new Error('Method not implemented!')
  }

  static addPacket<T extends Packet>(id: number, packet: PacketConstructor): void {
    this.packetMap.set(id, (class extends packet {
      id = id
    }))
  }

  static getPacket(id: number): PacketConstructor | undefined {
    return this.packetMap.get(id)
  }
}
