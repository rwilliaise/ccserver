import { SidedState } from '../../data/state'
import { Packet, PacketId } from '../packet'

interface TurtleUpdatePacketData {
  field: string
}

export class TurtleUpdatePacket extends Packet {
  packetId = PacketId.UPDATE_TURTLE

  receive (obj: object, state?: SidedState | undefined): void {
    throw new Error('Method not implemented.')
  }
}
