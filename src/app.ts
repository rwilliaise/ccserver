import WebSocket from "ws";
import { PROTOCOL_MAP } from "./protocol";
import assert from "assert";

const server = new WebSocket.Server({ port: 8080 }); // host on local machine.

server.on("connection", (client) => {

	client.on("message", (msg) => {
		if (typeof msg !== "string") {
			client.send(JSON.stringify({ code: 400, err: "Unsupported format!" }))
		}
		const data = JSON.parse(msg as string);
		assert((data) && data.id !== null);
		const protocol = PROTOCOL_MAP.get(data.id);
		assert(protocol, `Packet id ${data.id} not found!`);
		protocol(client, data);
	})
});
