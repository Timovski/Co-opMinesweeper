abstract class Renderer {
    public static drawBackground(): void {
        gameCanvasContext.beginPath();
        gameCanvasContext.lineWidth = 2;
        gameCanvasContext.strokeStyle = "#ff0000";

        for (let xIndex: number = 1, line: number = 0; line < 32; xIndex += 32, line++) {
            gameCanvasContext.moveTo(xIndex, 0);
            gameCanvasContext.lineTo(xIndex, 514);
        }

        for (let yIndex: number = 1, line: number = 0; line < 18; yIndex += 32, line++) {
            gameCanvasContext.moveTo(0, yIndex);
            gameCanvasContext.lineTo(962, yIndex);
        }

        gameCanvasContext.stroke();
    }

    // public static revealField(field: Field): void {
    //     if (field.shown) {
    //         return;
    //     }

    //     field.shown = true;

    //     if (field.type === FieldType.Bomb) {
    //         gameCanvasContext.fillStyle = "#ff0000";
    //         gameCanvasContext.fillRect(field.startX, field.startY, 50, 50);
    //     } else if (field.type === FieldType.Number) {
    //         gameCanvasContext.fillStyle = "#FFFFFF";
    //         gameCanvasContext.fillRect(field.startX, field.startY, 50, 50);

    //         gameCanvasContext.fillStyle = "#000000";
    //         gameCanvasContext.font = "30px Georgia";
    //         gameCanvasContext.fillText(`${field.number}`, field.startX + 15, field.startY + 32);
    //     } else {
    //         gameCanvasContext.fillStyle = "#36ff00";
    //         gameCanvasContext.fillRect(field.startX, field.startY, 50, 50);
    //         Renderer.revealSurroundingFields(field);
    //     }
    // }

    // public static renderMatrix(): void {
    //     for (let row: number = 0; row < 9; row++) {
    //         for (let column: number = 0; column < 9; column++) {
    //             let field: Field = matrix[row][column];

    //             // Reset field
    //             Renderer.fillField(field, "#FFFFFF");

    //             if (field.flag) {
    //                 Renderer.fillField(field, "#001AFF");
    //                 continue;
    //             }

    //             if (!field.shown) {
    //                 continue;
    //             }

    //             if (field.type === FieldType.Bomb) {
    //                 gameCanvasContext.fillStyle = "#ff0000";
    //                 gameCanvasContext.fillRect(field.startX, field.startY, 50, 50);
    //             } else if (field.type === FieldType.Number) {
    //                 gameCanvasContext.fillStyle = "#FFFFFF";
    //                 gameCanvasContext.fillRect(field.startX, field.startY, 50, 50);

    //                 gameCanvasContext.fillStyle = "#000000";
    //                 gameCanvasContext.font = "30px Georgia";
    //                 gameCanvasContext.fillText(`${field.number}`, field.startX + 15, field.startY + 32);
    //             } else {
    //                 gameCanvasContext.fillStyle = "#36ff00";
    //                 gameCanvasContext.fillRect(field.startX, field.startY, 50, 50);
    //             }
    //         }
    //     }
    // }

    // public static revealSurroundingFields(field: Field): void {
    //     let surroundingFields: Field[] = Helpers.getSurroundingFields(field);
    //     for (let i: number = 0, len: number = surroundingFields.length; i < len; i++) {
    //         Renderer.revealField(surroundingFields[i]);
    //     }
    // }

    public static fillField(field: Field, fillStyle: string): void {
        gameCanvasContext.fillStyle = fillStyle;
        gameCanvasContext.fillRect(field.startX, field.startY, 30, 30);
    }

    // public static drawMouse(position: MousePosition): void {
    //     mouseCanvasContext.clearRect(0, 0, mouseCanvas.width, mouseCanvas.height);

    //     let field: Field = Helpers.getActiveField(position.x, position.y);
    //     mouseCanvasContext.fillStyle = "rgba(228, 0, 225, 0.4)";
    //     mouseCanvasContext.fillRect(field.startX, field.startY, 50, 50);

    //     mouseCanvasContext.drawImage(cursorImage, position.x, position.y);
    // }
}
