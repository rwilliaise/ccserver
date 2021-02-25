-- Protocol for ccserver turtles.

local function send(data)
	local out = textutils.serialiseJSON(data)
	_G.websocket.send(out)
end

local function getResponse()
	local response = _G.websocket.receive()
	if response == nil then
		return { id = -1, code = 500, err = "Server closed" }
	end
	return textutils.unserialiseJSON(response)
end

-- Every turtle has a glimpse of the current state of the network.
local network = {}
network.items = {}

local protocol = {}
protocol.VERSION = 3

-- Server-to-client invocations.
protocol.MAP = {}

local equipped = nil

local ITEM_WHITELIST = {
	["plethora:scanner"] = 0,
	["minecraft:crafting_table"] = 1,
	["computercraft:advanced_modem"] = 2,
}

local function sync()
	local items = {}
	for i = 1, 16 do
		local item = turtle.getItemDetail(i)
		if item and ITEM_WHITELIST[item.name] and not equipped then
			turtle.select(i)
			turtle.equipLeft()
			equipped = ITEM_WHITELIST[item.name]
			send({ id = 1, data = ITEM_WHITELIST[item.name], type = "peripheral" })
		end
		items[tostring(i)] = item
	end
	send({ id = 1, data = items, type = "item" })
	if equipped == 2 then
		local posA = gps.locate(3)
		send({id = 1, data = posA, type = "position"})
	end
end

function protocol.sendIdPacket()
	send({ id = 0, pv = protocol.VERSION })
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

-- error packet
protocol.MAP[-1] = function(data)
	error("Received code " .. data.code .. ", error: " .. (data.err or "none provided"))
	if data.fatal then
		return true
	end
end

-- connection ping packet
protocol.MAP[0] = function(data)
	if not data or data.code ~= 200 then
		error(data.err)
		return true
	end
	if data.turtle and data.label then
		os.setComputerLabel(data.label .. "_" .. data.turtle)
	end
	print("Successfully connected to " .. _G.serverURL .. " under name " .. os.getComputerLabel() or "<NULL>" .. "!")
	sync()
end

-- data request packet
protocol.MAP[1] = function(data)
	if data.type == "update" then -- nothing to be sent back
		network.items = data.items or network.items
	end
	if data.type == "sync" then -- item update
		sync()
	end
end

-- lua packet
protocol.MAP[2] = function(data)
	if not data.lua then return end
	load(data.lua)()
end

return protocol
