import { Component } from "solid-js";
import { bridge } from "../../lib/bridge";

const Home: Component = () => {
    let input: HTMLInputElement | undefined;

    function onJoinFormSubmitted(event: Event) {
        event.preventDefault();
        if (!input?.value || input.value === "") {
            return;
        }
        bridge.joinRoom(input.value);
    }

    function onCreateButtonClicked() {
        bridge.createRoom();
    }

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-black">
            <form onSubmit={onJoinFormSubmitted} className="flex flex-col items-center">
                <input ref={input} placeholder="Room ID" type="text" />
                <button className="bg-white" type="submit">
                    Join
                </button>
            </form>
            <button onClick={onCreateButtonClicked} className="bg-white">
                Create Room
            </button>
        </div>
    );
};

export default Home;
