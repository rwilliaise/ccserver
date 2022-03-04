import { Name } from '../../shared/wrap'
import { Client } from '../client'

export class ClientName extends Name {
  override receive (c: Client): void {
    c.log('setting label to ' + this.name)
    os.setComputerLabel(this.name)
  }
}
