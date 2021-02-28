import { Packet } from "shared/base";
import { ClientPacketHandler } from "./handler";

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
    let [success, err] = (ws as unknown as [lWebSocket | false, string]);
    if (!success) {
      error(`Websocket client failure! ${err || "<NULL>"}`)
    } else {
      this.websocket = success;
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
        const [strData, binary] = data;
        if (binary) {
          print(`Illegal state: got a binary message! ${strData}`)
        } else {
          const [jsonData, err] = textutils.unserializeJSON(strData);
          if (!jsonData) {
            print(`Failed to unserialize JSON! ${err || "<NULL>"}`)
          } else if (jsonData.id) {
            const packet = Packet.getPacket(jsonData.id);
            if (packet) {
              packet.process(jsonData, this.packetHandler);
            }
          } else {
            print("Invalid packet!");
          }
        }
      } else {
        print("Server closed!");
        coroutine.yield();
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
    const out = textutils.serializeJSON(data);
    this.websocket.send(out, false);
  }
}
