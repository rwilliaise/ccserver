import { deserialize } from '../data/serde'
import { SidedState, TurtleState } from '../data/state'
import { matchSchema, MultiSpec } from '../data/util'
import { Packet, PacketId } from './packet'

interface TurtleUpdatePacketData {
  field: keyof TurtleState
  value: any
}

export class TurtleUpdatePacket extends Packet {
  packetId = PacketId.UPDATE_TURTLE

  override requiresAuth = true

  receive (obj: object, state?: SidedState | undefined): void {
    if (!matchSchema<TurtleUpdatePacketData>(obj, { field: 'worldPosition', value: new MultiSpec({}, '', 0) })) {
      throw new Error('Received malformed packet')
    }

    if (state?.turtle !== undefined) {
      if (typeof obj.value !== 'string' && typeof obj.value !== 'number') {
        /* @ts-expect-error */
        state.turtle[obj.field] = deserialize(obj.value)
      } else {
        /* @ts-expect-error */
        state.turtle[obj.field] = obj.value
      }
    }
  }
}
