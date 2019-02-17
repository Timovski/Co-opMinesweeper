abstract class Helpers {
    public static getActiveField(x: number, y: number): Field {
        let row: number;
        let column: number;

        if (y < 33) {
            row = 0;
        } else if (y > 480) {
            row = 15;
        } else {
            row = Math.floor((y - 1) / 32);
        }

        if (x < 33) {
            column = 0;
        } else if (x > 928) {
            column = 29;
        } else {
            column = Math.floor((x - 1) / 32);
        }

        return matrix[row][column];
    }

    public static getMousePosition(canvas: HTMLCanvasElement, e: MouseEvent): MousePosition {
        const rect: DOMRect = canvas.getBoundingClientRect() as DOMRect;
        return new MousePosition(e.clientX - rect.left, e.clientY - rect.top);
    }

    public static getSurroundingFields(field: Field): Field[] {
        const surroundingFields: Field[] = [];

        const row: number = field.row;
        const column: number = field.column;

        if (matrix[row - 1]) {
            if (matrix[row - 1][column - 1]) {
                surroundingFields.push(matrix[row - 1][column - 1]);
            }
            if (matrix[row - 1][column]) {
                surroundingFields.push(matrix[row - 1][column]);
            }
            if (matrix[row - 1][column + 1]) {
                surroundingFields.push(matrix[row - 1][column + 1]);
            }
        }

        if (matrix[row][column - 1]) {
            surroundingFields.push(matrix[row][column - 1]);
        }
        if (matrix[row][column + 1]) {
            surroundingFields.push(matrix[row][column + 1]);
        }

        if (matrix[row + 1]) {
            if (matrix[row + 1][column - 1]) {
                surroundingFields.push(matrix[row + 1][column - 1]);
            }
            if (matrix[row + 1][column]) {
                surroundingFields.push(matrix[row + 1][column]);
            }
            if (matrix[row + 1][column + 1]) {
                surroundingFields.push(matrix[row + 1][column + 1]);
            }
        }

        return surroundingFields;
    }

    public static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
