import { Component, createSignal, Show } from "solid-js";
import { httpApiClient } from "../lib/http";
import { youTubePlayer } from "../lib/player";
import { wsClient } from "../lib/ws";
import Home from "./screens/Home";
import Play from "./screens/Play";

const App: Component = () => {
    const [roomId, setRoomId] = createSignal<string>("");
    const [hasJoined, setHasJoined] = createSignal<boolean>(false);

    async function joinRoom(newRoomId: string) {
        setRoomId(newRoomId);
        setHasJoined(true);

        wsClient.connect(roomId(), onConnect, onClose);
    }

    async function createRoom() {
        const newRoomId = await httpApiClient.createRoom();

        setRoomId(newRoomId);
        setHasJoined(true);

        wsClient.connect(roomId(), onConnect, onClose);
    }

    function onConnect() {
        // Must make sure the Play component
        // is visible when this is called
        youTubePlayer.initialise(
            wsClient.getState().videoId,
            () => {},
            () => {}
        );
    }

    function onClose() {
        window.location.reload();
    }

    return (
        <div>
            <Show
                when={hasJoined()}
                fallback={
                    <Home
                        onJoinFormSubmitted={roomId => {
                            joinRoom(roomId);
                        }}
                        onCreateButtonClicked={() => {
                            createRoom();
                        }}
                    />
                }>
                <Play />
                <div className="fixed top-0 right-0 mt-[80px] text-white bg-black">Room ID: {roomId()}</div>
            </Show>
        </div>
    );
};

export default App;
