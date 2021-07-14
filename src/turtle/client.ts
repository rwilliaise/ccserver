/* @noimplicitself */
import { PROTOCOL_VERSION } from '../shared/constants'

export function listen (server: string): void {
  print('Attempting connection!')
  const [socket, err] = http.websocket(server, {
    'protocol-version': tostring(PROTOCOL_VERSION),
    named: os.computerLabel() ?? `#${os.computerID()}`
  }) as unknown as [lWebSocket | false, string | undefined]
  if (socket === false) {
    print(`Could not connect! ${tostring(err)}`)
    return
  }
  print('Successfully connected!')
  while (true) {
    const [event, url, response] = os.pullEvent()
    if (event === 'websocket_message' && url === server && response !== null) {
      const [data] = response
      const [obj, parseErr] = textutils.unserializeJSON(data)
      if (obj === undefined) {
        print(`Failed to parse data! ${tostring(parseErr)}`)
      } else {

      }
    } else if (event === 'websocket_closed' && url === server) {
      print('Server closed!')
    }
  }
}
