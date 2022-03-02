import { Processor, Wrap, WrapId } from "../packet";

export class OldVersion extends Wrap {
  wrapId: WrapId = WrapId.OLD_VERSION;

  receive(processor: Processor): void {
    processor.error('Old version! Upgrade dist.lua')
  }
}
