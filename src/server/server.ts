
import { WebSocket, WebSocketServer } from 'ws'
import fs from 'node:fs/promises'
import { Header, NetError, PROTOCOL_VERSION } from '../shared/constants'
import { TurtleState } from '../shared/state/turtle'

const STATE_FILE = '.ccserver_state'

class ServerTurtleState extends TurtleState {
  elevated = false

  constructor (public ws?: WebSocket) {
    super()
  }
}

interface IServerState {
  turtles: ServerTurtleState[]
  jobPool: string[]

  toSmelt: number[]
  toStore: number[]

  nextId: number
}

export class ServerState implements IServerState {
  turtles = new Array<ServerTurtleState>()
  jobPool = new Array<string>()

  toSmelt = new Array<number>()
  toStore = new Array<number>()

  nextId = 0

  ws: WebSocketServer

  constructor (readonly port: number) {
    this.ws = new WebSocketServer({ port })
  }

  async run (): Promise<void> {
    this.ws.on('connection', (socket, request) => {
      const vers = request.headers[Header.PROTOCOL_VERSION]
      if (vers !== PROTOCOL_VERSION.toString()) {
        const safe: string = (vers?.toString() ?? '(null)')
        console.warn('Client connected with old version: ' + safe)

        socket.send(NetError.OLD_VERSION)
        socket.close(400, NetError.OLD_VERSION)
      }

      const state = new ServerTurtleState(socket)
      this.turtles.push(state)
    })
  }

  async save (): Promise<void> {
    console.log('Saving server state...')

    const clean = Object.assign({}, this)
    clean.ws = null as unknown as WebSocketServer
    clean.turtles = clean.turtles.map((turtle) => {
      const copy = Object.assign({}, turtle)
      copy.ws = undefined
      return copy
    })
    const state: string = JSON.stringify(clean)

    await fs.writeFile(STATE_FILE, state).catch(console.warn)
  }

  async load (): Promise<void> {
    await fs.access(STATE_FILE)

    const state: string = await fs.readFile(STATE_FILE, { encoding: 'utf-8' })
    const clean: IServerState = JSON.parse(state)
    Object.assign(this, clean)

    this.turtles = this.turtles.map((turtle) => {
      const out = new ServerTurtleState()
      return Object.assign(out, turtle)
    })
  }
}
