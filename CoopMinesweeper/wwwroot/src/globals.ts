// #region Game properties

let matrix: Field[][] = new Array<Field[]>(16);
let previousActiveField: Field;

let flagsLeft: number = 99;

let elapsedTime: number = 0;
let timerIntervalId: number = 0;

const latencyTestStamps: number[] = [];
const latencyTestResults: number[] = [];
let averageLatency: number;

const baseSignalrUrl: string = location.host.indexOf("coopminesweeper.com") !== -1 ? "https://api.coopminesweeper.com" : "";
const debugSimplePeer: boolean = false;

let revealedFields: number = 0;

const playerId = Math.floor(Math.random() * 10000);

// #endregion Game properties

// #region Html globals

let gameCanvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;
let gameCanvasContext: CanvasRenderingContext2D = gameCanvas.getContext("2d") as CanvasRenderingContext2D;
gameCanvas.width = gameCanvas.offsetWidth;
gameCanvas.height = gameCanvas.offsetHeight;

let mouseCanvas: HTMLCanvasElement = document.getElementById("mouse-canvas") as HTMLCanvasElement;
let mouseCanvasContext: CanvasRenderingContext2D = mouseCanvas.getContext("2d") as CanvasRenderingContext2D;
mouseCanvas.width = mouseCanvas.offsetWidth;
mouseCanvas.height = mouseCanvas.offsetHeight;

let otherMouseCanvas: HTMLCanvasElement = document.getElementById("other-mouse-canvas") as HTMLCanvasElement;
let otherMouseCanvasContext: CanvasRenderingContext2D = otherMouseCanvas.getContext("2d") as CanvasRenderingContext2D;
otherMouseCanvas.width = otherMouseCanvas.offsetWidth;
otherMouseCanvas.height = otherMouseCanvas.offsetHeight;

let cursorImage: HTMLImageElement = new Image();
cursorImage.src = "cursor.png";

let flagImage: HTMLImageElement = new Image();
flagImage.src = "flag.png";

let bombImage: HTMLImageElement = new Image();
bombImage.src = "bomb.png";

const overlay: HTMLElement = document.getElementById("overlay") as HTMLElement;
const overlayStatus: HTMLElement = document.getElementById("overlay-status") as HTMLElement;

const newGameButton: HTMLButtonElement = document.getElementById("new-game-button") as HTMLButtonElement;
const endGameButton: HTMLButtonElement = document.getElementById("end-game-button") as HTMLButtonElement;

const testLatencyButton: HTMLButtonElement = document.getElementById("test-latency-button") as HTMLButtonElement;

let flagsElement: HTMLElement = document.getElementById("flags") as HTMLElement;
let timerElement: HTMLElement = document.getElementById("timer") as HTMLElement;

// Host only
const gameIdText: HTMLElement = document.getElementById("game-id-text") as HTMLElement;
const copyToClipboardButton: HTMLButtonElement = document.getElementById("copy-to-clipboard-button") as HTMLButtonElement;

// Client only
const gameIdInput: HTMLInputElement = document.getElementById("game-id-input") as HTMLInputElement;
const connectButton: HTMLButtonElement = document.getElementById("connect-button") as HTMLButtonElement;

// #endregion Html globals
