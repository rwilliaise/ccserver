import { PROTOCOL_VERSION } from "./utils";
import { Packet, PacketHandler } from "./base";

export class PacketConnect extends Packet {

  write(handler: PacketHandler, errorCode?: number, errorMessage?: string): any {
    return handler.writeConnectionCheck(errorCode, errorMessage);
  }

  process(data: any, handler: PacketHandler): void {
    handler.handleConnection(data);
  }
}

export const CONNECT_PACKET = new PacketConnect();
Packet.addPacket(0, CONNECT_PACKET);
