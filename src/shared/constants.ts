/**
 * Shared network constants.
 */

export const DEFAULT_PORT = 21515
export const PROTOCOL_VERSION = 0

export enum Header {
  PROTOCOL_VERSION = 'x-protocol-version',
  AUTHORIZATION = 'x-authorization',
  NAMED = 'x-named',
}

export class FatalError extends Error {}
