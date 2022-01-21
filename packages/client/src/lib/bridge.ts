import { createSignal } from "solid-js";
import { httpApiClient } from "./http";
import { youTubePlayer } from "./player";
import { wsClient } from "./ws";

// Reactive state variables for UI rendering use only
export const [lastActionUi, setLastActionUi] = createSignal<string>("null");
export const [roomIdUi, setRoomIdUi] = createSignal<string>("");
export const [showPlayer, setShowPlayer] = createSignal<boolean>(false);

class Bridge {
    public async createRoom(): Promise<void> {
        const roomId = await httpApiClient.createRoom();
        setRoomIdUi(roomId);
        setShowPlayer(true);
        wsClient.connect(roomId, this.onWsConnect.bind(this), this.onWsUpdate.bind(this), this.onWsClose.bind(this));
    }

    public async joinRoom(roomId: string): Promise<void> {
        setRoomIdUi(roomId);
        setShowPlayer(true);
        wsClient.connect(roomId, this.onWsConnect.bind(this), this.onWsUpdate.bind(this), this.onWsClose.bind(this));
    }

    private onPlayerReady(): void {
        this.onWsUpdate(); // Manually trigger the routine to sync player with state
    }

    private onPlayerStateUpdate(event: YT.PlayerStateChangeEvent): void {
        // Run diff check against network state
        // The diff check will determine whether to send out an update
        console.log(event);
        const state = wsClient.getState();
        if (event.data === 0 || event.data === 2) {
            if (state.action.isPlay) {
                wsClient.setIsPlaying(false);
            }
        }
        if (event.data === 1) {
            if (!state.action.isPlay) {
                wsClient.setIsPlaying(true);
            }
        }
    }

    private onPlayerPlaybackProgressUpdate(playbackProgress: number): void {
        console.log(playbackProgress);
        wsClient.setPlaybackProgress(playbackProgress);
    }

    private onWsConnect(): void {
        console.log("WS Connect", this.onPlayerStateUpdate);
        youTubePlayer.initialise(
            wsClient.getState().videoId,
            this.onPlayerReady.bind(this),
            this.onPlayerStateUpdate.bind(this),
            this.onPlayerPlaybackProgressUpdate.bind(this)
        );
    }

    private onWsUpdate(): void {
        const state = wsClient.getState();
        console.log(state);
        youTubePlayer.seekTo(state.action.at);
        state.action.isPlay ? youTubePlayer.playVideo() : youTubePlayer.pauseVideo();
        const str = `${state.action.user} ${state.action.isPlay ? "play" : "pause"} ${state.action.at}`;
        setLastActionUi(str);
    }

    private onWsClose(): void {}
}

export const bridge = new Bridge();
