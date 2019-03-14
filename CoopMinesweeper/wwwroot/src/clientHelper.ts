abstract class ClientHelper {
    public static handleGame(affectedFields: Field[], flagsLeft?: number): void {
        for (let i: number = 0, len: number = affectedFields.length; i < len; i++) {
            const field: Field = affectedFields[i];

            matrix[field.row][field.column] = field;

            // todo: Think of a better solution for this problem
            if (previousActiveField && previousActiveField.row === field.row && previousActiveField.column === field.column) {
                previousActiveField = field;
            }
        }

        Renderer.drawAffectedFields(affectedFields);

        if (flagsLeft) {
            GameHelper.setFlags(flagsLeft);
        }

        if (!timerIntervalId) {
            GameHelper.startTimer();
        }
    }

    public static handleGameOver(affectedFields: Field[], elapsedTime: number): void {
        GameHelper.showRestartScreen();
        GameHelper.stopTimer();
        GameHelper.setTimer(elapsedTime!);

        Renderer.drawAffectedFields(affectedFields);
    }
}
