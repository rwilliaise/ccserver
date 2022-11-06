import { Vec2, Vec3 } from '../../math/vector'
import { matchSchema } from '../util'

export interface SerializedVec3 {
  x: number
  y: number
  z: number
}

export function deserializeVec3 (serData?: object): Vec3 | undefined {
  if (serData === undefined) { return }
  if (!matchSchema<SerializedVec3>(serData, { x: 0, y: 0, z: 0 })) {
    throw new Error('Malformed serData.')
  }

  return new Vec3(serData.x, serData.y, serData.z)
}

export function serializeVec3 (vec3: Vec3): SerializedVec3 {
  return { x: vec3.x, y: vec3.y, z: vec3.z }
}

export interface SerializedVec2 {
  x: number
  y: number
}

export function deserializeVec2 (serData?: object): Vec2 | undefined {
  if (serData === undefined) { return }
  if (!matchSchema<SerializedVec2>(serData, { x: 0, y: 0 })) {
    throw new Error('Malformed serData.')
  }

  return new Vec2(serData.x, serData.y)
}

export function serializeVec2 (vec2: Vec2): SerializedVec2 {
  return { x: vec2.x, y: vec2.y }
}
