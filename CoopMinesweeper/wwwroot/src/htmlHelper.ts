let gameCanvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;
let gameCanvasContext: CanvasRenderingContext2D = gameCanvas.getContext("2d") as CanvasRenderingContext2D;

let mouseCanvas: HTMLCanvasElement = document.getElementById("mouse-canvas") as HTMLCanvasElement;
let mouseCanvasContext: CanvasRenderingContext2D = mouseCanvas.getContext("2d") as CanvasRenderingContext2D;

let cursorImage: HTMLImageElement = new Image();

let matrix: Field[][] = new Array<Field[]>(16);
let previousActiveField: Field;
let gameStarted: boolean = false;
let gameEnded: boolean = false;

abstract class HtmlHelper {
    public static initHtmlElements(): void {
        const width: number = 962;
        const height: number = 514;

        // Init game canvas
        gameCanvas.style.width = `${width}px`;
        gameCanvas.style.height = `${height}px`;
        gameCanvas.style.zIndex = "0";
        gameCanvas.style.position = "absolute";

        gameCanvas.width = width;
        gameCanvas.height = height;

        // Init mouse canvas
        mouseCanvas.style.width = `${width}px`;
        mouseCanvas.style.height = `${height}px`;
        mouseCanvas.style.zIndex = "1";
        mouseCanvas.style.position = "absolute";

        mouseCanvas.width = width;
        mouseCanvas.height = height;

        // Init cursor image
        cursorImage.src = "cursor.png";
    }
}
