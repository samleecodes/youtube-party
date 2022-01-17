import { RoomState } from "common";
import { createSignal } from "solid-js";
import { httpApiClient } from "./lib/http";
import { youTubePlayer } from "./lib/player";
import { wsClient } from "./lib/ws";

// Reactive state variables for UI rendering use only
export const [roomIdUi, setRoomIdUi] = createSignal<string>("");
export const [showPlayer, setShowPlayer] = createSignal<boolean>(false);

function onPlayerReady(): void {
    console.log("onPlayeReady", wsClient.getState().playbackProgress);
    youTubePlayer.seekTo(wsClient.getState().playbackProgress);
    if (wsClient.getState().isPlaying) {
        youTubePlayer.playVideo();
    }
}

function onPlayerStateUpdate(event: YT.PlayerStateChangeEvent): void {
    console.log("onPlayerStateUpdate", event.data, youTubePlayer.getCurrentTime());
}

function onPlayerPlaybackProgressUpdate(playbackProgress: number): void {
    wsClient.setPlaybackProgress(playbackProgress);
}

function onConnect(): void {
    youTubePlayer.initialise(
        wsClient.getState().videoId,
        onPlayerReady,
        onPlayerStateUpdate,
        onPlayerPlaybackProgressUpdate
    );
}

function onClose(): void {
    // window.location.reload();
}

export async function createRoom(): Promise<void> {
    const roomId = await httpApiClient.createRoom();

    setRoomIdUi(roomId);
    setShowPlayer(true);

    wsClient.connect(roomId, onConnect, onClose);
}

export async function joinRoom(roomId: string): Promise<void> {
    setRoomIdUi(roomId);
    setShowPlayer(true);

    wsClient.connect(roomId, onConnect, onClose);
}

export function getWsState(): RoomState {
    return wsClient.getState();
}
