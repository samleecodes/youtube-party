class YouTubePlayer {
    private player: YT.Player | undefined;

    public initialise(
        videoId: string,
        onReady: () => void,
        onStateChange: (event: YT.PlayerStateChangeEvent) => void,
        onPlayerPlaybackProgressUpdate: (playbackProgress: number) => void
    ): void {
        // This section was pulled from YouTube docs
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";

        const fScript = document.getElementsByTagName("script")[0];
        if (!fScript || !fScript.parentNode) return;

        fScript.parentNode.insertBefore(tag, fScript);

        window.onYouTubeIframeAPIReady = () => {
            const elId = import.meta.env.VITE_PLAYER_DIV_ID;
            this.player = new YT.Player(elId, {
                videoId,
                playerVars: {
                    playsinline: 1,
                    fs: 0,
                },
                events: {
                    onReady,
                    onStateChange,
                },
            });
        };

        requestAnimationFrame(() => {
            this.renderLoop(onPlayerPlaybackProgressUpdate);
        });
    }

    public getCurrentTime(): number {
        return this.player?.getCurrentTime() || 0;
    }

    public playVideo(): void {
        this.player?.playVideo();
    }

    public pauseVideo(): void {
        this.player?.pauseVideo();
    }

    public seekTo(seconds: number) {
        this.player?.seekTo(seconds, true);
    }

    private renderLoop(onPlayerPlaybackProgressUpdate: (playbackProgress: number) => void): void {
        try {
            onPlayerPlaybackProgressUpdate(this.getCurrentTime());
        } catch {}
        requestAnimationFrame(() => {
            this.renderLoop(onPlayerPlaybackProgressUpdate);
        });
    }
}

export const youTubePlayer = new YouTubePlayer();
