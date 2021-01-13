import WebSocket from "ws";
import { Item, Network } from "./network";
import { ipcRenderer } from "electron";
import labels from "./labels.json";

const serverLabel = labels.labels[Math.floor(Math.random() * labels.labels.length)];

function send(client: WebSocket | Turtle, data: { id: number; [k: string]: unknown }) {
	const stringify = JSON.stringify(data);
	client.send(stringify, { compress: true });
}

export const TurtleNetwork = new Network();

export enum Peripheral {
	SCANNER,
	CRAFTY,
	MINING,
	WIRELESS,
}

export class Turtle {
	static clients: Turtle[] = [];

	socket: WebSocket;
	equipped: Peripheral | null = null;
	x = 0;
	y = 0;
	z = 0;

	constructor(socket: WebSocket) {
		this.socket = socket;
	}

	send(data: unknown): void {
		this.socket.send(data);
	}

	get id(): number {
		return Turtle.clients.indexOf(this);
	}

	static broadcast(data: unknown): void {
		Turtle.clients.forEach((client) => {
			client.send(data);
		});
	}
}

export type packetProtocol = (client: Turtle, data: never) => void;

export const PROTOCOL_VERSION = 3; // required so it doesn't crash and burn when i update

// Client-to-server invocations.
export const PROTOCOL_MAP = new Map<number, packetProtocol>();

export function processIdPacket(client: WebSocket, data: { pv: number }): Turtle | null {
	console.log(`Received connection with protocol version ${data.pv}`);
	if (PROTOCOL_VERSION !== data.pv) {
		send(client, { code: 405, id: -1, err: `Invalid protocol version! Requires version ${PROTOCOL_VERSION}` });
	}
	const out = new Turtle(client);
	Turtle.clients.push(out);
	send(client, { code: 200, id: 0, turtle: out.id, label: serverLabel });
	ipcRenderer.send("server-update", { type: "turtle", data: out });
	return out;
}

export function sendDetection(client: Turtle): void {
	send(client, { id: 1, type: "sync" });
}

export function sendUpdate(client: Turtle): void {
	send(client, { id: 1, type: "update", items: TurtleNetwork.items });
}

function processDataPacket(
	client: Turtle,
	data: { type: "item" | "position" | "peripheral"; data: Record<string, never> | Peripheral },
) {
	if (data.type === "item") {
		const itemdata = <Record<string, never>>data.data;
		const out: Item[] = [];
		for (const key in itemdata) {
			out[parseInt(key)] = itemdata[key];
		}
		TurtleNetwork.setInventory(client.id, out);
		Turtle.clients.forEach((value) => {
			if (value !== client) {
				send(value, { id: 1, type: "update", items: TurtleNetwork.items });
			}
		});
		ipcRenderer.send("server-update", { type: "item", data: TurtleNetwork.items });
	}
	if (data.type === "position" && typeof data.data !== "number") {
		client.x = data.data.x;
		client.y = data.data.y;
		client.z = data.data.z;
	}
	if (data.type === "peripheral" && typeof data.data === "number") {
		client.equipped = data.data;
	}
	ipcRenderer.send("server-update", { type: "turtle", data: client });
}

PROTOCOL_MAP.set(1, processDataPacket);
