
HtmlHelper.initHtmlElements();
Renderer.drawBackground();
Initializer.initFields();
HtmlHelper.initEventListeners();

let peer: SimplePeer = new SimplePeer({ initiator: true, trickle: false });
let signalrConnection: signalR = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();

let hostGameId: string;
const hostOverlayGameId: HTMLElement = document.getElementById("host-overlay-game-id") as HTMLElement;
const hostOverlayStatus: HTMLElement = document.getElementById("host-overlay-status") as HTMLElement;

hostOverlayStatus.innerText = "Waiting for signal...";

peer.on("error", (err: any): void => {
    // console.log("error", err);
});

peer.on("signal", (data: any): void => {
    const hostSignal: string = JSON.stringify(data);

    hostOverlayStatus.innerText = "Signal received successfully, connecting to server...";

    signalrConnection.start().then(() => {

        hostOverlayStatus.innerText = "Connected to server successfully, creating game...";

        signalrConnection.invoke("CreateGame", hostSignal).then((newGameId: string) => {
            hostGameId = newGameId;
            hostOverlayGameId.innerText = `Game Id: ${newGameId}`;
            hostOverlayStatus.innerText = "Waiting for other player to join...";
        }).catch((err: any) => {
            // return console.error(err.toString());
        });
    }).catch((err: any) => {
        // return console.error(err.toString());
    });
});

peer.on("connect", (): void => {
    debugger;
    // console.log("connect");
});

peer.on("data", (data: any): void => {
    // if (host) {
    //     let dataObject: ClientDataObject = JSON.parse(data);
    //     if (dataObject.mouseEventType === MouseEventType.Move) {
    //         Renderer.drawMouse(dataObject.mousePosition);
    //     } else if (dataObject.mouseEventType === MouseEventType.Click) {
    //         ActionHelper.handleClick(dataObject.mousePosition);
    //     } else if (dataObject.mouseEventType === MouseEventType.Flag) {
    //         ActionHelper.HandleFlag(dataObject.mousePosition);
    //     }
    // } else {
    //     let serverDataObject: ServerDataObject = JSON.parse(data);
    //     if (serverDataObject.serverDataType === ServerDataType.Game) {
    //         matrix = serverDataObject.gameMatrix as Field[][];
    //         previousActiveField = matrix[previousActiveField.row][previousActiveField.column];
    //         Renderer.renderMatrix();
    //     } else if (serverDataObject.serverDataType === ServerDataType.MouseMove) {
    //         Renderer.drawMouse(serverDataObject.mousePosition as MousePosition);
    //     }
    // }
});

// connection.on("ReceiveMessage", (user: any, message: any) => {
//     debugger;
//     let a: any = user;
//     let b: any = message;
// });

// setTimeout(() => {
//     debugger;
//     let user1: string = 'document.getElementById("userInput").value';
//     let message1: string = 'document.getElementById("messageInput").value';
//     connection.invoke("SendMessage", user1, message1).catch((err: any) => {
//         debugger;
//         // return console.error(err.toString());
//         let a: any = err;
//     });
// }, 3000);

// // setTimeout(() => {
// //     debugger;
// //     connection.stop().then(() => {
// //         debugger;
// //         let a: number = 0;
// //     }).catch((err: any) => {
// //         debugger;
// //         // return console.error(err.toString());
// //         let a: any = err;
// //     });
// // }, 20000);
