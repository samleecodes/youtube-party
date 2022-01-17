import { RoomState } from "common";
import { createSignal } from "solid-js";
import { httpApiClient } from "./lib/http";
import { youTubePlayer } from "./lib/player";
import { wsClient } from "./lib/ws";

// Reactive state variables for UI rendering use only
export const [roomIdUi, setRoomIdUi] = createSignal<string>("");
export const [showPlayer, setShowPlayer] = createSignal<boolean>(false);

function onPlayerReady(): void {
    youTubePlayer.seekTo(wsClient.getState().playbackProgress);
    if (wsClient.getState().isPlaying) {
        youTubePlayer.playVideo();
    }
}

function onPlayerStateUpdate(event: YT.PlayerStateChangeEvent): void {
    if (event.data == 0 || event.data == 2) {
        wsClient.setIsPlaying(false);
    }

    if (event.data == 1) {
        wsClient.setIsPlaying(true);
    }
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

function onStateUpdate(): void {
    youTubePlayer.seekTo(wsClient.getState().playbackProgress);
    if (wsClient.getState().isPlaying) {
        youTubePlayer.playVideo();
    } else {
        youTubePlayer.pauseVideo();
    }
}

function onClose(): void {
    // window.location.reload();
}

export async function createRoom(): Promise<void> {
    const roomId = await httpApiClient.createRoom();

    setRoomIdUi(roomId);
    setShowPlayer(true);

    wsClient.connect(roomId, onConnect, onStateUpdate, onClose);
}

export async function joinRoom(roomId: string): Promise<void> {
    setRoomIdUi(roomId);
    setShowPlayer(true);

    wsClient.connect(roomId, onConnect, onStateUpdate, onClose);
}

export function getWsState(): RoomState {
    return wsClient.getState();
}
