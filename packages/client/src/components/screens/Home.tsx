import { Component } from "solid-js";
import { bridge } from "../../lib/bridge";

const Home: Component = () => {
    let unameInput: HTMLInputElement | undefined;
    let joinInput: HTMLInputElement | undefined;
    let createInput: HTMLInputElement | undefined;

    function onUNameInputValueChanged(event: Event) {
        console.log(event);
    }

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
        <div class="w-screen h-screen flex flex-col justify-center items-center bg-black">
            <div class="text-3xl text-white">
                YouTube Party <span class="text-sm">alpha</span>
            </div>
            <div class="mb-2 text-lg text-white">with &lt;3 by Sameer Niaz</div>
            {/* <div class="flex flex-row items-center my-2">
                <input
                    onChange={e => {
                        onUNameInputValueChanged(e);
                    }}
                    ref={unameInput}
                    class="px-2 py-1 rounded-md"
                    placeholder="Username"
                    type="text"
                />
            </div> */}
            <form onSubmit={onJoinFormSubmitted} class="flex flex-row items-center my-2">
                <input ref={joinInput} class="px-2 py-1 rounded-md" placeholder="Room ID" type="text" />
                <button class="mx-2 px-2 py-1 rounded-md bg-white" type="submit">
                    Join
                </button>
            </form>
            <form onSubmit={onCreateFormSubmitted} class="flex flex-row items-center my-2">
                <input ref={createInput} class="px-2 py-1 rounded-md" placeholder="Video ID" type="text" />
                <button class="mx-2 px-2 py-1 rounded-md bg-white" type="submit">
                    Create Room
                </button>
            </form>
            <a href="https://github.com/niazmsameer/youtube-party" class="my-2 text-blue-500">GitHub Repository</a>
        </div>
    );
};

export default Home;
