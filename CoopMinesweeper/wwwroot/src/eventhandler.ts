// abstract class EventHandler {
//     public static handleClick(canvas: HTMLCanvasElement, e: MouseEvent): void {
//         debugger;
//         let mousePosition: MousePosition = Helpers.getMousePosition(canvas, e);

//         if (peer.connected) {
//             if (!host) {
//                 peer.send(JSON.stringify(new ClientDataObject(mousePosition, MouseEventType.Click)));
//                 return;
//             }
//         }

//         ActionHelper.handleClick(mousePosition);
//     }

//     public static handleContextMenu(canvas: HTMLCanvasElement, e: MouseEvent): void {
//         e.preventDefault();

//         let mousePosition: MousePosition = Helpers.getMousePosition(canvas, e);

//         if (peer.connected) {
//             if (!host) {
//                 peer.send(JSON.stringify(new ClientDataObject(mousePosition, MouseEventType.Flag)));
//                 return;
//             }
//         }

//         ActionHelper.HandleFlag(mousePosition);
//     }
// }
