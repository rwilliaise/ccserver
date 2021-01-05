-----------------------------------------------------
--
-- Turtle interface for ccserver.
-- Authored originally by rwilliaise (ALotOfLetters).
--
-----------------------------------------------------

local args = {...}
local serverURL = args[1] or "ws://localhost:8080"

_G.websocket = http.websocket(serverURL)

local protocol = require("protocol")
protocol.sendIdPacket() -- make sure turtle using correct protocol version
protocol.receive() -- listen for commands from server

_G.websocket.close()