import { SidedState } from '../../shared/data/state'
import { PacketId } from '../../shared/net/packet'
import { ClientPacket } from './packet'

export class S2CSavePacket extends ClientPacket {
  packetId = PacketId.SAVE

  receive (_obj: object, _state?: SidedState | undefined): void {
    this.owner.save()
  }
}
