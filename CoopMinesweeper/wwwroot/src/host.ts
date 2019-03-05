HtmlHelper.initHtmlElements();
Renderer.drawBackground();
Initializer.initFields();

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
    const dataObject: ClientDataObject = JSON.parse(data);
    if (dataObject.mouseEventType === MouseEventType.Move) {
        Renderer.drawMouse(dataObject.mousePosition);
    } else if (dataObject.mouseEventType === MouseEventType.Click) {
        debugger;
        const field: Field = Helpers.getActiveField(dataObject.mousePosition.x, dataObject.mousePosition.y);
        const affectedFields: Field[] = ActionHelper.handleClick(field);
        peer.send(JSON.stringify(new ServerDataObject(affectedFields, ServerDataType.Game)));
        Renderer.drawAffectedFields(affectedFields);
    } else if (dataObject.mouseEventType === MouseEventType.Flag) {
        debugger;
        const field: Field = Helpers.getActiveField(dataObject.mousePosition.x, dataObject.mousePosition.y);
        const affectedFields: Field[] = ActionHelper.HandleFlag(field);
        peer.send(JSON.stringify(new ServerDataObject(affectedFields, ServerDataType.Game)));
        Renderer.drawAffectedFields(affectedFields);
    }
});

signalrConnection.on("HostSignalPrompt", (clientConnectionId: string) => {
    signalrConnection.invoke("ReceiveHostSignal", clientConnectionId, hostSignal).catch((err: any) => {
        // todo: implement
    });
});

signalrConnection.on("ConnectWithClient", (clientSignal: string) => {
    peer.signal(clientSignal);
});

mouseCanvas.addEventListener("mousemove", (e: MouseEvent): void => {
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    peer.send(JSON.stringify(new ServerDataObject(mousePosition, ServerDataType.MouseMove)));

    const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);
    Renderer.renderMouseMove(field);
});

mouseCanvas.addEventListener("click", (e: MouseEvent): void => {
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);

    if (field.revealed || field.flag) {
        return;
    }

    const affectedFields: Field[] = ActionHelper.handleClick(field);
    peer.send(JSON.stringify(new ServerDataObject(affectedFields, ServerDataType.Game)));

    Renderer.drawAffectedFields(affectedFields);
});

mouseCanvas.addEventListener("contextmenu", (e: MouseEvent): void => {
    debugger;
    e.preventDefault();
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);

    if (field.revealed) {
        return;
    }

    const affectedFields: Field[] = ActionHelper.HandleFlag(field);
    peer.send(JSON.stringify(new ServerDataObject(affectedFields, ServerDataType.Game)));

    Renderer.drawAffectedFields(affectedFields);
});
