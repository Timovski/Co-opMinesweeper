abstract class Helpers {
    public static getMousePosition(canvas: HTMLCanvasElement, e: MouseEvent): MousePosition {
        const rect: DOMRect = canvas.getBoundingClientRect() as DOMRect;
        return new MousePosition(e.clientX - rect.left, e.clientY - rect.top);
    }

    public static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
