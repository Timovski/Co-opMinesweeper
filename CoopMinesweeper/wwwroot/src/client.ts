
HtmlHelper.initHtmlElements();
Renderer.drawBackground();
Initializer.initFields();
HtmlHelper.initEventListeners();

const clientOverlayStatus: HTMLElement = document.getElementById("client-overlay-status") as HTMLElement;
const clientGameIdInput: HTMLInputElement = document.getElementById("client-game-id-input") as HTMLInputElement;
const connectGameElement: HTMLElement = document.getElementById("connect-game") as HTMLElement;
const clientOverlay: HTMLElement = document.getElementById("client-overlay") as HTMLElement;

let clientPeer: SimplePeer = new SimplePeer({ initiator: false, trickle: false });
let clientSignalrConnection: signalR = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();
clientSignalrConnection.serverTimeoutInMilliseconds = 1000 * 60 * 5;

let connected: boolean = false;
let clientGameId: string;
let hostConnectionId: string;

clientOverlayStatus.innerText = "Waiting for game id...";

clientSignalrConnection.start().then(() => {
    clientOverlayStatus.innerText = "Connected to server successfully, insert game id...";
    connected = true;
}).catch((err: any) => {
    // todo: implement
});

let getHostSignal: () => void = (): void => {
    clientGameId = clientGameIdInput.value;
    if (connected) {
        clientSignalrConnection.invoke("GetHostSignal", clientGameId).catch((err: any) => {
            // todo: implement
        });
    }
};

clientSignalrConnection.on("ClientSignalPrompt", (connectionId: string, hostSignal: string) => {
    hostConnectionId = connectionId;
    clientPeer.signal(hostSignal);
});

clientGameIdInput.addEventListener("keyup", (event: KeyboardEvent) => { if (event.keyCode === 13) { getHostSignal(); } });
connectGameElement.addEventListener("click", getHostSignal);

clientPeer.on("error", (err: any): void => {
    // todo: implement
    debugger;
});

clientPeer.on("signal", (data: any): void => {
    const clientSignal: string = JSON.stringify(data);

    clientSignalrConnection.invoke("ReceiveClientSignal", hostConnectionId, clientSignal).then((newGameId: string) => {
        // hostGameId = newGameId;
        // hostOverlayGameId.innerText = `Game Id: ${newGameId}`;
        // hostOverlayStatus.innerText = "Waiting for other player to join...";
    }).catch((err: any) => {
        // todo: implement
    });
});

clientPeer.on("connect", (): void => {
    // todo: implement

    if (clientOverlay.parentNode) {
        clientOverlay.parentNode.removeChild(clientOverlay);
    }

    clientSignalrConnection.stop();
});

clientPeer.on("data", (data: any): void => {
    // todo: implement
    debugger;
});
