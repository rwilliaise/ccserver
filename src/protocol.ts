import WebSocket from "ws";

function send(client: WebSocket, data: { id: number, [k: string]: any }) {
	const stringify = JSON.stringify(data);
	client.send(stringify);
}

export type packetProtocol = (client: WebSocket, data: any) => void;

export const PROTOCOL_VERSION = 2; // required so it doesn't crash and burn when i update

// Client-to-server invocations.
export const PROTOCOL_MAP = new Map<number, packetProtocol>();

function processIdPacket(client: WebSocket, data: { id: number, pv: number, type: "turtle" }) {
	console.log(`Received connection with protocol version ${data.pv} and is a ${data.type}`);
	if (PROTOCOL_VERSION !== data.pv) {
		send(client, { code: 405, id: -1, err: `Invalid protocol version! Requires version ${PROTOCOL_VERSION}` });
	}
	send(client, { code: 200, id: 0 });
}

export function sendForward(client: WebSocket) {
	send(client, { id: 1 });
}

PROTOCOL_MAP.set(0, processIdPacket);
