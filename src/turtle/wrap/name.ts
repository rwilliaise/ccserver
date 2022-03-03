import { Name } from '../../shared/wrap'
import { Client } from '../client'

export class ClientName extends Name {
  override receive (_: Client): void {
    os.setComputerLabel(this.name)
  }
}
