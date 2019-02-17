declare class signalR {
    stop(): any;
    invoke(arg0: string, user: any, message?: any): Promise<string>;
    start(): Promise<void>;
    on(arg0: string, arg1: (user: any, message: any) => void): any;
    static HubConnectionBuilder: any;
}