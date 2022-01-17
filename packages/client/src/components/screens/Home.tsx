import { Component } from "solid-js";

interface HomeComponentProps {
    onJoinFormSubmitted: (roomId: string) => void;
    onCreateButtonClicked: () => void;
}

const Home: Component<HomeComponentProps> = props => {
    let input: HTMLInputElement | undefined;

    function onJoinFormSubmitted(event: Event) {
        event.preventDefault();

        if (!input?.value || input.value === "") {
            return;
        }

        props.onJoinFormSubmitted(input.value);
    }

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-black">
            <form onSubmit={onJoinFormSubmitted} className="flex flex-col items-center">
                <input ref={input} placeholder="Room ID" type="text" />
                <button className="bg-white" type="submit">
                    Join
                </button>
            </form>
            <button onClick={props.onCreateButtonClicked} className="bg-white">
                Create Room
            </button>
        </div>
    );
};

export default Home;
