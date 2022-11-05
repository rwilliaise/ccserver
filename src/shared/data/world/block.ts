
export type Property = string | boolean | number

export class BlockState {
  state = new Map<string, Property>()

  constructor (public blockId: string) {}
}
