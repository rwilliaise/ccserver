import WebSocket from "ws";
import {PROTOCOL_MAP, sendForward} from "./protocol";
import assert from "assert";

const readline = require("readline").createInterface({
	input: process.stdin
});

const server = new WebSocket.Server({ port: 8080 }); // host on local machine.

let clients: WebSocket[] = [];

server.on("connection", (client) => {
	clients.push(client);

	client.on("message", (msg) => {
		if (typeof msg !== "string") {
			client.send(JSON.stringify({ code: 400, err: "Unsupported format!" }))
		}
		const data = JSON.parse(msg as string);
		assert((data) && data.id !== null);
		const protocol = PROTOCOL_MAP.get(data.id);
		assert(protocol, `Packet id ${data.id} not found!`);
		protocol(client, data);
	});

	client.on("close", () => {
		clients = clients.filter(s => s !== client);
	});
});

readline.on("line", (input: string) => {
	if (input.includes("forward")) {
		clients.forEach(s => sendForward(s));
	}
});
