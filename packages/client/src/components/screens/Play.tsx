import { Component } from "solid-js";

const Play: Component = () => {
    return (
        <div
            id={import.meta.env.VITE_PLAYER_DIV_ID}
            className="w-screen h-screen flex justify-center items-center text-white bg-black">
            Loading player
        </div>
    );
};

export default Play;
