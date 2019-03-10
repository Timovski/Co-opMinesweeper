declare class signalR {
    static LogLevel: any;
    onclose(callback: (error?: Error) => void): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    invoke(methodName: string, ...args: any[]): Promise<any>;
    on(methodName: string, newMethod: (...args: any[]) => void): void;
    static HubConnectionBuilder: any;
    serverTimeoutInMilliseconds: number;
}