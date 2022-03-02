/** @noSelfInFile */

import { JsonObject } from '../shared/packet'

/**
 * Glue to unmuddle some of the return types of http.websocket
 * @param url Url to subscribe to
 * @param headers Connection headers
 */
export function createSocket (url: string, headers: http.Headers): lWebSocket
export function receiveSocket (socket: lWebSocket, timeout?: number): LuaMultiReturn<[string | undefined, boolean]>
export function deserializeJson (str: string): LuaMultiReturn<[JsonObject | undefined, string]>
