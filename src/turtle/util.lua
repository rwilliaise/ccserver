
function createSocket(url, headers)
  local socket, err = http.websocket(url, headers)

  if not socket then
    error("Failed to create socket! " .. err)
  end

  return socket
end

return {
  createSocket = createSocket
}
