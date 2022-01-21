import { Component } from "solid-js";
import { bridge } from "../../lib/bridge";

const Home: Component = () => {
    let joinInput: HTMLInputElement | undefined;
    let createInput: HTMLInputElement | undefined;

    function onJoinFormSubmitted(event: Event) {
        event.preventDefault();
        if (!joinInput?.value || joinInput.value === "") {
            return;
        }
        bridge.joinRoom(joinInput.value);
    }

    function onCreateFormSubmitted(event: Event) {
        event.preventDefault();
        if (!createInput?.value || createInput.value === "") {
            return;
        }
        bridge.createRoom(createInput.value);
    }

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-black">
            <form onSubmit={onJoinFormSubmitted} className="flex flex-col items-center">
                <input ref={joinInput} placeholder="Room ID" type="text" />
                <button className="bg-white" type="submit">
                    Join
                </button>
            </form>
            <form onSubmit={onCreateFormSubmitted} className="flex flex-col items-center">
                <input ref={createInput} placeholder="Video ID" type="text" />
                <button className="bg-white" type="submit">
                    Create Room
                </button>
            </form>
        </div>
    );
};

export default Home;
