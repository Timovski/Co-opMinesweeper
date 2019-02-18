
HtmlHelper.initHtmlElements();
Renderer.drawBackground();
Initializer.initFields();
HtmlHelper.initEventListeners();

let clientGameId: string;
const clientOverlayStatus: HTMLElement = document.getElementById("client-overlay-status") as HTMLElement;
const clientGameIdInput: HTMLInputElement = document.getElementById("client-game-id-input") as HTMLInputElement;
const connectGameElement: HTMLElement = document.getElementById("connect-game") as HTMLElement;
const clientOverlay: HTMLElement = document.getElementById("client-overlay") as HTMLElement;

let clientPeer: SimplePeer = new SimplePeer({ initiator: false, trickle: false });

let getHostSignal: () => void = (): void => {
    clientGameId = clientGameIdInput.value;

    ServerHelper.getHostSignal(clientGameId).then((hostSignal: string): void => {
        if (hostSignal) {
            clientPeer.signal(hostSignal);
        } else {
            // todo: implement
        }
    }).catch((err: any) => {
        debugger;
        // return console.error(err.toString());
    });
};

clientGameIdInput.addEventListener("keyup", (event: KeyboardEvent) => { if (event.keyCode === 13) { getHostSignal(); } });
connectGameElement.addEventListener("click", getHostSignal);

clientPeer.on("error", (err: any): void => {
    // todo: implement
    debugger;
});

clientPeer.on("signal", (data: any): void => {
    const clientSignal: string = JSON.stringify(data);
    ServerHelper.joinGame(clientSignal, clientGameId).then((gameId: string): void => {
        // todo: implement
    }).catch((err: any) => {
        debugger;
        // return console.error(err.toString());
    });
});

clientPeer.on("connect", (): void => {
    // todo: implement
    if (clientOverlay.parentNode) {
        clientOverlay.parentNode.removeChild(clientOverlay);
    }
});

clientPeer.on("data", (data: any): void => {
    // todo: implement
    debugger;
});
