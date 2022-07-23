/* @noSelfInFile */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
namespace globalThis {

  export namespace textutils {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    export const empty_json_array: object

    export function serialize (t: object, opts?: { compact?: boolean, allow_repetitions?: boolean }): string
    export function unserialize (s: string): object | undefined
  }

  export namespace gps {

    export function locate (timeout = 2, debug = false): LuaMultiReturn<[number, number, number]> | undefined
  }
}
