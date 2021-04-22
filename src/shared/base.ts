import WebSocket from 'ws'

export class NetHandler {
  handleConnection(data: any, client?: WebSocket): void { }
  sendConnectionCheck(): void { }
}

export type PacketConstructor = { new(id: number, ...args: any[]): Packet };

export abstract class Packet {
  static packetMap: Map<number, PacketConstructor> = new Map()

  constructor(public readonly id: number) {

  }

  abstract processPacket(handler: NetHandler): void;

  abstract readPacketData(buffer: Buffer): void;

  abstract writePacketData(buffer: Buffer): void;

  abstract getPacketSize(): number;

  static addPacket<T extends Packet>(id: number, packet: PacketConstructor): void {
    this.packetMap.set(id, packet)
  }

  static getPacket(id: number): PacketConstructor | undefined {
    return this.packetMap.get(id)
  }
}
