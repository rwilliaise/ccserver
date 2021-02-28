import { PacketHandler } from "shared/base";
import { CONNECT_PACKET } from "shared/connection";
import { PROTOCOL_VERSION } from "shared/utils";
import { Client } from "./client";
import { ClientError } from "./utils";

export class ClientPacketHandler extends PacketHandler {

  public constructor(private readonly client: Client) {
    super();
  }

  handleConnection(data: any) {
    if (data.code !== 200) {
      throw new ClientError(`Connection failed! ${data.err || "<NULL>"}`)
    }
    print("Connected!");
  }

  sendConnectionCheck(): void {
    this.client.send(CONNECT_PACKET.getData(this));
  }

  writeConnectionCheck(): any {
    return { protocol: PROTOCOL_VERSION };
  }
}