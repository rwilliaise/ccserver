import { Packet } from 'shared/base'
import { ClientNetHandler } from './handler'

export class Client {
  static client: Client

  websocket: lWebSocket
  listenThread: LuaThread
  packetHandler: ClientNetHandler = new ClientNetHandler(this)

  /**
   * Base constructor
   * @param url URL to open a websocket on
   */
  constructor(public url: string) {
    const ws = http.websocket(url)
    const [success, err] = (ws as unknown as [lWebSocket | false, string])
    if (!success) {
      error(`Websocket client failure! ${err || '<NULL>'}`)
    } else {
      this.websocket = success
    }
    this.listenThread = coroutine.create(() => {
      this.listen()
    })
    this.packetHandler.sendConnectionCheck()
  }

  listen() {
    while (true) {
      const data = this.websocket.receive()
      if (data !== null) {
        const [strData, binary] = data
        if (binary) {
          const buff = Buffer.from(strData)
          const id = buff.readInt8()
          const packet = Packet.getPacket(id)
          if (packet) {
            packet.readPacketData(buff)
            packet.processPacket(this.packetHandler)
          } else {
            print(`Received invalid packet id: ${id}`)
          }
        } else {
          print('Received non-binary input!')
        }
      } else {
        print('Server closed!')
        coroutine.yield()
      }
    }
  }

  /**
   * Start listening to the websocket.
   */
  start() {
    coroutine.resume(this.listenThread)
  }

  send(packet: Packet) {
    const buff = Buffer.alloc(packet.getPacketSize())
    buff.writeInt8(packet.id)
    packet.writePacketData(buff)
    this.websocket.send(buff.toString(), true)
  }
}
