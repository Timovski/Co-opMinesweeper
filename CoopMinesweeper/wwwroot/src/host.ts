Renderer.drawBackground();
FieldHelper.initializeFields();

let peer: SimplePeer = new SimplePeer({ initiator: true, trickle: false });
let signalrConnection: signalR = new signalR.HubConnectionBuilder().withUrl(baseSignalrUrl + "/gameHub", { logger: signalR.LogLevel.None }).build();
signalrConnection.serverTimeoutInMilliseconds = 300000; // 5 minutes

if (debugSimplePeer) {
    const originalDebug: any = peer._debug;
    peer._debug = function (): void {
        const self: SimplePeer = this;
        console.log(arguments);
        originalDebug.apply(self, arguments);
    };
}

let hostSignal: string;
let gameStarted: boolean = false;

overlayStatus.innerText = "Waiting for signal...";

// #region SimplePeer

peer.on("signal", (data: any): void => {
    hostSignal = JSON.stringify(data);

    overlayStatus.innerText = "Signal received successfully, connecting to server...";

    signalrConnection.start().then(() => {
        overlayStatus.innerText = "Connected to server successfully, creating game...";

        signalrConnection.invoke("CreateGame").then((newGameId: string) => {
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
        Helpers.processLatency(dataObject.stamp);
    } else if (dataObject.clientEventType === ClientEventType.Move) {
        Renderer.drawMouse(dataObject.mousePosition);
    } else if (dataObject.clientEventType === ClientEventType.Click) {
        const field: Field = FieldHelper.getField(dataObject.mousePosition.x, dataObject.mousePosition.y);
        HostHelper.handleClick(field);
    } else if (dataObject.clientEventType === ClientEventType.Flag) {
        const field: Field = FieldHelper.getField(dataObject.mousePosition.x, dataObject.mousePosition.y);
        HostHelper.handleFlag(field);
    } else if (dataObject.clientEventType === ClientEventType.Reset) {
        HostHelper.restartGame();
    }
});

peer.on("close", () => {
    debugger;
    GameHelper.showEndGameScreen();
});

peer.on("error", (err: any): void => {
    debugger;
    if (err.code === "ERR_ICE_CONNECTION_FAILURE") {
        return;
    }

    // todo: implement
});

// #endregion

// #region SignalR

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

// #endregion

// #region Canvas Events

mouseCanvas.addEventListener("mousemove", (e: MouseEvent): void => {
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Move, mousePosition)));

    const field: Field = FieldHelper.getField(mousePosition.x, mousePosition.y);
    Renderer.renderMouseMove(field);
});

mouseCanvas.addEventListener("click", (e: MouseEvent): void => {
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    const field: Field = FieldHelper.getField(mousePosition.x, mousePosition.y);

    if (field.revealed || field.flag) {
        return;
    }

    HostHelper.handleClick(field);
});

mouseCanvas.addEventListener("contextmenu", (e: MouseEvent): void => {
    e.preventDefault();
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    const field: Field = FieldHelper.getField(mousePosition.x, mousePosition.y);

    if (field.revealed) {
        return;
    }

    HostHelper.handleFlag(field);
});

// #endregion

// #region Html Events

restartButton.addEventListener("click", (): void => {
    HostHelper.restartGame();
});

endGameButton.addEventListener("click", (): void => {
    window.location.href = "/index.html";
});

testLatencyButton.addEventListener("click", (): void => {
    for (let i: number = 1; i < 4; i++) {
        latencyTestStamps[i] = performance.now();
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.LatencyTest, i)));
    }
});

// #endregion
