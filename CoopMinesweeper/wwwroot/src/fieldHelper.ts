abstract class FieldHelper {
    public static initializeFields(): void {
        let y: number = 2;
        for (let row: number = 0; row < 16; row++) {
            matrix[row] = new Array<Field>(30);
            let x: number = 2;
            for (let column: number = 0; column < 30; column++) {
                matrix[row][column] = new Field(x, y, row, column);
                x += 32;
            }

            y += 32;
        }
    }

    public static getField(x: number, y: number): Field {
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

    public static getFieldsForReveal(field: Field, allFields: Field[]): void {
        field.revealed = true;
        allFields.push(field);

        if (field.flag || field.type === FieldType.Bomb || field.type === FieldType.Number) {
            return;
        } else {
            const surroundingFields: Field[] = FieldHelper.getSurroundingFieldsForReveal(field);
            for (let i: number = 0, len: number = surroundingFields.length; i < len; i++) {
                FieldHelper.getFieldsForReveal(surroundingFields[i], allFields);
            }
        }
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

            const topRight: Field = matrix[row - 1][column + 1];
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

    public static resetFields(): void {
        let field: Field;
        for (let row: number = 0; row < 16; row++) {
            for (let column: number = 0; column < 30; column++) {
                field = matrix[row][column];

                field.number = 0;
                field.revealed = false;
                field.flag = false;
                field.type = FieldType.None;
            }
        }
    }

    public static markStartingFields(field: Field): void {
        field.type = FieldType.NoBomb;

        const surroundingFields: Field[] = FieldHelper.getSurroundingFields(field);
        for (let i: number = 0, len: number = surroundingFields.length; i < len; i++) {
            surroundingFields[i].type = FieldType.NoBomb;
        }
    }

    // todo: Optimize this
    public static createBombs(): void {
        let numberOfBombs: number = 0;
        let row: number;
        let column: number;

        while (numberOfBombs < 99) {
            row = Helpers.getRandomInt(0, 15);
            column = Helpers.getRandomInt(0, 29);

            if (matrix[row][column].type === FieldType.Bomb) {
                continue;
            }

            if (matrix[row][column].type === FieldType.NoBomb) {
                continue;
            }

            matrix[row][column].type = FieldType.Bomb;
            numberOfBombs++;
        }
    }

    public static createNumbers(): void {
        let field: Field;
        let bombs: number;
        let surroundingFields: Field[];

        for (let row: number = 0; row < 16; row++) {
            for (let column: number = 0; column < 30; column++) {
                field = matrix[row][column];

                if (field.type === FieldType.Bomb) {
                    continue;
                }

                surroundingFields = FieldHelper.getSurroundingFields(field);
                bombs = surroundingFields.reduce((accumulator: number, currentField: Field) => {
                    return accumulator + (currentField.type === FieldType.Bomb ? 1 : 0);
                }, 0);

                if (bombs === 0) {
                    field.type = FieldType.Empty;
                } else {
                    field.type = FieldType.Number;
                    field.number = bombs;
                }
            }
        }
    }

    public static getAllBombs(): Field[] {
        let field: Field;
        const fields: Field[] = [];

        for (let row: number = 0; row < 16; row++) {
            for (let column: number = 0; column < 30; column++) {
                field = matrix[row][column];

                if (field.type === FieldType.Bomb) {
                    field.revealed = true;
                    fields.push(field);
                }
            }
        }

        return fields;
    }
}
