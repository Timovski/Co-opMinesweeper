Renderer.drawBackground();
Initializer.initFields();

let clientPeer: SimplePeer = new SimplePeer({ initiator: false, trickle: false });
let clientSignalrConnection: signalR = new signalR.HubConnectionBuilder().withUrl("/gameHub", { logger: signalR.LogLevel.Information }).build();
clientSignalrConnection.serverTimeoutInMilliseconds = 300000; // 5 minutes

let connected: boolean = false;
let clientGameId: string;
let hostConnectionId: string;

overlayStatus.innerText = "Waiting for game id...";

// SimplePeer
clientPeer.on("signal", (data: any): void => {
    const clientSignal: string = JSON.stringify(data);

    clientSignalrConnection.invoke("ReceiveClientSignal", hostConnectionId, clientSignal).catch((err: any) => {
        // todo: implement
    });
});

clientPeer.on("connect", (): void => {
    GameHelper.hideOverlay();
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
            GameHelper.setFlags(serverDataObject.flagsLeft);
        }

        if (!timerIntervalId) {
            GameHelper.startTimer();
        }
    } else if (serverDataObject.serverEventType === ServerEventType.GameOver) {
        GameHelper.showRestartScreen();
        GameHelper.stopTimer();
        GameHelper.setTimer(serverDataObject.elapsedTime!);

        Renderer.drawAffectedFields(serverDataObject.affectedFields);
    } else if (serverDataObject.serverEventType === ServerEventType.Reset) {
        GameHelper.resetGame();
    }
});

clientPeer.on("close", () => {
    GameHelper.showEndGameScreen();
});

clientPeer.on("error", (err: any): void => {
    if (err.code === "ERR_ICE_CONNECTION_FAILURE") {
        return;
    }

    // todo: implement
});

// Signalr
clientSignalrConnection.start().then(() => {
    overlayStatus.innerText = "Connected to server successfully, enter game id...";
    connected = true;
}).catch((err: any) => {
    // todo: implement
});

clientSignalrConnection.on("ClientSignalPrompt", (hostConnId: string, hostSignal: string) => {
    hostConnectionId = hostConnId;
    clientPeer.signal(hostSignal);
});

clientSignalrConnection.onclose((error?: Error): void => {
    // todo: implement
});

// Canvas Events
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

// Html Events
const getHostSignal: () => void = (): void => {
    if (!gameIdInput.value) {
        return;
    }

    clientGameId = gameIdInput.value;
    if (connected) {
        clientSignalrConnection.invoke("GetHostSignal", clientGameId).then((sadsa: any) => {
            overlayStatus.innerText = "No game found for the provided game id…";
        }).catch((err: any) => {
            debugger;
            // todo: implement
        });
    } else {
        // todo: implement
    }
};

gameIdInput.addEventListener("keyup", (event: KeyboardEvent) => { if (event.keyCode === 13) { getHostSignal(); } });
connectButton.addEventListener("click", getHostSignal);

endGameButton.addEventListener("click", (e: MouseEvent): void => {
    window.location.href = "/index.html";
});

restartButton.addEventListener("click", (e: MouseEvent): void => {
    clientPeer.send(JSON.stringify(new ClientDataObject(ClientEventType.Reset)));
});

testLatencyButton.addEventListener("click", (e: MouseEvent): void => {
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
