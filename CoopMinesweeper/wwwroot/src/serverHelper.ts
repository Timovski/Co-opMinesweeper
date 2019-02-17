abstract class ServerHelper {
    public static getHostSignal(gameId: string): Promise<string> {
        return new Promise((resolve: (data: string) => void, reject: (err: any) => void): void => {
            const data: DataModel = new DataModel(gameId);
            const request: XMLHttpRequest = new XMLHttpRequest();

            request.open("POST", "/api/game/gethostsignal", true);
            request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            request.onload = (): void => {
                if (request.status >= 200 && request.status < 400) {
                    resolve(request.responseText);
                } else {
                    reject("error");
                }
            };
            request.onerror = (evt: any): void => {
                debugger;
                reject("error");
                // There was a connection error of some sort
            };
            request.onabort = (evt: any): void => {
                // There was a connection error of some sort
                reject("error");
                debugger;
            };

            request.send(JSON.stringify(data));
        });
    }
}
