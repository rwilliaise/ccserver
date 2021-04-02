import { NetHandler } from "../shared/base";
import { PROTOCOL_VERSION } from "../shared/utils";
import { Server } from "./server";
import WebSocket from "ws";
import { CONNECT_PACKET } from "../shared/connection";

export class ServerNetHandler extends NetHandler {

  constructor(private readonly server: Server) {
    super();
  }

  handleConnection(data: any, client?: WebSocket) {
    if (!client) {
      throw new Error("Illegal state!");
    }
    console.log(data);
    if (data.protocol !== PROTOCOL_VERSION) {
      this.server.send(client, CONNECT_PACKET.getData(this, 400, `Invalid protocol version! Your version: ${data.protocol} Server version: ${PROTOCOL_VERSION}`));
      return;
    }
    this.server.send(client, CONNECT_PACKET.getData(this, 200));
  }

  writeConnectionCheck(errorCode?: number, errorMessage?: string) {
    return { code: errorCode, err: errorMessage }
  }
}