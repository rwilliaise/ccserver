export class PacketHandler {

  handleConnection(data: any): void {}
  sendConnectionCheck(): void {}
  getConnectionCheck(): any {}
}

export abstract class Packet {

  static packetMap: Map<number, Packet> = new Map();

  private id!: number;

  abstract process(data: any, handler: PacketHandler): void;
  abstract write(handler: PacketHandler, ...args: any[]): any;

  getData(handler: PacketHandler, ...args: any[]) {
    const out = this.write(handler, args);
    out.id = this.id;
    return out;
  }

  static addPacket(id: number, packet: Packet): void {
    packet.id = id;
    this.packetMap.set(id, packet);
  }

  static getPacket(id: number): Packet | undefined {
    return this.packetMap.get(id);
  }
}