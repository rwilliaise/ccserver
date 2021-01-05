import WebSocket from "ws";

function str(data: any) {
	return JSON.stringify(data);
}

export type packetProtocol = (client: WebSocket, data: any) => void;

export const PROTOCOL_VERSION = 2; // required so it doesn't crash and burn when i update
export const PROTOCOL_MAP = new Map<number, packetProtocol>();

function processIdPacket(client: WebSocket, data: { id: number, pv: number, type: "turtle" }) {
	console.log(`Received connection with protocol version ${data.pv} and is a ${data.type}`);
	if (PROTOCOL_VERSION !== data.pv) {
		client.send(str({ code: 405, err: `Invalid protocol version! Requires version ${PROTOCOL_VERSION}` }));
	}
	client.send(str({ code: 200 }));
}

PROTOCOL_MAP.set(0, processIdPacket);
