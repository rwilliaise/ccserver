import WebSocket from "ws";

export class Server {

  websocket: WebSocket.Server;

  constructor() {
    this.websocket = new WebSocket.Server({ port: 8080 });
  }

  connect() {
    this.websocket.on("connection", (client) => {
      this.clientConnected(client);
    });
  }

  clientConnected(client: WebSocket) {
    
  }
}