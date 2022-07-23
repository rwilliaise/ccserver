import { Packet } from '../../shared/net/packet'
import { Client } from '../client'

export abstract class ClientPacket extends Packet {
  constructor (public owner: Client) {
    super()
  }
}
