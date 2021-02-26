
export class Client {

  url: string;
  websocket: lWebSocket;
  listenThread: LuaThread;

  /**
   * Base constructor
   * @param url URL to open a websocket on
   */
  constructor(url: string) {
    this.url = url;
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
  }

  listen() {
    while (true) {
      let data = this.websocket.receive();
      if (data) {
        let [strData] = data;
        let [jsonData, err] = textutils.unserializeJSON(strData);
        if (!jsonData) {
          print(`Failed to unserialize JSON! ${err}`)
        } else {
          
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
}
