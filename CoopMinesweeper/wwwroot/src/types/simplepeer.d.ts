declare class SimplePeer {
    connected: boolean;
    _debug: any;
    on(eventName: "error" | "close" | "signal" | "connect" | "data", callback: (data: any) => void): void;
    signal(data: any): void;
    send(data: any): void;
    constructor(options: { initiator: boolean; trickle: boolean; config?: any });
}