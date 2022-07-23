import { Command } from '.'

export class SaveCommand extends Command {
  main (_: string[]): void {
    console.log('Forcefully saving...')
    this.server.save()
  }
}
