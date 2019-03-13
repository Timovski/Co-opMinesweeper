HtmlHelper.initHtmlElements();
Renderer.drawBackground();
Initializer.initFields();

const clientOverlay: HTMLElement = document.getElementById("client-overlay") as HTMLElement;
const clientOverlayGameId: HTMLElement = document.getElementById("client-overlay-game-id") as HTMLElement;
const gameIdInput: HTMLInputElement = document.getElementById("game-id-input") as HTMLInputElement;
const connectButton: HTMLElement = document.getElementById("connect-button") as HTMLElement;
const clientOverlayStatus: HTMLElement = document.getElementById("client-overlay-status") as HTMLElement;

const clientRestartButton: HTMLElement = document.getElementById("client-restart-button") as HTMLElement;
const clientEndGameButton: HTMLElement = document.getElementById("client-end-game-button") as HTMLElement;

const clientTestLatencyButton: HTMLElement = document.getElementById("client-test-latency-button") as HTMLElement;

let clientPeer: SimplePeer = new SimplePeer({ initiator: false, trickle: false });
let clientSignalrConnection: signalR = new signalR.HubConnectionBuilder().withUrl("/gameHub", { logger: signalR.LogLevel.Information }).build();
clientSignalrConnection.serverTimeoutInMilliseconds = 300000; // 5 minutes

let connected: boolean = false;
let clientGameId: string;
let hostConnectionId: string;

clientOverlayStatus.innerText = "Waiting for game id...";

clientSignalrConnection.start().then(() => {
    clientOverlayStatus.innerText = "Connected to server successfully, enter game id...";
    connected = true;
}).catch((err: any) => {
    // todo: implement
});

const getHostSignal: () => void = (): void => {
    if (!gameIdInput.value) {
        return;
    }

    clientGameId = gameIdInput.value;
    if (connected) {
        clientSignalrConnection.invoke("GetHostSignal", clientGameId).then((sadsa: any) => {
            clientOverlayStatus.innerText = "No game found for the provided game id…";
        }).catch((err: any) => {
            debugger;
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
    if (err.code === "ERR_ICE_CONNECTION_FAILURE") {
        return;
    }
    // todo: implement
    debugger;
});

clientPeer.on("close", () => {
    clientOverlay.style.display = "table";
    clientEndGameButton.style.display = "inline-block";
    clientOverlayStatus.style.display = "block";
    clientOverlayStatus.innerText = "Other player has disconnected :/";
});

clientEndGameButton.addEventListener("click", (e: MouseEvent): void => {
    window.location.href = "/index.html";
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
    if (serverDataObject.serverEventType === ServerEventType.LatencyTest) {
        clientPeer.send(JSON.stringify(new ClientDataObject(ClientEventType.LatencyResponse, serverDataObject.stamp)));
    } else if (serverDataObject.serverEventType === ServerEventType.LatencyResponse) {
        clientProcessLatency(serverDataObject.stamp);
    } else if (serverDataObject.serverEventType === ServerEventType.Move) {
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
        if (serverDataObject.flagsLeft) {
            HtmlHelper.updateFlags(serverDataObject.flagsLeft);
        }

        if (!gameStarted) {
            gameStarted = true;
            HtmlHelper.startTimer();
        }
    } else if (serverDataObject.serverEventType === ServerEventType.GameOver) {
        gameStarted = false;
        HtmlHelper.stopTimer();
        HtmlHelper.setTimer(serverDataObject.elapsedTime!);

        Renderer.drawAffectedFields(serverDataObject.affectedFields);
        clientOverlay.style.display = "table";
        clientRestartButton.style.display = "inline-block";
    } else if (serverDataObject.serverEventType === ServerEventType.Reset) {
        Renderer.drawBackground();
        Initializer.resetFields();
        HtmlHelper.setTimer(0);
        HtmlHelper.updateFlags(99);

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

clientTestLatencyButton.addEventListener("click", (e: MouseEvent): void => {
    for (let i: number = 1; i < 4; i++) {
        latencyTestStamps[i] = performance.now();
        clientPeer.send(JSON.stringify(new ClientDataObject(ClientEventType.LatencyTest, i)));
    }
});

const clientProcessLatency: (stamp: number) => void = (stamp: number): void => {
    const t0: number = latencyTestStamps[stamp];
    const t1: number = performance.now();
    latencyTestResults[stamp] = t1 - t0;

    if (stamp === 3) {
        averageLatency = (latencyTestResults[1] + latencyTestResults[2] + latencyTestResults[3]) / 3;
        alert(`The latency is ${averageLatency} milliseconds.`);
    }
};
