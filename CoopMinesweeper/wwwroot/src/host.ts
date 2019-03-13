HtmlHelper.initHtmlElements();
Renderer.drawBackground();
Initializer.initFields();

const hostOverlay: HTMLElement = document.getElementById("host-overlay") as HTMLElement;
const hostOverlayGameId: HTMLElement = document.getElementById("host-overlay-game-id") as HTMLElement;
const hostOverlayStatus: HTMLElement = document.getElementById("host-overlay-status") as HTMLElement;

const hostRestartButton: HTMLElement = document.getElementById("host-restart-button") as HTMLElement;
const hostEndGameButton: HTMLElement = document.getElementById("host-end-game-button") as HTMLElement;

const hostTestLatencyButton: HTMLElement = document.getElementById("host-test-latency-button") as HTMLElement;

let peer: SimplePeer = new SimplePeer({ initiator: true, trickle: false });
let signalrConnection: signalR = new signalR.HubConnectionBuilder().withUrl("/gameHub", { logger: signalR.LogLevel.Information }).build();
signalrConnection.serverTimeoutInMilliseconds = 300000; // 5 minutes

let hostGameId: string;
let hostSignal: string;

hostOverlayStatus.innerText = "Waiting for signal...";

peer.on("error", (err: any): void => {
    if (err.code === "ERR_ICE_CONNECTION_FAILURE") {
        return;
    }
    debugger;
    // todo: implement
});

peer.on("close", () => {
    hostOverlay.style.display = "table";
    hostEndGameButton.style.display = "inline-block";
    hostOverlayStatus.style.display = "block";
    hostOverlayStatus.innerText = "Other player has disconnected :/";
});

hostEndGameButton.addEventListener("click", (e: MouseEvent): void => {
    window.location.href = "/index.html";
});

signalrConnection.onclose((error?: Error): void => {
    // debugger;
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
    // if (hostOverlay.parentNode) {
    //     hostOverlay.parentNode.removeChild(hostOverlay);
    // }

    hostOverlay.style.display = "none";
    hostOverlayGameId.style.display = "none";
    hostOverlayStatus.style.display = "none";

    signalrConnection.stop();
    // todo: implement
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
        const affectedFields: Field[] = ActionHelper.handleClick(field);

        if (gameEnded) {
            peer.send(JSON.stringify(new ServerDataObject(ServerEventType.GameOver, affectedFields, elapsedTime)));
        } else {
            peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Game, affectedFields)));
        }

        Renderer.drawAffectedFields(affectedFields);
    } else if (dataObject.clientEventType === ClientEventType.Flag) {
        const field: Field = Helpers.getActiveField(dataObject.mousePosition.x, dataObject.mousePosition.y);
        const affectedFields: Field[] = ActionHelper.HandleFlag(field);
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Game, affectedFields, flagsLeft)));
        Renderer.drawAffectedFields(affectedFields);
    } else if (dataObject.clientEventType === ClientEventType.Reset) {
        Renderer.drawBackground();
        Initializer.resetFields();
        hostOverlay.style.display = "none";
        gameStarted = false;
        gameEnded = false;
        HtmlHelper.setTimer(0);
        flagsLeft = 99;
        HtmlHelper.updateFlags(99);
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Reset)));
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

    const affectedFields: Field[] = ActionHelper.handleClick(field);

    if (gameEnded) {
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.GameOver, affectedFields, elapsedTime)));
    } else {
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Game, affectedFields)));
    }

    Renderer.drawAffectedFields(affectedFields);
});

mouseCanvas.addEventListener("contextmenu", (e: MouseEvent): void => {
    e.preventDefault();
    const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
    const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);

    if (field.revealed) {
        return;
    }

    const affectedFields: Field[] = ActionHelper.HandleFlag(field);
    peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Game, affectedFields, flagsLeft)));

    Renderer.drawAffectedFields(affectedFields);
});

hostRestartButton.addEventListener("click", (e: MouseEvent): void => {
    Renderer.drawBackground();
    Initializer.resetFields();
    hostOverlay.style.display = "none";
    gameStarted = false;
    gameEnded = false;
    HtmlHelper.setTimer(0);
    flagsLeft = 99;
    HtmlHelper.updateFlags(99);
    peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Reset)));
});

hostTestLatencyButton.addEventListener("click", (e: MouseEvent): void => {
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
