import { Processor, Wrap, WrapId } from '../packet'

export class OldVersion extends Wrap {
  override wrapId: WrapId = WrapId.OLD_VERSION

  override receive (processor: Processor): void {
    if (!processor.isClient()) { return }
    processor.error('Old version! Upgrade dist.lua')
  }
}
