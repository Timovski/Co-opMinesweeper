class Field {
    public startX: number;
    public startY: number;

    public row: number;
    public column: number;

    public number: number;
    public revealed: boolean;
    public flag: boolean;
    public type: FieldType;

    constructor(x: number, y: number, row: number, column: number) {
        this.startX = x;
        this.startY = y;

        this.row = row;
        this.column = column;

        this.number = 0;
        this.revealed = false;
        this.flag = false;
        this.type = FieldType.None;
    }
}

enum FieldType {
    None,
    NoBomb,
    Empty,
    Number,
    Bomb
}

class MousePosition {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class ClientDataObject {
    public mousePosition: MousePosition;
    public mouseEventType: MouseEventType;

    constructor(mousePosition: MousePosition, mouseEventType: MouseEventType) {
        this.mousePosition = mousePosition;
        this.mouseEventType = mouseEventType;
    }
}

enum MouseEventType {
    Move,
    Click,
    Flag
}

class ServerDataObject {
    public gameMatrix: Field[][] | undefined;
    public mousePosition!: MousePosition;
    public serverDataType!: ServerDataType;

    constructor(mousePosition: MousePosition, serverDataType: ServerDataType)
    constructor(gameMatrix: Field[][], serverDataType: ServerDataType)
    constructor(arg: MousePosition | Field[][], serverDataType: ServerDataType) {
        if (arg instanceof MousePosition) {
            this.mousePosition = arg;
        } else {
            this.gameMatrix = arg;
        }
        this.serverDataType = serverDataType;
    }
}

enum ServerDataType {
    MouseMove,
    Game
}
