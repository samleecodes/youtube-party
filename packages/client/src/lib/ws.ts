import { RoomState, WsApi } from "common";

class WsClient {
    private ws: WebSocket | undefined;

    private state: RoomState = {
        videoId: "",
    };

    private roomId: string | undefined;

    private hasHandshaken = false;
    private isConnected = false;

    private baseUrl = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8080";

    private onConnectCallback: (() => void) | undefined;

    private onCloseCallback: (() => void) | undefined;

    public connect(roomId: string, onConnect: () => void, onClose: () => void): void {
        this.roomId = roomId;
        this.onConnectCallback = onConnect;
        this.onCloseCallback = onClose;

        this.ws = new WebSocket(this.baseUrl);

        this.ws.addEventListener("open", () => {
            this.onWsOpen();
        });

        this.ws.addEventListener("message", event => {
            this.onWsMessage(event);
        });

        this.ws.addEventListener("close", () => {
            this.onWsClose();
        });
    }

    public getState(): RoomState {
        return this.state;
    }

    private onWsOpen(): void {
        if (!this.roomId) {
            this.ws?.close();
            return;
        }

        // Authenticate
        const auth: WsApi.AuthPacket = {
            username: "user",
            roomId: this.roomId,
        };

        this.ws?.send(JSON.stringify(auth));
    }

    private onWsMessage(event: MessageEvent): void {
        if (!this.isConnected && !this.hasHandshaken) {
            const handshake: WsApi.HandshakePacket = JSON.parse(event.data);

            if (!handshake.auth) {
                this.ws?.close();
                return;
            }

            this.hasHandshaken = true;
            return;
        }

        const stateUpdate: WsApi.StateUpdatePacket = JSON.parse(event.data);
        if (stateUpdate.state) {
            this.state = stateUpdate.state;
        }

        if (!this.isConnected) {
            this.isConnected = true;
            if (this.onConnectCallback) {
                this.onConnectCallback();
            }
        }
    }

    private onWsClose(): void {
        this.isConnected = false;
        if (this.onCloseCallback) this.onCloseCallback();
    }
}

export const wsClient = new WsClient();
