/**
 * Cleanly serialize and deserialize frequently passed class types.
 */

import { Rect } from '../../math/rect'
import { Vec2, Vec3 } from '../../math/vector'
import { matchSchema } from '../util'
import { deserializeRect, serializeRect } from './rect'
import { deserializeVec2, deserializeVec3, SerializedVec3, serializeVec2, serializeVec3 } from './vec'

export * from './vec'

export enum SerializedId {
  UNDEFINED,
  VEC3,
  VEC2,
  RECT
}

export type Serializable = Vec3 | Vec2 | Rect | undefined
export type Serialized = SerializedVec3

interface SerializedObject {
  __serId: SerializedId
}

export function checkSerialized (obj: object): obj is SerializedObject {
  return matchSchema<SerializedObject>(obj, { __serId: SerializedId.VEC3 })
}

export function deserialize (serData: object): Serializable {
  if (!checkSerialized(serData)) {
    throw new Error('serData did not have serId.')
  }

  switch (serData.__serId) {
    case SerializedId.VEC3:
      return deserializeVec3(serData)
    case SerializedId.VEC2:
      return deserializeVec2(serData)
    case SerializedId.RECT:
      return deserializeRect(serData)
    case SerializedId.UNDEFINED:
      return undefined
  }
}

export function serialize (deData: Serializable): SerializedObject {
  if (deData instanceof Vec3) {
    return Object.assign(serializeVec3(deData), { __serId: SerializedId.VEC3 }) as SerializedObject
  } else if (deData instanceof Vec2) {
    return Object.assign(serializeVec2(deData), { __serId: SerializedId.VEC2 }) as SerializedObject
  } else if (deData instanceof Rect) {
    return Object.assign(serializeRect(deData), { __serId: SerializedId.RECT }) as SerializedObject
  }

  return { __serId: SerializedId.UNDEFINED }
}
