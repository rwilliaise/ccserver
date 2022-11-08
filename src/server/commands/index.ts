import { ServerState } from '../server'
import commandAuthenticate from './auth'

type Command = (state: ServerState, ...args: Array<string | undefined>) => void

export const CommandMap: Record<string, Command> = {
  auth: commandAuthenticate
}
