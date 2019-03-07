// todo: This should be probably moved to host only
abstract class Initializer {
    public static initFields(): void {
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

    public static markStartingFields(field: Field): void {
        field.type = FieldType.NoBomb;

        const surroundingFields: Field[] = Helpers.getSurroundingFields(field);
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

                surroundingFields = Helpers.getSurroundingFields(field);
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
