
export class Client {

    url: string;
    websocket?: lWebSocket;

    constructor(url: string) {
        this.url = url;
        let ws = http.websocket(url)
        if (!(ws instanceof lWebSocket)) {
            let [_, err] = ws;
            print("Websocket client failure!")
            return;
        } else {
            this.websocket = ws;
        }
    }

    start() {

    }
}