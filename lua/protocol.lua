-- Protocol for ccserver

local function send(data)
	local out = textutils.serialiseJSON(data)
	_G.websocket.send(out)
end

local function getResponse()
	local response = _G.websocket.receive()
	return textutils.unserialiseJSON(response)
end

local protocol = {}
protocol.VERSION = 1
protocol.MAP = {}

function protocol.sendIdPacket()
	send({ id = 0, pv = protocol.VERSION, type = "turtle" })
	local response = getResponse()
	if not response or response.code ~= 200 then
		error(response.err)
		_G.websocket.close()
	end
	return response
end

function protocol.receive()
	while true do
		local data = getResponse()
	end
end

protocol.MAP[1] = function(data)

end

return protocol
