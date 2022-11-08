import { DEFAULT_PORT } from '../shared/constants'
import * as readline from 'node:readline/promises'
import { ServerState } from './server'

async function runCommands (state: ServerState): Promise<void> {
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

    const argv = trim.split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/g)

    read.prompt()
  }

  read.close()
}

export async function start (port = DEFAULT_PORT): Promise<void> {
  const state = new ServerState(port)
  await state.load()

  await Promise.any([
    runCommands(state)
  ])

  await state.save()

  console.log('Shutting down!')
  process.exit()
}
