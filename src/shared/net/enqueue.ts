import { SidedState } from '../data/state'
import { matchSchema } from '../data/util'
import { TaskId } from '../task'
import { QueuedTask } from '../task/executor'
import { Packet, PacketId } from './packet'

export class S2CEnqueuePacket extends Packet {
  packetId = PacketId.ENQUEUE

  receive (obj: object, state?: SidedState): void {
    if (state?.isClient ?? false) { return }
    if (!matchSchema<QueuedTask>(obj, { task: TaskId.CRAFT, data: {} })) {
      throw new Error('Malformed packet')
    }

    state?.turtle?.taskQueue.push(obj)
  }
}
