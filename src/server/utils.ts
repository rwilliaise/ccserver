export class BlockPos {
  x = 0
  y = 0
  z = 0

  public constructor(x?: number, y?: number, z?: number) {
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0
  }

  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  /**
   * Get the distance between this BlockPos and `other`.
   * @param other Other BlockPos to get the distance to.
   */
  distance(other: BlockPos): number {
    return other.sub(this).magnitude
  }

  sub(other: BlockPos): BlockPos {
    return new BlockPos(this.x - other.x, this.y - other.y, this.z - other.z)
  }

  add(other: BlockPos): BlockPos {
    return new BlockPos(this.x + other.x, this.y + other.y, this.z + other.z)
  }

  toJson(): { x: number; y: number; z: number } {
    return { x: this.x, y: this.y, z: this.z }
  }
}
