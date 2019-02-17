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

    // public static markStartingFields(field: Field): void {
    //     field.type = FieldType.NoBomb;

    //     let surroundingFields: Field[] = Helpers.getSurroundingFields(field);
    //     surroundingFields.forEach((x: Field) => {
    //         x.type = FieldType.NoBomb;
    //     });
    // }

    // public static createBombs(): void {
    //     let numberOfBombs: number = 0;
    //     while (numberOfBombs < 10) {
    //         let row: number = Helpers.getRandomInt(0, 8);
    //         let column: number = Helpers.getRandomInt(0, 8);

    //         if (matrix[row][column].type === FieldType.Bomb) {
    //             continue;
    //         }

    //         if (matrix[row][column].type === FieldType.NoBomb) {
    //             continue;
    //         }

    //         matrix[row][column].type = FieldType.Bomb;
    //         numberOfBombs++;
    //     }
    // }

    // public static createNumbers(): void {
    //     for (let row: number = 0; row < 9; row++) {
    //         for (let column: number = 0; column < 9; column++) {
    //             let field: Field = matrix[row][column];

    //             if (field.type === FieldType.Bomb) {
    //                 continue;
    //             }

    //             let surroundingFields: Field[] = Helpers.getSurroundingFields(field);
    //             let bombs: number = surroundingFields.reduce((accumulator: number, currentField: Field) => {
    //                 return accumulator + (currentField.type === FieldType.Bomb ? 1 : 0);
    //             }, 0);

    //             if (bombs === 0) {
    //                 field.type = FieldType.Empty;
    //             } else {
    //                 field.type = FieldType.Number;
    //                 field.number = bombs;
    //             }
    //         }
    //     }
    // }
}
