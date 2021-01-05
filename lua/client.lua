-----------------------------------------------------
--
-- Turtle interface for ccserver.
-- Authored originally by rwilliaise (ALotOfLetters).
--
-----------------------------------------------------

local args = {...}

_G.serverURL = args[1] or "ws://localhost:8080"

local ws, err = http.websocket(_G.serverURL)

if not ws then
    print("Failed to create websocket! Error: " .. err)
end

_G.websocket = ws

local protocol = require("protocol")
protocol.sendIdPacket() -- make sure turtle using correct protocol version
protocol.receive() -- listen for commands from server

_G.websocket.close()
