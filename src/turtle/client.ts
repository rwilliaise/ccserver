import { Packet } from "shared/packet";
import { ClientPacketHandler } from "./connection";

export class Client {

  websocket: lWebSocket;
  listenThread: LuaThread;

  packetHandler: ClientPacketHandler = new ClientPacketHandler(this);

  /**
   * Base constructor
   * @param url URL to open a websocket on
   */
  constructor(public url: string) {
    let ws = http.websocket(url)
    if (Array.isArray(ws)) {
      let [, err] = ws; // holy moly you can omit elements in a destructor
      error(`Websocket client failure! ${err}`)
    } else {
      this.websocket = ws;
    }
    this.listenThread = coroutine.create(() => {
      this.listen();
    });
    this.packetHandler.sendConnectionCheck();
  }

  listen() {
    while (true) {
      const data = this.websocket.receive();
      if (data) {
        const [strData] = data;
        const [jsonData, err] = textutils.unserializeJSON(strData);
        if (!jsonData) {
          print(`Failed to unserialize JSON! ${err}`)
        } else if (jsonData.id) {
          const packet = Packet.getPacket(jsonData.id);
          if (packet) {
            packet.process(jsonData, this.packetHandler);
          }
        } else {
          print("Invalid packet!")
        }
      }
    }
  }

  /**
   * Start listening to the websocket.
   */
  start() {
    coroutine.resume(this.listenThread);
  }

  send(data: any) {
    this.websocket.send(data, false);
  }
}
