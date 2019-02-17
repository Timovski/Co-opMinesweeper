let gameCanvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;
let gameCanvasContext: CanvasRenderingContext2D = gameCanvas.getContext("2d") as CanvasRenderingContext2D;

let mouseCanvas: HTMLCanvasElement = document.getElementById("mouse-canvas") as HTMLCanvasElement;
let mouseCanvasContext: CanvasRenderingContext2D = mouseCanvas.getContext("2d") as CanvasRenderingContext2D;

let cursorImage: HTMLImageElement = new Image();

let matrix: Field[][] = new Array<Field[]>(16);
let previousActiveField: Field;

abstract class HtmlHelper {
    public static initHtmlElements(): void {
        const width: number = 962;
        const height: number = 514;

        // Init game canvas
        gameCanvas.style.width = `${width}px`;
        gameCanvas.style.height = `${height}px`;
        gameCanvas.style.zIndex = "0";
        gameCanvas.style.position = "absolute";

        gameCanvas.width = width;
        gameCanvas.height = height;

        // Init mouse canvas
        mouseCanvas.style.width = `${width}px`;
        mouseCanvas.style.height = `${height}px`;
        mouseCanvas.style.zIndex = "1";
        mouseCanvas.style.position = "absolute";

        mouseCanvas.width = width;
        mouseCanvas.height = height;

        // Init cursor image
        cursorImage.src = "cursor.png";
    }

    public static initEventListeners(): void {
        mouseCanvas.addEventListener("mousemove", (e: MouseEvent): void => {
            const mousePosition: MousePosition = Helpers.getMousePosition(mouseCanvas, e);
            const field: Field = Helpers.getActiveField(mousePosition.x, mousePosition.y);

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
        });

        mouseCanvas.addEventListener("click", (e: MouseEvent): void => {
            debugger;
        });

        mouseCanvas.addEventListener("contextmenu", (e: MouseEvent): void => {
            debugger;
        });
    }
}
