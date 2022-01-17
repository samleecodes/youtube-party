declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
    }

    namespace YT {
        class Player {
            constructor(elementId: string, config: any);
            loadVideoById(videoId: string, startSeconds: number): void;
            playVideo(): void;
            pauseVideo(): void;
            seekTo(seconds: number, allowSeekAhead: boolean): void;
            getPlayerState(): number;
            getCurrentTime(): number;
        }

        enum State {
            UNSTARTED = -1,
            ENDED = 0,
            PLAYING = 1,
            PAUSED = 2,
            BUFFERING = 3,
            VIDEO_CUED = 5,
        }

        interface PlayerStateChangeEvent {
            data: State;
        }
    }

    interface ImportMetaEnv {
        readonly VITE_PLAYER_DIV_ID: string;
        readonly VITE_HTTP_BASE_URL: string;
        readonly VITE_WS_BASE_URL: string;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

export {};
