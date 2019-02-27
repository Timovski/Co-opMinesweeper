
HtmlHelper.initHtmlElements();
Renderer.drawBackground();
Initializer.initFields();

const clientOverlayStatus: HTMLElement = document.getElementById("client-overlay-status") as HTMLElement;
const gameIdInput: HTMLInputElement = document.getElementById("game-id-input") as HTMLInputElement;
const connectButton: HTMLElement = document.getElementById("connect-button") as HTMLElement;
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
    clientGameId = gameIdInput.value;
    if (connected) {
        clientSignalrConnection.invoke("GetHostSignal", clientGameId).catch((err: any) => {
            // todo: implement
        });
    } else {
        // todo: implement
    }
};

clientSignalrConnection.on("ClientSignalPrompt", (hostConnId: string, hostSignal: string) => {
    hostConnectionId = hostConnId;
    clientPeer.signal(hostSignal);
});

gameIdInput.addEventListener("keyup", (event: KeyboardEvent) => { if (event.keyCode === 13) { getHostSignal(); } });
connectButton.addEventListener("click", getHostSignal);

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
    const serverDataObject: ServerDataObject = JSON.parse(data);
    if (serverDataObject.serverDataType === ServerDataType.MouseMove) {
        Renderer.drawMouse(serverDataObject.mousePosition);
    } else if (serverDataObject.serverDataType === ServerDataType.Game) {
        // matrix = serverDataObject.gameMatrix as Field[][];
        // previousActiveField = matrix[previousActiveField.row][previousActiveField.column];
        // Renderer.renderMatrix();
    }
});

mouseCanvas.addEventListener("mousemove", (e: MouseEvent): void => {
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    clientPeer.send(JSON.stringify(new ClientDataObject(mousePosition, MouseEventType.Move)));

    const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);
    Renderer.renderMouseMove(field);
});

mouseCanvas.addEventListener("click", (e: MouseEvent): void => {
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    clientPeer.send(JSON.stringify(new ClientDataObject(mousePosition, MouseEventType.Click)));
});

mouseCanvas.addEventListener("contextmenu", (e: MouseEvent): void => {
    e.preventDefault();
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    clientPeer.send(JSON.stringify(new ClientDataObject(mousePosition, MouseEventType.Flag)));
});
