
export class Vec3 {
  static ZERO = new Vec3()

  constructor (public x = 0, public y = 0, public z = 0) {}

  /* eslint-disable-next-line @typescript-eslint/no-invalid-void-type */
  __eq!: (this: void, a: Vec3, b: Vec3) => boolean
}

Vec3.prototype.__eq = (a, b) => a.x === b.x && a.y === b.y && a.z === b.z

export class Vec2 {
  static ZERO = new Vec2()

  constructor (public x = 0, public y = 0) {}

  /* eslint-disable-next-line @typescript-eslint/no-invalid-void-type */
  __eq!: (this: void, a: Vec2, b: Vec2) => boolean
}

Vec2.prototype.__eq = (a, b) => a.x === b.x && a.y === b.y
