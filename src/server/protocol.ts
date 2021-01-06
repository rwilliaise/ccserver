import WebSocket from "ws";
import {Item, Network} from "./network";

function send(client: WebSocket | Client, data: { id: number, [k: string]: any }) {
	const stringify = JSON.stringify(data);
	client.send(stringify);
}

type ClientType = "turtle";
type Items = Map<string, Item>;

export const TurtleNetwork = new Network();

export enum Peripheral {
	INTROSPECTIVE,
	CRAFTY,
	MINING,
}

export class Client {

	static clients: Client[] = [];

	socket: WebSocket;
	type: ClientType;

	constructor(type: ClientType, socket: WebSocket) {
		this.type = type;
		this.socket = socket;
	}

	send(data: any) {
		this.socket.send(data);
	}

	get id() {
		return Client.clients.indexOf(this);
	}

	static broadcast(data: any) {
		Client.clients.forEach(client => {
			client.send(data);
		});
	}
}

export class Turtle extends Client {

	peripherals: Peripheral[] = [];

	constructor(socket: WebSocket) {
		super("turtle", socket);
	}
}

export type packetProtocol = (client: Client, data: any) => void;

export const PROTOCOL_VERSION = 2; // required so it doesn't crash and burn when i update

// Client-to-server invocations.
export const PROTOCOL_MAP = new Map<number, packetProtocol>();

export function processIdPacket(client: WebSocket, data: { pv: number, type: ClientType }) {
	console.log(`Received connection with protocol version ${data.pv} and is a ${data.type}`);
	if (PROTOCOL_VERSION !== data.pv) {
		send(client, { code: 405, id: -1, err: `Invalid protocol version! Requires version ${PROTOCOL_VERSION}` });
	}
	let out: Client | null = null;
	switch (data.type) {
		case "turtle":
			out = new Turtle(client);
			break;
		default:
			console.log(`ClientType not found: ${data.type}`);
			break;
	}
	if (out !== null) {
		Client.clients.push(out);
		send(client, { code: 200, id: 0 });
		return out;
	}
	send(client, { code: 405, id: -1, err: "Client unsupported." });
	return null;
}

export function sendDetection(client: Client) {
	send(client, { id: 1, type: "item" });
}

export function sendUpdate(client: Client) {
	send(client, { id: 1, type: "update", items: TurtleNetwork.items });
}

function processDataPacket(client: Client, data: { type: "item", data: any }) {
	if (data.type === "item") {
		const out: Item[] = [];
		for (const key in data.data) {
			out[parseInt(key)] = data.data[key];
		}
		TurtleNetwork.setInventory(client.id, out);
	}
}

PROTOCOL_MAP.set(1, processDataPacket);
