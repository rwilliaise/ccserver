import { Vec3 } from './vec'

export class TurtleState {
  /** left idx 0, right idx 1 */
  equipped: [ string, string ] = ['minecraft:air', 'minecraft:air']
  pos: Vec3 = [0, 0, 0]
}
