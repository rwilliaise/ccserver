import { Wrap } from '../../shared/packet'
import { Server } from '../server'
import { Turtle } from '../turtle'

export abstract class ServerWrap extends Wrap {
  receive (processor: Server): void {
  }

  abstract receiveServer (turtle: Turtle, server: Server): void
}
