-- Protocol for ccserver turtles.

local function send(data)
	local out = textutils.serialiseJSON(data)
	_G.websocket.send(out)
end

local function getResponse()
	local response = websocket.receive()
	if response == nil then
		return { id = -1, code = 500, err = "Server closed" }
	end
	return textutils.unserialiseJSON(response)
end

local protocol = {}
protocol.VERSION = 2

-- Server-to-client invocations.
protocol.MAP = {}

function protocol.sendIdPacket()
	send({ id = 0, pv = protocol.VERSION, type = "turtle" })
end

function protocol.receive()
	while true do
		local data = getResponse()
		if data.id and protocol.MAP[data.id] then
			local failed = protocol.MAP[data.id](data)
			if failed then
				break
			end
		else
			print("Malformed packet!")
		end
	end
end

protocol.MAP[-1] = function(data)
	error("Received code " .. data.code .. ", error: " .. (data.err or "none provided"))
	if data.fatal then
		return true
	end
end

protocol.MAP[0] = function(data)
	if not data or data.code ~= 200 then
		error(data.err)
		return true
	end
	print("Successfully connected to " .. _G.serverURL .. "!")
end

protocol.MAP[1] = function(data)
	turtle.forward()
end

return protocol
