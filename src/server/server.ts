import { Packet } from "../shared/base";
import WebSocket from "ws";
import { ServerNetHandler } from "./handler";

export class Server {

  websocket: WebSocket.Server;
  handler: ServerNetHandler = new ServerNetHandler(this);

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
      if (data instanceof Buffer) {
        const id = data.readInt8()
        let packet;
        if (object.id && (packet = Packet.getPacket(object.id))) {
          packet.processPacket(object, this.handler);
        }
      }
    });

    console.log("Client connected!");
  }

  send(client: WebSocket, packet: Packet) {
    let out = Buffer.alloc(packet.getPacketSize())
    out.writeInt8(packet.id)
    packet.writePacketData(out)
    client.send(out.toString, { binary: true }, (err) => {
      if (err) {
        console.log(`Send error! [${err.name}] ${err.message} ${err.stack}`)
      }
    });
  }
}