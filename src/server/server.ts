import { Packet } from "../shared/base";
import WebSocket from "ws";
import { ServerPacketHandler } from "./handler";

export class Server {

  websocket: WebSocket.Server;
  handler: ServerPacketHandler = new ServerPacketHandler(this);

  constructor() {
    this.websocket = new WebSocket.Server({ port: 8080 });
  }

  connect() {
    this.websocket.on("connection", (client) => {
      this.clientConnected(client);
    });

    console.log("Started!");
  }

  clientConnected(client: WebSocket) {
    client.on("message", (data) => {
      if (typeof data === "string") {
        const object = JSON.parse(data);
        let packet;
        if (object.id && (packet = Packet.getPacket(object.id))) {
          packet.process(object, this.handler);
        }
      }
    });

    console.log("Client connected!");
  }

  send(client: WebSocket, data: any) {
    client.send(JSON.stringify(data), (err) => {
      if (err) {
        console.log(`Send error! [${err.name}] ${err.message} ${err.stack}`)
      }
    });
  }
}