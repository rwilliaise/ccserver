import { Header } from '../constants'
import { SidedState } from '../data/state'

export enum PacketId {
  AUTHORIZE,
  UPDATE_TURTLE,
  NAME
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

  abstract receive (obj: object, state?: SidedState): void

  send (data: object, state?: SidedState): SerializedPacket {
    return { id: this.packetId, headers: this.generateHeaders(state), data }
  }

  private generateHeaders (state?: SidedState): Headers {
    return {
      [Header.AUTHORIZATION]: state?.turtle?.auth
    }
  }
}
