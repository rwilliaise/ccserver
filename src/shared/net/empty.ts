import { SidedState } from '../data/state'
import { Packet, PacketId } from './packet'

export class EmptyPacket extends Packet {
  packetId = PacketId.EMPTY
  predicted = false

  receive (_obj: object, _state?: SidedState | undefined): void {}
}
