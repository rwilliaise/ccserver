import { Rect } from '../../math/rect'
import { matchSchema } from '../util'
import { deserializeVec2, SerializedVec2, serializeVec2 } from './vec'

export interface SerializedRect {
  start: SerializedVec2
  end: SerializedVec2
}

export function deserializeRect (serData: object): Rect {
  if (!matchSchema<SerializedRect>(serData, { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } })) {
    throw new Error('Malformed serData.')
  }

  return new Rect(deserializeVec2(serData.start), deserializeVec2(serData.end))
}

export function serializeRect (rect: Rect): SerializedRect {
  return { start: serializeVec2(rect.start), end: serializeVec2(rect.end) }
}
