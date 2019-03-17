let matrix: Field[][] = new Array<Field[]>(16);
let previousActiveField: Field;

let flagsLeft: number = 99;

let elapsedTime: number = 0;
let timerIntervalId: number = 0;

const latencyTestStamps: number[] = [];
const latencyTestResults: number[] = [];
let averageLatency: number;

const baseSignalrUrl: string = location.host.indexOf("coopminesweeper.com") !== -1 ? "https://api.coopminesweeper.com" : "";

// Html globals
let gameCanvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;
let gameCanvasContext: CanvasRenderingContext2D = gameCanvas.getContext("2d") as CanvasRenderingContext2D;
gameCanvas.width = gameCanvas.offsetWidth;
gameCanvas.height = gameCanvas.offsetHeight;

let mouseCanvas: HTMLCanvasElement = document.getElementById("mouse-canvas") as HTMLCanvasElement;
let mouseCanvasContext: CanvasRenderingContext2D = mouseCanvas.getContext("2d") as CanvasRenderingContext2D;
mouseCanvas.width = mouseCanvas.offsetWidth;
mouseCanvas.height = mouseCanvas.offsetHeight;

let cursorImage: HTMLImageElement = new Image();
cursorImage.src = "cursor.png";

const overlay: HTMLElement = document.getElementById("overlay") as HTMLElement;
const overlayStatus: HTMLElement = document.getElementById("overlay-status") as HTMLElement;

const restartButton: HTMLElement = document.getElementById("restart-button") as HTMLElement;
const endGameButton: HTMLElement = document.getElementById("end-game-button") as HTMLElement;

const testLatencyButton: HTMLElement = document.getElementById("test-latency-button") as HTMLElement;

let flagsElement: HTMLElement = document.getElementById("flags") as HTMLElement;
let timerElement: HTMLElement = document.getElementById("timer") as HTMLElement;

// Host only
const gameIdText: HTMLElement = document.getElementById("game-id-text") as HTMLElement;

// Client only
const gameIdInput: HTMLInputElement = document.getElementById("game-id-input") as HTMLInputElement;
const connectButton: HTMLElement = document.getElementById("connect-button") as HTMLElement;
