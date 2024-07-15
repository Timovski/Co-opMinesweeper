abstract class Renderer {
    public static drawBackground(): void {
        gameCanvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        gameCanvasContext.beginPath();
        gameCanvasContext.lineWidth = 2;
        gameCanvasContext.strokeStyle = "rgba(255, 255, 255, 1)";

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

    public static renderMouseMove(field: Field): void {
        // Optimization: if the mouse moved but it is still in the same filed we don’t need to draw anything so just stop the function
        if (field === previousActiveField) {
            return;
        }

        if (previousActiveField) {
            mouseCanvasContext.clearRect(previousActiveField.startX, previousActiveField.startY, 30, 30);
        }

        previousActiveField = field;

        mouseCanvasContext.fillStyle = "rgba(255, 255, 255, 0.5)";
        mouseCanvasContext.fillRect(field.startX, field.startY, 30, 30);
    }

    // todo: Definitely move this method in some other helper for the client only
    public static drawAffectedFields(affectedFields: Field[]): void {
        for (let i: number = 0, len: number = affectedFields.length; i < len; i++) {
            const field: Field = affectedFields[i];

            // Reset field
            gameCanvasContext.clearRect(field.startX, field.startY, 30, 30);

            if (field.flag) {
                gameCanvasContext.drawImage(flagImage, field.startX, field.startY);
                continue;
            }

            if (!field.revealed) {
                continue;
            }

            if (field.type === FieldType.Bomb) {
                Renderer.fillField(field, "rgba(203, 66, 66, 1)");

                gameCanvasContext.drawImage(bombImage, field.startX, field.startY);
            } else if (field.type === FieldType.Number) {
                Renderer.fillField(field, "rgba(194, 219, 198, 1)");

                gameCanvasContext.fillStyle = "rgb(0, 0, 0)";
                gameCanvasContext.font = "20px Arial, Helvetica, sans-serif";
                gameCanvasContext.fillText(`${field.number}`, field.startX + 9, field.startY + 23);
            } else {
                Renderer.fillField(field, "rgba(194, 219, 198, 1)");
            }
        }
    }

    public static fillField(field: Field, fillStyle: string): void {
        gameCanvasContext.fillStyle = fillStyle;
        gameCanvasContext.fillRect(field.startX, field.startY, 30, 30);
    }

    private static positions: { [key: number]: MousePosition } = {};

    public static drawMouse(position: MousePosition, otherPlayerId: number): void {
        otherMouseCanvasContext.clearRect(0, 0, otherMouseCanvas.width, otherMouseCanvas.height);

        this.positions[otherPlayerId] = position;
        
        for (let key in this.positions) {
            const position: MousePosition = this.positions[key];
            const field: Field = FieldHelper.getField(position.x, position.y);
            otherMouseCanvasContext.fillStyle = "rgba(255, 255, 255, 0.5)";
            otherMouseCanvasContext.fillRect(field.startX, field.startY, 30, 30);

            otherMouseCanvasContext.drawImage(cursorImage, position.x, position.y);
        }
    }
}
