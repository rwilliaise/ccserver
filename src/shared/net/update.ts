import { deserialize, serialize } from '../data/serde'
import { SidedState, TurtleState } from '../data/state'
import { matchSchema, MultiSpec } from '../data/util'
import { Packet, PacketId, SerializedPacket } from './packet'

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

  override send (data: object, state?: SidedState | undefined): SerializedPacket {
    if (!matchSchema<TurtleUpdatePacketData>(data, { field: 'worldPosition', value: new MultiSpec({}, '', 0) })) {
      throw new Error('Received malformed packet')
    }
    if (typeof data.value !== 'string' && typeof data.value !== 'number') {
      data.value = serialize(data.value)
    }

    return { id: this.packetId, headers: this.generateHeaders(state), data }
  }
}
