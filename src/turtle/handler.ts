import { PacketHandler } from "shared/base";
import { CONNECT_PACKET } from "shared/connection";
import { PROTOCOL_VERSION } from "shared/utils";
import { Client } from "./client";

export class ClientPacketHandler extends PacketHandler {

  private readonly client: Client;

  public constructor(client: Client) {
    super();
    this.client = client;
  }

  sendConnectionCheck(): void {
    this.client.send(CONNECT_PACKET.getData(this));
  }

  getConnectionCheck(): any {
    return { protocol: PROTOCOL_VERSION };
  }
}