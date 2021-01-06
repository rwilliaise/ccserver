import WebSocket from "ws";
import {Client, processIdPacket, PROTOCOL_MAP, sendDetection, sendUpdate, TurtleNetwork} from "./protocol";
import assert from "assert";

const readline = require("readline").createInterface({
	input: process.stdin
});

const server = new WebSocket.Server({ port: 8080 }); // host on local machine

server.on("connection", (client) => {

	let functioningClient: Client | null = null;

	client.on("message", (msg) => {
		if (typeof msg !== "string") {
			client.send(JSON.stringify({ code: 400, err: "Unsupported format!" }))
		}
		const data = JSON.parse(msg as string);
		if (data === undefined || data.id === undefined) {
			console.log("Malformed packet!");
			return;
		}
		if (data.id === 0) {
			functioningClient = processIdPacket(client, data);
			return;
		}
		const protocol = PROTOCOL_MAP.get(data.id);
		if (protocol === undefined) {
			console.log(`Packet id ${data.id} not found!`);
			return;
		}
		if (functioningClient !== null) {
			protocol(functioningClient, data);
		}
	});

	client.on("close", () => {
		if (functioningClient && functioningClient.id) {
			TurtleNetwork.removeInventory(functioningClient.id);
		}
		Client.clients = Client.clients.filter(s => s.socket !== client);
	});
});

readline.on("line", (input: string) => {
	if (input.includes("scan")) {
		Client.clients.forEach(sendDetection);
	}
	if (input.includes("update")) {
		Client.clients.forEach(sendUpdate);
	}
	if (input.includes("check")) {
		console.log(TurtleNetwork.items);
	}
});
