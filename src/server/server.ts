import { Packet } from "shared/base";
import WebSocket from "ws";
import { ServerPacketHandler } from "./handler";

export class Server {

  websocket: WebSocket.Server;

  handler: ServerPacketHandler = new ServerPacketHandler();

  constructor() {
    this.websocket = new WebSocket.Server({ port: 8080 });
  }

  connect() {
    this.websocket.on("connection", (client) => {
      this.clientConnected(client);
    });
  }

  clientConnected(client: WebSocket) {
    client.on("message", (data) => {
      if (typeof data === "string") {
        const object = JSON.parse(data);
        let packet;
        if (object.id && (packet = Packet.getPacket(object.id))) {
          packet.process(object);
        }
      }
    })
  }
}