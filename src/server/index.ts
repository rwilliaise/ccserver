import WebSocket from 'ws'
import { processIdPacket, PROTOCOL_MAP } from './protocol'
import { ipcRenderer } from 'electron'
import { TurtleNetwork } from './network'
import { Turtle } from './ai/turtle'
const server = new WebSocket.Server({ port: 8080 }) // host on local machine

server.on('connection', (client) => {
  let functioningClient: Turtle | null = null

  client.on('message', (msg) => {
    if (typeof msg !== 'string') {
      client.send(JSON.stringify({ code: 400, err: 'Unsupported format!' }))
    }
    const data = JSON.parse(msg as string)
    if (data === undefined || data.id === undefined) {
      console.log('Malformed packet!')
      return
    }
    if (data.id === 0) {
      functioningClient = processIdPacket(client, data)
      return
    }
    const protocol = PROTOCOL_MAP.get(data.id)
    if (protocol === undefined) {
      console.log(`Packet id ${data.id} not found!`)
      return
    }
    if (functioningClient !== null) {
      protocol(functioningClient, data as never)
    }
  })

  client.on('close', () => {
    if (functioningClient && functioningClient.id) {
      TurtleNetwork.removeInventory(functioningClient.id)
    }
    Turtle.clients = Turtle.clients.filter((s) => s.socket !== client)
  })
})

setInterval(() => {
  Turtle.clients.forEach((turtle) => {
    turtle.update()
  })
}, 1000)

ipcRenderer.on('main-update', (event, args) => {
  if (args.type === 'scan') {
    Turtle.clients.forEach((turtle) => {
      turtle.update()
    })
  }
})
