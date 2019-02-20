declare class signalR {
    start(): Promise<void>;
    stop(): Promise<void>;
    invoke(methodName: string, ...args: any[]): Promise<any>;
    on(methodName: string, newMethod: (...args: any[]) => void): void;
    static HubConnectionBuilder: any;
    serverTimeoutInMilliseconds: number;
}