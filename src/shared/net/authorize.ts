import { matchSchema } from '../data/util'
import { Packet, PacketId } from './packet'
import { SidedState } from '../data/state'

interface AuthorizePacketData {
  auth: string
}

export class S2CAuthorizePacket extends Packet {
  override requiresAuth = false

  packetId = PacketId.AUTHORIZE

  receive (obj: object, state?: SidedState | undefined): void {
    if (state?.isClient ?? false) { return }
    if (!matchSchema<AuthorizePacketData>(obj, { auth: 'auth code' })) {
      throw new Error('Received malformed packet, does not have authorization code')
    }
    if (state?.turtle?.auth !== undefined) {
      state.turtle.auth = obj.auth
    }
  }
}
