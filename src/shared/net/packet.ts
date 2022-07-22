import { PacketState } from '../state'

export enum PacketId {
  AUTHORIZE,
  NAME
}

export interface SerializedPacket {
  id: PacketId
  data: object
}

export abstract class Packet {
  abstract readonly packetId: PacketId
  abstract readonly requiresAuth: boolean

  abstract receive (obj: object, state?: PacketState): void

  send (data: object): SerializedPacket {
    return { id: this.packetId, data }
  }
}
