abstract class HostHelper {
    public static handleClick(field: Field): void {
        if (!gameStarted) {
            gameStarted = true;

            FieldHelper.markStartingFields(field);
            FieldHelper.createBombs();
            FieldHelper.createNumbers();

            if (!timerIntervalId) {
                GameHelper.startTimer();
            }
        }

        // if (field.revealed || field.flag) {
        //     return [];
        // }

        let affectedFields: Field[] = [];
        if (field.type === FieldType.Bomb) {
            GameHelper.stopTimer();
            GameHelper.showNewGameScreen();
            affectedFields = FieldHelper.getAllBombs();
            peers.forEach((peer: SimplePeer) => {
                peer.send(JSON.stringify(new ServerDataObject(ServerEventType.GameOver, affectedFields, elapsedTime)));
            });
        } else {
            FieldHelper.getFieldsForReveal(field, affectedFields);
            revealedFields += affectedFields.length;
            if (revealedFields === 381) {
                GameHelper.stopTimer();
                GameHelper.showNewGameScreen();
                peers.forEach((peer: SimplePeer) => {
                    peer.send(JSON.stringify(new ServerDataObject(ServerEventType.GameWon, affectedFields, elapsedTime)));
                });
            } else {
                peers.forEach((peer: SimplePeer) => {
                    peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Game, affectedFields)));
                });
            }
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
        peers.forEach((peer: SimplePeer) => {
            peer.send(JSON.stringify(new ServerDataObject(ServerEventType.Game, affectedFields, flagsLeft)));
        });
        Renderer.drawAffectedFields(affectedFields);
    }

    public static startNewGame(): void {
        GameHelper.resetGame();
        gameStarted = false;
        revealedFields = 0;
        peers.forEach((peer: SimplePeer) => {
            peer.send(JSON.stringify(new ServerDataObject(ServerEventType.NewGame)));
        });
    }
}
