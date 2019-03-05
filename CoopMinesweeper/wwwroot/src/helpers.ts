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

            surroundingFields.push(matrix[row - 1][column]);

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

            surroundingFields.push(matrix[row + 1][column]);

            if (matrix[row + 1][column + 1]) {
                surroundingFields.push(matrix[row + 1][column + 1]);
            }
        }

        return surroundingFields;
    }

    public static getSurroundingFieldsForReveal(field: Field): Field[] {
        const surroundingFields: Field[] = [];

        const row: number = field.row;
        const column: number = field.column;

        if (matrix[row - 1]) {
            const topLeft: Field = matrix[row - 1][column - 1];
            if (topLeft && !topLeft.revealed && !topLeft.flag) {
                topLeft.revealed = true;
                surroundingFields.push(topLeft);
            }

            const topCenter: Field = matrix[row - 1][column];
            if (!topCenter.revealed && !topCenter.flag) {
                topCenter.revealed = true;
                surroundingFields.push(topCenter);
            }

            const topRight: Field = matrix[row - 1][column];
            if (topRight && !topRight.revealed && !topRight.flag) {
                topRight.revealed = true;
                surroundingFields.push(topRight);
            }
        }

        const left: Field = matrix[row][column - 1];
        if (left && !left.revealed && !left.flag) {
            left.revealed = true;
            surroundingFields.push(left);
        }

        const right: Field = matrix[row][column + 1];
        if (right && !right.revealed && !right.flag) {
            right.revealed = true;
            surroundingFields.push(right);
        }

        if (matrix[row + 1]) {
            const bottomLeft: Field = matrix[row + 1][column - 1];
            if (bottomLeft && !bottomLeft.revealed && !bottomLeft.flag) {
                bottomLeft.revealed = true;
                surroundingFields.push(bottomLeft);
            }

            const bottomCenter: Field = matrix[row + 1][column];
            if (!bottomCenter.revealed && !bottomCenter.flag) {
                bottomCenter.revealed = true;
                surroundingFields.push(bottomCenter);
            }

            const bottomRight: Field = matrix[row + 1][column + 1];
            if (bottomRight && !bottomRight.revealed && !bottomRight.flag) {
                bottomRight.revealed = true;
                surroundingFields.push(bottomRight);
            }
        }

        return surroundingFields;
    }

    public static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
