abstract class GameHelper {
    public static resetGame(): void {
        Renderer.drawBackground();
        Initializer.resetFields();
        GameHelper.setTimer(0);
        GameHelper.setFlags(99);
        GameHelper.hideOverlay();
    }

    public static hideOverlay(): void {
        overlay.style.display = "none";
        overlayStatus.style.display = "none";
        restartButton.style.display = "none";

        if (gameIdText) { // Host
            gameIdText.style.display = "none";
        }

        if (gameIdInput) { // Client
            gameIdInput.style.display = "none";
            connectButton.style.display = "none";
        }
    }

    public static showRestartScreen(): void {
        overlay.style.display = "table";
        restartButton.style.display = "inline-block";
    }

    public static showEndGameScreen(): void {
        overlay.style.display = "table";
        endGameButton.style.display = "inline-block";
        overlayStatus.style.display = "block";
        overlayStatus.innerText = "Other player has disconnected :/";
    }

    public static setFlags(numberOfFlagsLeft: number): void {
        flagsLeft = numberOfFlagsLeft;
        flagsElement.innerText = flagsLeft.toString();
    }

    public static startTimer(): void {
        timerIntervalId = setInterval(() => {
            if (elapsedTime < 999) {
                elapsedTime++;
                timerElement.innerText = `00${elapsedTime}`.slice(-3);
            }
        }, 1000);
    }

    public static stopTimer(): void {
        clearInterval(timerIntervalId);
        timerIntervalId = 0;
    }

    public static setTimer(seconds: number): void {
        elapsedTime = seconds;
        timerElement.innerText = `00${seconds}`.slice(-3);
    }
}
