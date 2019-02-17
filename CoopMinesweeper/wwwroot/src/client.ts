
HtmlHelper.initHtmlElements();
Renderer.drawBackground();
Initializer.initFields();
HtmlHelper.initEventListeners();

let clientGameId: string;
const clientOverlayGameId: HTMLElement = document.getElementById("client-overlay-game-id") as HTMLElement;
const clientOverlayStatus: HTMLElement = document.getElementById("client-overlay-status") as HTMLElement;
const clientGameIdInput: HTMLInputElement = document.getElementById("client-game-id-input") as HTMLInputElement;
const connectGameElement: HTMLElement = document.getElementById("connect-game") as HTMLElement;

let clientPeer: SimplePeer = new SimplePeer({ initiator: false, trickle: false });

let getHostSignal: () => void = (): void => {
    debugger;
    clientGameId = clientGameIdInput.value;

    ServerHelper.getHostSignal(clientGameId).then((hostSignal: string): void => {
        debugger;
        clientPeer.signal(hostSignal);
    }).catch((err: any) => {
        debugger;
        // return console.error(err.toString());
    });
};

clientGameIdInput.addEventListener("keyup", (event: KeyboardEvent) => { if (event.keyCode === 13) { getHostSignal(); } });
connectGameElement.addEventListener("click", getHostSignal);

clientPeer.on("error", (err: any): void => {
    debugger;
});

clientPeer.on("signal", (data: any): void => {
    debugger;
});

clientPeer.on("connect", (): void => {
    debugger;
});

clientPeer.on("data", (data: any): void => {
    debugger;
});
