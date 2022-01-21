import { Component, Show } from "solid-js";
import { bridge, lastActionUi, roomIdUi, showPlayer } from "../lib/bridge";
import Home from "./screens/Home";
import Play from "./screens/Play";

const App: Component = () => {
    let videoIdInput: HTMLInputElement | undefined;

    function onChangeButtonClicked() {
        if (!videoIdInput?.value || videoIdInput.value === "") {
            return;
        }
        bridge.changeVideo(videoIdInput.value);
    }

    return (
        <div>
            <Show when={showPlayer()} fallback={<Home />}>
                <Play />
                <div className="fixed top-0 right-0 mt-[80px] text-white bg-black">Room ID: {roomIdUi()}</div>
                <div className="fixed top-0 right-0 mt-[100px] text-white bg-black">Last: {lastActionUi()}</div>
                <div className="fixed top-0 right-0 mt-[120px] text-white bg-black">
                    <span>
                        <input class="text-black" ref={videoIdInput} placeholder="Video ID" />
                        <span onClick={onChangeButtonClicked} className="text-blue-500 cursor-pointer">
                            Change
                        </span>
                    </span>
                </div>
            </Show>
        </div>
    );
};

export default App;
