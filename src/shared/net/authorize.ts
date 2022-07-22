import { matchSchema } from '../data/util'
import { Packet, PacketId } from './packet'
import { PacketState } from '../state'

interface AuthorizationData {
  auth: string
}

export class AuthorizePacket extends Packet {
  requiresAuth = false
  packetId = PacketId.AUTHORIZE

  receive (obj: object, state?: PacketState | undefined): void {
    if (!matchSchema(obj, { auth: 'auth code' })) {
      throw new Error('Received malformed packet, does not have authorization code')
    }
    if (state?.turtle?.auth !== undefined) {
      state.turtle.auth = (obj as AuthorizationData).auth
    }
  }
}
