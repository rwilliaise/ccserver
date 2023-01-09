/** @noSelfInFile */

/**
 * Glue to unmuddle some of the return types of http.websocket
 * @param url Url to subscribe to
 * @param headers Connection headers
 */
export function createSocket (url: string, headers: http.Headers): lWebSocket
