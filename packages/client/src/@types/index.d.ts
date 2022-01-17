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

        interface PlayerStateChangeEvent {
            data: any;
        }
    }

    interface ImportMetaEnv {
        readonly VITE_PLAYER_DIV_ID: string;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

export {};
