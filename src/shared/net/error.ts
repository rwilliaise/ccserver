import { FatalError } from '../constants'
import { SidedState } from '../data/state'
import { matchSchema, MultiSpec } from '../data/util'
import { Packet, PacketId } from './packet'

interface ErrorPacketData {
  error: string
}

export class S2CErrorPacket extends Packet {
  packetId = PacketId.ERROR
  receive (obj: object, state?: SidedState | undefined): void {
    if (state?.isClient ?? false) { return } // client shouldn't be able to fatal error server
    if (!matchSchema<ErrorPacketData>(obj, { error: new MultiSpec('', undefined) })) {
      throw new Error('Malformed packet.')
    }

    throw new FatalError(obj.error)
  }
}
