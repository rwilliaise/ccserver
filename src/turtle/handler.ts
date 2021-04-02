import { NetHandler } from 'shared/base'
import { PacketConnect } from 'shared/connection'
import { PROTOCOL_VERSION } from 'shared/utils'
import { Client } from './client'
import { ClientError } from './utils'

export class ClientNetHandler extends NetHandler {
  public constructor(private readonly client: Client) {
    super()
  }

  handleConnection(data: any) {
    if (data.code !== 200) {
      throw new ClientError(`Connection failed! ${data.err || '<NULL>'}`)
    }
    print('Connected!')
  }

  sendConnectionCheck(): void {
    this.client.send(new PacketConnect())
  }

  writeConnectionCheck(): any {
    return { protocol: PROTOCOL_VERSION }
  }
}
