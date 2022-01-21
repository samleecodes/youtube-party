import { Component, Show } from "solid-js";
import { lastActionUi, roomIdUi, showPlayer } from "../lib/bridge";
import Home from "./screens/Home";
import Play from "./screens/Play";

const App: Component = () => {
    return (
        <div>
            <Show when={showPlayer()} fallback={<Home />}>
                <Play />
                <div className="fixed top-0 right-0 mt-[80px] text-white bg-black">Room ID: {roomIdUi()}</div>
                <div className="fixed top-0 right-0 mt-[100px] text-white bg-black">Last: {lastActionUi()}</div>
            </Show>
        </div>
    );
};

export default App;
