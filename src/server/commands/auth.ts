import { ServerState } from '../server'

export default function commandAuthenticate (state: ServerState, target: string | undefined): void {
  if (target === undefined) {
    console.error('Usage: auth [TARGET]')
  }
}
