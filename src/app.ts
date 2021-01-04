import WebSocket from "ws";

const server = new WebSocket.Server({ port: 8080 }); // host on local machine.



server.on("listening", () => {
	console.log("Starting net server!");
});

server.on("connection", function(client) {


});
