import { Observable } from 'rxjs';
export declare class Cable {
    url: string;
    params?: any;
    baseCable: any;
    private disconnectedSource;
    constructor(url: string, params?: any);
    /**
     * Create a new subscription to a channel, optionally with topic parameters.
     */
    channel(name: string, params?: {}): Channel;
    /**
     * Emits when the WebSocket connection is closed.
     */
    disconnected(): Observable<any>;
    /**
     * Close the connection.
     */
    disconnect(): void;
    protected buildUrl(url: string, params?: any): string;
}
export declare class Channel {
    cable: Cable;
    name: string;
    params: {};
    baseChannel: any;
    messages: Observable<any>;
    private initializedSource;
    private connectedSource;
    private disconnectedSource;
    private rejectedSource;
    private eventTypes;
    constructor(cable: Cable, name: string, params?: {});
    /**
     * Emits messages that have been broadcast to the channel.
     * For easy clean-up, when this Observable is completed the ActionCable channel will also be closed.
     */
    received(): Observable<any>;
    /**
     * Emits when the subscription is initialized.
     */
    initialized(): Observable<any>;
    /**
     * Emits when the subscription is ready for use on the server.
     */
    connected(): Observable<any>;
    /**
     * Emits when the WebSocket connection is closed.
     */
    disconnected(): Observable<any>;
    /**
     * Emits when the subscription is rejected by the server.
     */
    rejected(): Observable<any>;
    /**
     * Broadcast message to other clients subscribed to this channel.
     */
    send(data: any): void;
    /**
     * Perform a channel action with the optional data passed as an attribute.
     */
    perform(action: string, data?: any): void;
    /**
     * Unsubscribe from the channel.
     */
    unsubscribe(): void;
}
