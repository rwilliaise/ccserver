import { JsonObject, Processor, Wrap, WrapId } from '../packet'

export class Name extends Wrap {
  override wrapId: WrapId = WrapId.NAMED

  constructor (public readonly name: string) {
    super()
  }

  override receive (processor: Processor): void {
  }

  wrap (): JsonObject {
    return { name: this.name }
  }
}
