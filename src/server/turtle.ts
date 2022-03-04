import * as http from "http";
import WebSocket from "ws";

export class Turtle {
  isAlive = false
  
  constructor(readonly ws: WebSocket, start: http.IncomingMessage) {
    ws.on("pong", () => {

    })
  }
}
