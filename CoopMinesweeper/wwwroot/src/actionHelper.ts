abstract class ActionHelper {
    public static handleClick(field: Field): Field[] {
        if (!gameStarted) {
            gameStarted = true;

            Initializer.markStartingFields(field);
            Initializer.createBombs();
            Initializer.createNumbers();

            if (!timerIntervalId) { // todo: Because the timer could’ve been set by a flag before the game began
                HtmlHelper.startTimer();
            }
        }

        // if (field.revealed || field.flag) {
        //     return [];
        // }

        if (field.type === FieldType.Bomb) {
            hostOverlay.style.display = "table";
            hostRestartButton.style.display = "inline-block";

            gameEnded = true;
            HtmlHelper.stopTimer();
            return Initializer.getAllBombs();
        }

        const affectedFields: Field[] = [];
        Renderer.revealField(field, affectedFields);
        return affectedFields;
    }

    public static HandleFlag(field: Field): Field[] {
        // if (field.revealed) {
        //     return [];
        // }

        if (!timerIntervalId) {
            HtmlHelper.startTimer();
        }

        flagsLeft += field.flag ? 1 : -1;
        HtmlHelper.updateFlags(flagsLeft);

        field.flag = !field.flag;
        return [field];
    }
}
