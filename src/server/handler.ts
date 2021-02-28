import { PacketHandler } from "shared/base";
import { Server } from "./server";

export class ServerPacketHandler extends PacketHandler {

  constructor(private readonly server: Server) {
    super();
  }

  handleConnection() {

  }
}