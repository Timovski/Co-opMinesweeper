HtmlHelper.initHtmlElements();
Renderer.drawBackground();
Initializer.initFields();

const clientOverlay: HTMLElement = document.getElementById("client-overlay") as HTMLElement;
const clientOverlayGameId: HTMLElement = document.getElementById("client-overlay-game-id") as HTMLElement;
const gameIdInput: HTMLInputElement = document.getElementById("game-id-input") as HTMLInputElement;
const connectButton: HTMLElement = document.getElementById("connect-button") as HTMLElement;
const clientOverlayStatus: HTMLElement = document.getElementById("client-overlay-status") as HTMLElement;
const clientRestartButton: HTMLElement = document.getElementById("client-restart-button") as HTMLElement;

let clientPeer: SimplePeer = new SimplePeer({ initiator: false, trickle: false });
let clientSignalrConnection: signalR = new signalR.HubConnectionBuilder().withUrl("/gameHub", { logger: signalR.LogLevel.Information }).build();
clientSignalrConnection.serverTimeoutInMilliseconds = 300000; // 5 minutes

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

clientSignalrConnection.onclose((error?: Error): void => {
    // debugger;
    // todo: implement
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

    // if (clientOverlay.parentNode) {
    //     clientOverlay.parentNode.removeChild(clientOverlay);
    // }
    clientOverlay.style.display = "none";
    clientOverlayGameId.style.display = "none";
    clientOverlayStatus.style.display = "none";

    clientSignalrConnection.stop();
});

clientPeer.on("data", (data: any): void => {
    const serverDataObject: ServerDataObject = JSON.parse(data);
    if (serverDataObject.serverEventType === ServerEventType.Move) {
        Renderer.drawMouse(serverDataObject.mousePosition);
    } else if (serverDataObject.serverEventType === ServerEventType.Game) {
        for (let i: number = 0, len: number = serverDataObject.affectedFields.length; i < len; i++) {
            const field: Field = serverDataObject.affectedFields[i];

            // todo: This should happen for client only
            matrix[field.row][field.column] = field;

            // todo: Think of a better solution for this problem
            if (previousActiveField && previousActiveField.row === field.row && previousActiveField.column === field.column) {
                previousActiveField = field;
            }
        }
        Renderer.drawAffectedFields(serverDataObject.affectedFields);
    } else if (serverDataObject.serverEventType === ServerEventType.GameOver) {
        Renderer.drawAffectedFields(serverDataObject.affectedFields);
        clientOverlay.style.display = "table";
        clientRestartButton.style.display = "inline-block";
    } else if (serverDataObject.serverEventType === ServerEventType.Reset) {
        Renderer.drawBackground();
        Initializer.resetFields();
        clientOverlay.style.display = "none";
    }
});

mouseCanvas.addEventListener("mousemove", (e: MouseEvent): void => {
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    clientPeer.send(JSON.stringify(new ClientDataObject(ClientEventType.Move, mousePosition)));

    const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);
    Renderer.renderMouseMove(field);
});

mouseCanvas.addEventListener("click", (e: MouseEvent): void => {
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);

    if (field.revealed || field.flag) {
        return;
    }

    clientPeer.send(JSON.stringify(new ClientDataObject(ClientEventType.Click, mousePosition)));
});

mouseCanvas.addEventListener("contextmenu", (e: MouseEvent): void => {
    e.preventDefault();
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);

    if (field.revealed) {
        return;
    }

    clientPeer.send(JSON.stringify(new ClientDataObject(ClientEventType.Flag, mousePosition)));
});

clientRestartButton.addEventListener("click", (e: MouseEvent): void => {
    clientPeer.send(JSON.stringify(new ClientDataObject(ClientEventType.Reset)));
});
