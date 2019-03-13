abstract class ActionHelper {
    public static handleClick(field: Field): void {
        if (!gameStarted) {
            gameStarted = true;

            Initializer.markStartingFields(field);
            Initializer.createBombs();
            Initializer.createNumbers();

            if (!timerIntervalId) {
                GameHelper.startTimer();
            }
        }

        // if (field.revealed || field.flag) {
        //     return [];
        // }

        let affectedFields: Field[] = [];
        if (field.type === FieldType.Bomb) {
            GameHelper.showRestartScreen();

            GameHelper.stopTimer();
            affectedFields = Initializer.getAllBombs();
            peer.send(JSON.stringify(new ServerDataObject(ServerEventType.GameOver, affectedFields, elapsedTime)));
        } else {
            ActionHelper.revealField(field, affectedFields);
            peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Game, affectedFields)));
        }

        Renderer.drawAffectedFields(affectedFields);
    }

    public static handleFlag(field: Field): void {
        // if (field.revealed) {
        //     return [];
        // }

        if (!timerIntervalId) {
            GameHelper.startTimer();
        }

        flagsLeft += field.flag ? 1 : -1;
        GameHelper.setFlags(flagsLeft);

        field.flag = !field.flag;

        const affectedFields: Field[] = [field];
        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Game, affectedFields, flagsLeft)));
        Renderer.drawAffectedFields(affectedFields);
    }

    public static restartGame(): void {
        GameHelper.resetGame();

        gameStarted = false;

        peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Reset)));
    }

    private static revealField(field: Field, allFields: Field[]): void {
        field.revealed = true;
        allFields.push(field);

        if (field.flag || field.type === FieldType.Bomb || field.type === FieldType.Number) {
            return;
        } else {
            const surroundingFields: Field[] = Helpers.getSurroundingFieldsForReveal(field);
            for (let i: number = 0, len: number = surroundingFields.length; i < len; i++) {
                ActionHelper.revealField(surroundingFields[i], allFields);
            }
        }
    }
}
