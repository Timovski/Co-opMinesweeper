declare class signalR {
    stop(): any;
    invoke(arg0: string, user: any, message: any): any;
    start(): any;
    on(arg0: string, arg1: (user: any, message: any) => void): any;
    static HubConnectionBuilder: any;
}