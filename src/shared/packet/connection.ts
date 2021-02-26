import { PROTOCOL_VERSION } from "../utils";
import { Packet, PacketHandler } from "./base";

export class PacketConnect extends Packet {

  /**
   * Called from client-side for this specific packet.
   */
  write(handler: PacketHandler): any {
    return handler.getConnectionCheck();
  }
  
  process(data: any, handler: PacketHandler): void {
    handler.handleConnection(data);
  }
}

export const CONNECT_PACKET = new PacketConnect();
Packet.addPacket(0, CONNECT_PACKET);
