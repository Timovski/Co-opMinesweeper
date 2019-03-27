abstract class ClientHelper {
    public static handleGame(affectedFields: Field[], flagsLeft?: number): void {
        for (let i: number = 0, len: number = affectedFields.length; i < len; i++) {
            const field: Field = affectedFields[i];
            matrix[field.row][field.column] = field;
        }

        Renderer.drawAffectedFields(affectedFields);

        if (flagsLeft) {
            GameHelper.setFlags(flagsLeft);
        }

        if (!timerIntervalId) {
            GameHelper.startTimer();
        }
    }

    public static handleGameWon(affectedFields: Field[], elapsedTime: number): void {
        GameHelper.stopTimer();
        GameHelper.showNewGameScreen();
        GameHelper.setTimer(elapsedTime!);

        Renderer.drawAffectedFields(affectedFields);
    }

    public static handleGameOver(affectedFields: Field[], elapsedTime: number): void {
        GameHelper.stopTimer();
        GameHelper.showNewGameScreen();
        GameHelper.setTimer(elapsedTime!);

        Renderer.drawAffectedFields(affectedFields);
    }
}
