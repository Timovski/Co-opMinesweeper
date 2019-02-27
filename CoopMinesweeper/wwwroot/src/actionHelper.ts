abstract class ActionHelper {
    public static handleClick(mousePosition: MousePosition): void {
        const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);
        // if (!gameStarted) {
        //     gameStarted = true;

        //     Initializer.markStartingFields(field);
        //     Initializer.createBombs();
        //     Initializer.createNumbers();
        // }

        if (field.revealed || field.flag) {
            return;
        }

        // Renderer.revealField(field);

        // ConnectionHelper.sendGameData();
    }

    public static HandleFlag(mousePosition: MousePosition): void {
        const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);

        if (field.revealed) {
            return;
        }

        field.flag = !field.flag;
        if (field.flag) {
            Renderer.fillField(field, "#001AFF");
        } else {
            Renderer.fillField(field, "#FFFFFF");
        }

        // ConnectionHelper.sendGameData();
    }
}
