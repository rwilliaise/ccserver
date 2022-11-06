import { DEFAULT_PORT } from '../shared/constants'
import * as readline from 'node:readline/promises'
import { ServerState } from 'server'

async function runCommands (): Promise<void> {
  const read = readline.createInterface({
    output: process.stdout,
    input: process.stdin,
    prompt: '> '
  })

  read.prompt()
  for await (const line of read) {
    const trim = line.trim()

    if (trim.toLowerCase() === 'exit') {
      break
    }
    read.prompt()
  }

  read.close()
}

export async function start (port = DEFAULT_PORT): Promise<void> {
  const state = new ServerState()

  await Promise.any([
    runCommands()
  ])

  console.log('Shutting down!')
}
