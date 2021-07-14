#!/usr/bin/env node

import yargs from 'yargs'
import { DEFAULT_PORT } from '../shared/constants'
import { start } from './server'

// eslint-disable-next-line no-void
void yargs
  .usage('Start a ccserver')
  .help('help')
  .alias('h', 'help')
  .describe('help', 'show help info')

  .version()
  .alias('v', 'version')
  .describe('version', 'show version info')

  .command('serve [port]', 'start the server', (yargs) => {
    return yargs
      .positional('port', {
        describe: 'port to bind to',
        alias: 'p',
        default: DEFAULT_PORT
      })
  }, (args) => {
    console.log('Starting server!')
    start(args.port)
  })

  .recommendCommands()
  .strict()
  .wrap(yargs.terminalWidth())

  .fail((str, e: unknown) => {
    process.exitCode = 1
    if (str !== undefined && str !== null) console.log(str)
    if (e !== null && e !== undefined) console.log(e)
  })
  .parse()
