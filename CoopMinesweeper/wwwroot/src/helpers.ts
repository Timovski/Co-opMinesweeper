abstract class Helpers {
    public static getMousePosition(canvas: HTMLCanvasElement, e: MouseEvent): MousePosition {
        const rect: DOMRect = canvas.getBoundingClientRect() as DOMRect;
        return new MousePosition(e.clientX - rect.left, e.clientY - rect.top);
    }

    public static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static scrollIntoView(): void {
        let clientWidth: number = 0;
        if (window.document.documentElement && window.document.documentElement.clientWidth) {
            clientWidth = window.document.documentElement.clientWidth;
        }

        const screenWidth: number = Math.max(clientWidth, window.innerWidth || 0);
        if (screenWidth && screenWidth < 1162) {
            const position: number = 581 - (screenWidth / 2);
            scrollTo(position, 0);
        }
    }

    public static copyToClipboard(str: string): void {
        const el: HTMLTextAreaElement = document.createElement("textarea");
        el.value = str;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
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
