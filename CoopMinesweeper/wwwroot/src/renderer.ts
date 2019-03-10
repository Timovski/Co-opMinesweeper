abstract class Renderer {
    public static drawBackground(): void {
        gameCanvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

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

    public static renderMouseMove(field: Field): void {
        // Optimization: if the mouse moved but it is still in the same filed we don’t need to draw anything so just stop the function
        if (field === previousActiveField) {
            return;
        }

        // If we moved to another field check if the previous filed needs to be reverted to its default color.
        // Since only unrevealed fields (not revealed and not a flag) are filled when the mouse moves,
        // check if this is a unrevealed field and if it is, revert its color back to the default one.
        if (previousActiveField && !previousActiveField.revealed && !previousActiveField.flag) {
            Renderer.fillField(previousActiveField, "#FFFFFF");
        }

        // Set the new previousActiveField.
        previousActiveField = field;

        // If the field is revealed or a flag we don’t draw on it so stop the function.
        if (field.revealed || field.flag) {
            return;
        }

        // If the field is not reveled and not a flag, color the field.
        Renderer.fillField(field, "#787878");
    }

    // todo: Definitely move this method in some other helper for the client only
    public static drawAffectedFields(affectedFields: Field[]): void {
        for (let i: number = 0, len: number = affectedFields.length; i < len; i++) {
            const field: Field = affectedFields[i];

            // Reset field
            Renderer.fillField(field, "#FFFFFF");

            if (field.flag) {
                Renderer.fillField(field, "#001AFF");
                continue;
            }

            if (!field.revealed) {
                continue;
            }

            if (field.type === FieldType.Bomb) {
                gameCanvasContext.fillStyle = "#ff0000";
                gameCanvasContext.fillRect(field.startX, field.startY, 30, 30);
            } else if (field.type === FieldType.Number) {
                gameCanvasContext.fillStyle = "#FFFFFF";
                gameCanvasContext.fillRect(field.startX, field.startY, 30, 30);

                gameCanvasContext.fillStyle = "#000000";
                gameCanvasContext.font = "20px Georgia";
                gameCanvasContext.fillText(`${field.number}`, field.startX + 10, field.startY + 20);
            } else {
                gameCanvasContext.fillStyle = "#36ff00";
                gameCanvasContext.fillRect(field.startX, field.startY, 30, 30);
            }
        }
    }

    public static revealField(field: Field, allFields: Field[]): void {
        field.revealed = true;
        allFields.push(field);

        if (field.flag || field.type === FieldType.Bomb || field.type === FieldType.Number) {
            return;
        } else {
            const surroundingFields: Field[] = Helpers.getSurroundingFieldsForReveal(field);
            for (let i: number = 0, len: number = surroundingFields.length; i < len; i++) {
                Renderer.revealField(surroundingFields[i], allFields);
            }
        }
    }

    public static fillField(field: Field, fillStyle: string): void {
        gameCanvasContext.fillStyle = fillStyle;
        gameCanvasContext.fillRect(field.startX, field.startY, 30, 30);
    }

    public static drawMouse(position: MousePosition): void {
        mouseCanvasContext.clearRect(0, 0, mouseCanvas.width, mouseCanvas.height);

        const field: Field = Helpers.getActiveField(position.x, position.y);
        mouseCanvasContext.fillStyle = "rgba(228, 0, 225, 0.4)";
        mouseCanvasContext.fillRect(field.startX, field.startY, 30, 30);

        mouseCanvasContext.drawImage(cursorImage, position.x, position.y);
    }
}
