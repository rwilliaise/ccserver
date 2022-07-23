import { Server } from '../server'

const COMMAND_REGISTRY = new Map<string, Command>()

export abstract class Command {
  constructor (public server: Server) {}

  abstract main (args: string[]): void

  static register (name: string, command: Command): void {
    COMMAND_REGISTRY.set(name, command)
  }
}

export function run (args: string[]): void {
  const name = args[0]

  if (COMMAND_REGISTRY.has(name)) {
    COMMAND_REGISTRY.get(name)?.main(args)
  }

  throw new Error(`Command ${name} not found!`)
}
