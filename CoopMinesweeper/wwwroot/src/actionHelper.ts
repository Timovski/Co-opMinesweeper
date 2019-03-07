abstract class ActionHelper {
    public static handleClick(field: Field): Field[] {
        if (!gameStarted) {
            gameStarted = true;

            Initializer.markStartingFields(field);
            Initializer.createBombs();
            Initializer.createNumbers();
        }

        if (field.revealed || field.flag) {
            return [];
        }

        if (field.type === FieldType.Bomb) {
            gameEnded = true;
            return Initializer.getAllBombs();
        }

        const affectedFields: Field[] = [];
        Renderer.revealField(field, affectedFields);
        return affectedFields;
    }

    public static HandleFlag(field: Field): Field[] {
        if (field.revealed) {
            return [];
        }

        field.flag = !field.flag;
        return [field];
    }
}
