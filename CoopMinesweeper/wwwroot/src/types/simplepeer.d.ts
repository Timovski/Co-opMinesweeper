declare class SimplePeer {
    connected: boolean;
    on(eventName: "error" | "signal" | "connect" | "data", callback: (data: any) => void): void;
    signal(data: any): void;
    send(data: any): void;
    constructor(options: { initiator: boolean; trickle: boolean; });
}