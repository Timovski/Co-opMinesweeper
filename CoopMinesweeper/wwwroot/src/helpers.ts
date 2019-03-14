abstract class Helpers {
    public static getMousePosition(canvas: HTMLCanvasElement, e: MouseEvent): MousePosition {
        const rect: DOMRect = canvas.getBoundingClientRect() as DOMRect;
        return new MousePosition(e.clientX - rect.left, e.clientY - rect.top);
    }

    public static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static processLatency(stamp: number): void {
        const t0: number = latencyTestStamps[stamp];
        const t1: number = performance.now();
        latencyTestResults[stamp] = t1 - t0;

        if (stamp === 3) {
            averageLatency = (latencyTestResults[1] + latencyTestResults[2] + latencyTestResults[3]) / 3;
            alert(`The latency is ${averageLatency} milliseconds.`);
        }
    }
}
