abstract class ServerHelper {
    public static getHostSignal(gameId: string): Promise<any> {
        return new Promise((resolve: (data: any) => any, reject: (err: Error) => any): void => {
            const data: DataModel = new DataModel(gameId);
            const request: XMLHttpRequest = new XMLHttpRequest();

            request.open("POST", "/api/game/gethostsignal", true);
            request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            request.onload = (): void => {
                if (request.status >= 200 && request.status < 400) {
                    resolve(request.responseText);
                } else {
                    // todo: implement
                    reject(new Error("It broke"));
                }
            };
            request.onerror = (evt: any): void => {
                debugger;
                reject(Error("It broke"));
                // todo: implement
            };
            request.onabort = (evt: any): void => {
                // todo: implement
                reject(Error("It broke"));
                debugger;
            };

            request.send(JSON.stringify(data));
        });
    }

    public static joinGame(clientSignal: string, clientGameId: string): Promise<any> {
        return new Promise((resolve: (data: any) => any, reject: (err: Error) => any): void => {
            const data: DataModel = new DataModel(clientSignal, clientGameId);
            const request: XMLHttpRequest = new XMLHttpRequest();

            request.open("POST", "/api/game/join", true);
            request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            request.onload = (): void => {
                if (request.status >= 200 && request.status < 400) {
                    resolve(request.responseText);
                } else {
                    // todo: implement
                    reject(Error("It broke"));
                }
            };
            request.onerror = (evt: any): void => {
                debugger;
                reject(Error("It broke"));
                // todo: implement
            };
            request.onabort = (evt: any): void => {
                // todo: implement
                reject(Error("It broke"));
                debugger;
            };

            request.send(JSON.stringify(data));
        });
    }
}
