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
    public mousePosition: MousePosition | undefined;
    public serverDataType: ServerDataType | undefined;

    constructor(gameMatrix?: Field[][], mousePosition?: MousePosition, serverDataType?: ServerDataType) {
        this.gameMatrix = gameMatrix;
        this.mousePosition = mousePosition;
        this.serverDataType = serverDataType;
    }
}

enum ServerDataType {
    Game,
    MouseMove
}

class DataModel {
    public Value1: string | undefined;
    public Value2: string | undefined;

    constructor(value1?: string, value2?: string) {
        this.Value1 = value1;
        this.Value2 = value2;
    }
}
