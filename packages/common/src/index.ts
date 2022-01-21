export interface RoomState {
    videoId: string;
    action: {
        isPlay: boolean;
        at: number;
    };
    isPlaying: boolean;
    playbackProgress: number;
}

export namespace HttpApi {
    export namespace CreateRoom {
        export const route = "/create_room";

        export interface RequestSchema {
            videoId: string;
        }

        export interface ResponseSchema {
            roomId: string;
        }
    }
}

export namespace WsApi {
    export interface AuthPacket {
        username: string;
        roomId: string;
    }

    export interface HandshakePacket {
        auth: boolean;
    }

    export interface StateUpdatePacket {
        state: RoomState;
        updateRequest: boolean;
    }
}
