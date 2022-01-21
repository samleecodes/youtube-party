import { RoomState, WsApi } from "common";

class WsClient {
    private ws: WebSocket | undefined;

    private state: RoomState = {
        videoId: "",
        action: {
            user: "",
            isPlay: false,
            at: 0,
        },
    };

    private localPlaybackProgress = 0;

    private roomId: string | undefined;

    private hasHandshaken = false;
    private isConnected = false;

    private baseUrl = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8080";

    private onConnectCallback: (() => void) | undefined;
    private onStateUpdateCallback: ((changedVideo: boolean) => void) | undefined;
    private onCloseCallback: (() => void) | undefined;

    public connect(
        roomId: string,
        onConnect: () => void,
        onStateUpdateCallback: (changedVideo: boolean) => void,
        onClose: () => void
    ): void {
        this.roomId = roomId;
        this.onConnectCallback = onConnect;
        this.onStateUpdateCallback = onStateUpdateCallback;
        this.onCloseCallback = onClose;

        this.ws = new WebSocket(this.baseUrl);

        this.ws.addEventListener("open", () => {
            this.onWsOpen();
        });

        this.ws.addEventListener("message", event => {
            this.onWsMessage(event);
        });

        this.ws.addEventListener("close", event => {
            console.log(event);
            this.onWsClose();
        });
    }

    public getState(): RoomState {
        return this.state;
    }

    public setPlaybackProgress(progress: number): void {
        this.localPlaybackProgress = progress;
    }

    public setIsPlaying(isPlaying: boolean): void {
        this.state.action.user = "user";
        this.state.action.isPlay = isPlaying;
        this.state.action.at = this.localPlaybackProgress;
        this.sendUpdateToServer();
    }

    public setVideoId(videoId: string): void {
        this.state.videoId = videoId;
        this.state.action.user = "user";
        this.state.action.isPlay = false;
        this.state.action.at = 0;
        this.sendUpdateToServer();
    }

    private sendUpdateToServer(): void {
        const update: WsApi.UpdatePacket = {
            state: this.state,
            updateRequest: false,
        };
        this.ws?.send(JSON.stringify(update));
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

            this.hasHandshaken = true; // For now we'll only set handshake, we'll set connected when we get first state
            return;
        }

        const update: WsApi.UpdatePacket = JSON.parse(event.data);

        if (update.state) {
            let changedVideo = false;
            if (this.state.videoId !== update.state.videoId) {
                changedVideo = true;
            }
            this.state = update.state;
            if (this.onStateUpdateCallback) {
                this.onStateUpdateCallback(changedVideo);
            }
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
