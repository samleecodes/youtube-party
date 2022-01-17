class YouTubePlayer {
    private _player: YT.Player | undefined;

    public initialise(videoId: string, onReady: () => void, onStateChange: (event: any) => void): void {
        // This section was pulled from YouTube docs
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";

        const fScript = document.getElementsByTagName("script")[0];
        if (!fScript || !fScript.parentNode) return;

        fScript.parentNode.insertBefore(tag, fScript);

        window.onYouTubeIframeAPIReady = () => {
            const elId = import.meta.env.VITE_PLAYER_DIV_ID;
            this._player = new YT.Player(elId, {
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
    }

    public playVideo(): void {
        this._player?.playVideo();
    }
}

export const youTubePlayer = new YouTubePlayer();
