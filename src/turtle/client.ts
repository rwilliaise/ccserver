
export function listen (server: string): void {
  const [socket, err] = http.websocket(server) as unknown as [lWebSocket | undefined, string | undefined]
  if (socket === undefined) {
    print(`Could not connect! ${tostring(err)}`)
    return
  }
  while (true) {
    const response = socket.receive()
    if (response !== null) {
      const [data] = response
      const [obj, parseErr] = textutils.unserializeJSON(data)
      if (obj === undefined) {
        print(`Failed to parse data! ${tostring(parseErr)}`)
      } else {

      }
    } else {
      print('Server shutting down!')
      break
    }
  }
}
