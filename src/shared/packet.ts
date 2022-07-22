import { JsonObject, matchSchema } from './util'

export enum WrapId {
  OLD_VERSION,
  NAMED,
  EMPTY,
  WORLD_UPDATE,
}

export abstract class Processor {
  abstract serialize (json: JsonObject): string
  abstract deserialize (json: string): [JsonObject | undefined, string]

  abstract log (...data: any[]): void
  abstract error (...data: any[]): void
  abstract exit (...data: any[]): never

  abstract fromWrapId (wrapId: WrapId, data: JsonObject): Wrap | undefined

  isClient (): boolean { return false }

  receive (data: string): void {
    const [out, error] = this.deserialize(data)

    if (out === undefined) {
      this.error('Malformed json', error)
      return
    }

    if (!matchSchema(out, { type: 0, data: {} })) {
      this.error('Invalid packet')
      return
    }

    const packet = out as { type: number, data: JsonObject }
    const processed = this.fromWrapId(packet.type, packet.data)

    if (processed !== undefined) {
      processed.receive(this)
    }
  }

  wrap (wrap: Wrap): string {
    const out = wrap.wrap()
    const packet = { type: wrap.wrapId, data: out }

    return this.serialize(packet)
  }
}

/**
 * A data type that can be wrapped into a json-able object. Interacts with Pro-
 * cessors directly.
 */
export abstract class Wrap {
  abstract readonly wrapId: WrapId

  /**
   * Acts on a processor using data contained within this `Wrap`.
   * @param processor Processor to act on
   */
  abstract receive (processor: Processor): void

  /**
   * Turns the data contained within this packet into a serializable json object.
   */
  wrap (): JsonObject {
    return {}
  }
}
