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
        <Show when={showPlayer()} fallback={<Home />}>
            <Play />
            <div className="fixed top-0 right-0 mt-[80px] mx-2 p-2 rounded-md flex flex-col items-end text-right text-white bg-black bg-opacity-50">
                <div>Room ID: {roomIdUi()}</div>
                {/* <div className="fixed top-0 right-0 mt-[100px] text-right text-white bg-black">Last: {lastActionUi()}</div> */}
                <div>
                    <input class="p-1 text-white bg-black rounded-md bg-opacity-50" ref={videoIdInput} placeholder="Video ID" />
                    <span onClick={onChangeButtonClicked} className="ml-2 text-blue-500 cursor-pointer">
                        Change
                    </span>
                </div>
            </div>
        </Show>
    );
};

export default App;
