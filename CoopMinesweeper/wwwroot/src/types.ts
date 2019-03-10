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
    public mousePosition!: MousePosition;
    public clientEventType: ClientEventType;

    constructor(clientEventType: ClientEventType);
    constructor(clientEventType: ClientEventType, mousePosition: MousePosition);
    constructor(clientEventType: ClientEventType, mousePosition?: MousePosition) {
        if (mousePosition) {
            this.mousePosition = mousePosition;
        }

        this.clientEventType = clientEventType;
    }
}

enum ClientEventType {
    Move,
    Click,
    Flag,
    Reset
}

class ServerDataObject {
    public affectedFields!: Field[];
    public mousePosition!: MousePosition;
    public serverEventType: ServerEventType;

    constructor(serverEventType: ServerEventType);
    constructor(serverEventType: ServerEventType, mousePosition: MousePosition);
    constructor(serverEventType: ServerEventType, affectedFields: Field[]);
    constructor(serverEventType: ServerEventType, arg?: MousePosition | Field[]) {
        if (arg) {
            if (arg instanceof MousePosition) {
                this.mousePosition = arg;
            } else {
                this.affectedFields = arg;
            }
        }

        this.serverEventType = serverEventType;
    }
}

enum ServerEventType {
    Move,
    Game,
    GameOver,
    Reset
}
