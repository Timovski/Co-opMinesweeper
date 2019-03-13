Renderer.drawBackground();
Initializer.initFields();

let peer: SimplePeer = new SimplePeer({ initiator: true, trickle: false });
let signalrConnection: signalR = new signalR.HubConnectionBuilder().withUrl("/gameHub", { logger: signalR.LogLevel.Information }).build();
signalrConnection.serverTimeoutInMilliseconds = 300000; // 5 minutes

let hostGameId: string;
let hostSignal: string;
let gameStarted: boolean = false;

overlayStatus.innerText = "Waiting for signal...";

// SimplePeer
peer.on("signal", (data: any): void => {
    hostSignal = JSON.stringify(data);

    overlayStatus.innerText = "Signal received successfully, connecting to server...";

    signalrConnection.start().then(() => {
        overlayStatus.innerText = "Connected to server successfully, creating game...";

        signalrConnection.invoke("CreateGame").then((newGameId: string) => {
            hostGameId = newGameId;
            gameIdText.innerText = `Game Id: ${newGameId}`;
            overlayStatus.innerText = "Waiting for other player to join...";
        }).catch((err: any) => {
            // todo: implement
        });
    }).catch((err: any) => {
        // todo: implement
    });
});

peer.on("connect", (): void => {
    GameHelper.hideOverlay();
    signalrConnection.stop();
});

peer.on("data", (data: any): void => {
    const dataObject: ClientDataObject = JSON.parse(data);
    if (dataObject.clientEventType === ClientEventType.LatencyTest) {
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.LatencyResponse, dataObject.stamp)));
    } else if (dataObject.clientEventType === ClientEventType.LatencyResponse) {
        hostProcessLatency(dataObject.stamp);
    } else if (dataObject.clientEventType === ClientEventType.Move) {
        Renderer.drawMouse(dataObject.mousePosition);
    } else if (dataObject.clientEventType === ClientEventType.Click) {
        const field: Field = Helpers.getActiveField(dataObject.mousePosition.x, dataObject.mousePosition.y);
        ActionHelper.handleClick(field);
    } else if (dataObject.clientEventType === ClientEventType.Flag) {
        const field: Field = Helpers.getActiveField(dataObject.mousePosition.x, dataObject.mousePosition.y);
        ActionHelper.handleFlag(field);
    } else if (dataObject.clientEventType === ClientEventType.Reset) {
        ActionHelper.restartGame();
    }
});

peer.on("close", () => {
    GameHelper.showEndGameScreen();
});

peer.on("error", (err: any): void => {
    if (err.code === "ERR_ICE_CONNECTION_FAILURE") {
        return;
    }

    // todo: implement
});

// Signalr
signalrConnection.on("HostSignalPrompt", (clientConnectionId: string) => {
    signalrConnection.invoke("ReceiveHostSignal", clientConnectionId, hostSignal).catch((err: any) => {
        // todo: implement
    });
});

signalrConnection.on("ConnectWithClient", (clientSignal: string) => {
    peer.signal(clientSignal);
});

signalrConnection.onclose((error?: Error): void => {
    // todo: implement
});

// Canvas Events
mouseCanvas.addEventListener("mousemove", (e: MouseEvent): void => {
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Move, mousePosition)));

    const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);
    Renderer.renderMouseMove(field);
});

mouseCanvas.addEventListener("click", (e: MouseEvent): void => {
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);

    if (field.revealed || field.flag) {
        return;
    }

    ActionHelper.handleClick(field);
});

mouseCanvas.addEventListener("contextmenu", (e: MouseEvent): void => {
    e.preventDefault();
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);

    if (field.revealed) {
        return;
    }

    ActionHelper.handleFlag(field);
});

// Html Events
restartButton.addEventListener("click", (e: MouseEvent): void => {
    ActionHelper.restartGame();
});

endGameButton.addEventListener("click", (e: MouseEvent): void => {
    window.location.href = "/index.html";
});

testLatencyButton.addEventListener("click", (e: MouseEvent): void => {
    for (let i: number = 1; i < 4; i++) {
        latencyTestStamps[i] = performance.now();
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.LatencyTest, i)));
    }
});

const hostProcessLatency: (stamp: number) => void = (stamp: number): void => {
    const t0: number = latencyTestStamps[stamp];
    const t1: number = performance.now();
    latencyTestResults[stamp] = t1 - t0;

    if (stamp === 3) {
        averageLatency = (latencyTestResults[1] + latencyTestResults[2] + latencyTestResults[3]) / 3;
        alert(`The latency is ${averageLatency} milliseconds.`);
    }
};
