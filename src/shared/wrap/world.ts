import { Processor, Wrap, WrapId } from '../packet'

export class WorldUpdate extends Wrap {
  wrapId = WrapId.WORLD_UPDATE

  override receive (processor: Processor): void {

  }

  process (processor: Processor): void {
  }
}
