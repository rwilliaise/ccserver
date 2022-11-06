import { Header } from '../constants'
import { SidedState } from '../data/state'

export enum PacketId {
  EMPTY,
  ERROR,

  AUTHORIZE,
  NAME,

  ENQUEUE,
  UPDATE_TURTLE,
  SAVE
}

type Headers = Record<string, any>

export interface SerializedPacket {
  headers: Headers
  id: PacketId
  data: object
}

export abstract class Packet {
  abstract readonly packetId: PacketId
  readonly requiresAuth: boolean = false
  readonly predicted: boolean = true

  abstract receive (obj: object, state?: SidedState): void

  send (data: object, state?: SidedState): SerializedPacket {
    return { id: this.packetId, headers: this.generateHeaders(state), data }
  }

  protected generateHeaders (state?: SidedState): Headers {
    return {
      [Header.AUTHORIZATION]: state?.turtle?.auth
    }
  }
}
