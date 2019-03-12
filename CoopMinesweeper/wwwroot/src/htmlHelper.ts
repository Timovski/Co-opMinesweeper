let gameCanvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;
let gameCanvasContext: CanvasRenderingContext2D = gameCanvas.getContext("2d") as CanvasRenderingContext2D;

let mouseCanvas: HTMLCanvasElement = document.getElementById("mouse-canvas") as HTMLCanvasElement;
let mouseCanvasContext: CanvasRenderingContext2D = mouseCanvas.getContext("2d") as CanvasRenderingContext2D;

let cursorImage: HTMLImageElement = new Image();

let flagsElement: HTMLElement = document.getElementById("flags") as HTMLElement;
let timerElement: HTMLElement = document.getElementById("timer") as HTMLElement;

let matrix: Field[][] = new Array<Field[]>(16);
let previousActiveField: Field;
let gameStarted: boolean = false;
let gameEnded: boolean = false; // todo: host only

const latencyTestStamps: number[] = [];
const latencyTestResults: number[] = [];
let averageLatency: number;

// todo: host only
let flagsLeft: number = 99;

let elapsedTime: number = 0;
let timerIntervalId: number = 0;

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

    public static updateFlags(numberOfFlagsLeft: number): void {
        flagsElement.innerText = numberOfFlagsLeft.toString();
    }

    public static startTimer(): void {
        timerIntervalId = setInterval(() => {
            if (elapsedTime < 999) {
                elapsedTime++;
                timerElement.innerText = `00${elapsedTime}`.slice(-3);
            }
        }, 1000);
    }

    public static setTimer(seconds: number): void {
        elapsedTime = seconds;
        timerElement.innerText = `00${seconds}`.slice(-3);
    }

    public static stopTimer(): void {
        clearInterval(timerIntervalId);
        timerIntervalId = 0;
    }
}
