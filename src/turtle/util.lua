
function createSocket(url, headers)
  local socket, error = http.websocket(url, headers)

  if not socket then
    error("Failed to create socket! " .. error)
  end

  return socket
end

function receiveSocket(socket, timeout)
  return socket.receive(timeout)
end

function deserializeJson(str)
  local obj, error = textutils.unserializeJSON(str)
  if not obj then
    return nil, error
  end

  return obj, ""
end

return {
  createSocket = createSocket,
  receiveSocket = receiveSocket,
  deserializeJson = deserializeJson
}
