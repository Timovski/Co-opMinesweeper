
HtmlHelper.initHtmlElements();
Renderer.drawBackground();
Initializer.initFields();
HtmlHelper.initEventListeners();

const hostOverlayGameId: HTMLElement = document.getElementById("host-overlay-game-id") as HTMLElement;
const hostOverlayStatus: HTMLElement = document.getElementById("host-overlay-status") as HTMLElement;
const hostOverlay: HTMLElement = document.getElementById("host-overlay") as HTMLElement;

let peer: SimplePeer = new SimplePeer({ initiator: true, trickle: false });
let signalrConnection: signalR = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();
signalrConnection.serverTimeoutInMilliseconds = 1000 * 60 * 5;

let hostGameId: string;
let hostSignal: string;

hostOverlayStatus.innerText = "Waiting for signal...";

peer.on("error", (err: any): void => {
    debugger;
    // todo: implement
});

peer.on("signal", (data: any): void => {
    hostSignal = JSON.stringify(data);

    hostOverlayStatus.innerText = "Signal received successfully, connecting to server...";

    signalrConnection.start().then(() => {
        hostOverlayStatus.innerText = "Connected to server successfully, creating game...";

        signalrConnection.invoke("CreateGame").then((newGameId: string) => {
            hostGameId = newGameId;
            hostOverlayGameId.innerText = `Game Id: ${newGameId}`;
            hostOverlayStatus.innerText = "Waiting for other player to join...";
        }).catch((err: any) => {
            // todo: implement
        });
    }).catch((err: any) => {
        // todo: implement
    });
});

peer.on("connect", (): void => {
    if (hostOverlay.parentNode) {
        hostOverlay.parentNode.removeChild(hostOverlay);
    }
    signalrConnection.stop();
    // todo: implement
});

peer.on("data", (data: any): void => {
    debugger;
    // todo: implement
});

signalrConnection.on("ConnectWithClient", (clientSignal: string) => {
    peer.signal(clientSignal);
});

signalrConnection.on("HostSignalPrompt", (clientConnectionId: string) => {
    signalrConnection.invoke("ReceiveHostSignal", clientConnectionId, hostSignal).catch((err: any) => {
        // todo: implement
    });
});
