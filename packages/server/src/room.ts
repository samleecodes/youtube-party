import { RoomState, WsApi } from "common";
import { MessageEvent, RawData, WebSocket } from "ws";

/**
 * A room is where all clients of a party assemble.
 * Essentially a "party room" with its own independent
 * state from other rooms.
 */
class Room {
    private clients: { [uId: string]: WebSocket } = {};

    private state: RoomState;

    public constructor(public roomId: string, videoId: string) {
        this.state = {
            videoId,
            isPlaying: true,
            playbackProgress: 0,
        };
    }

    /**
     * @param ws The client's associated socket.
     * @param _ Username of the client to add.
     */
    public addClient(ws: WebSocket, _: string): void {
        const uId = this.generateUId();
        this.clients[uId] = ws;

        ws.on("message", data => {
            this.onWsMessage(uId, data);
            // this.broadcastState();
        });

        ws.on("close", () => {
            this.onWsClose(uId);
        });

        const handshake: WsApi.HandshakePacket = {
            auth: true,
        };

        ws.send(JSON.stringify(handshake));

        this.getUpdatedState([uId]);
        // this.broadcastState();
    }

    private getUpdatedState(exceptUIds: string[]): void {
        const uIds = Object.keys(this.clients).filter(val => {
            return !exceptUIds.includes(val);
        });

        if (uIds.length < 1) {
            this.broadcastState([]);
            return;
        }

        const ws = this.clients[uIds[0]];
        const stateUpdate: WsApi.StateUpdatePacket = {
            state: this.state,
            updateRequest: true,
        };
        ws.send(JSON.stringify(stateUpdate));
    }

    private broadcastState(exceptUIds: string[]): void {
        const stateUpdate: WsApi.StateUpdatePacket = {
            state: this.state,
            updateRequest: false,
        };
        const payload = JSON.stringify(stateUpdate);

        const uIds = Object.keys(this.clients).filter(val => {
            return !exceptUIds.includes(val);
        });
        for (let i = 0; i < uIds.length; i++) {
            this.clients[uIds[i]].send(payload);
        }
    }

    private onWsMessage(uId: string, data: RawData): void {
        const stateUpdate: WsApi.StateUpdatePacket = JSON.parse(String(data));
        this.state = stateUpdate.state;
        this.broadcastState([uId]);
    }

    private onWsClose(uId: string): void {
        if (this.clients.hasOwnProperty(uId)) {
            delete this.clients[uId];
        }
    }

    private generateUId(): string {
        return `${Date.now()}${Math.round(10 * Math.random())}`;
    }
}

/**
 * Provides an interface to control the creation and destruction of rooms
 * as well as look up rooms.
 */
class RoomManager {
    /** This object functions as a hash map to store all the rooms
     * and uses the room ID as the key. */
    private rooms: { [roomId: string]: any } = {};

    /**
     * @param videoId The room's first video's ID.
     * @returns A reference to the newly created Room object. */
    public createRoom(videoId: string): Room {
        const roomId = this.generateRoomId();
        this.rooms[roomId] = new Room(roomId, videoId);
        return this.rooms[roomId];
    }

    /**
     * @param roomId A room ID to look up.
     * @returns A reference to the Room object that matches the provided ID. */
    public getRoom(roomId: string): Room {
        if (!this.rooms.hasOwnProperty(roomId)) {
            throw new Error("Invalid room ID");
        }
        return this.rooms[roomId];
    }

    /**
     * The provided socket will be first authenticated, and then
     * added to the room which it requests to join.
     * @param ws Socket to handle.
     */
    public handleNewWsConnection(ws: WebSocket): void {
        // Expect an authentication packet from the client
        // Disconnect if not
        const onMessage = (event: MessageEvent) => {
            const auth: WsApi.AuthPacket = JSON.parse(String(event.data));

            // Perform validation on auth packet
            if (!auth.roomId || !auth.username) {
                ws.close();
                return;
            }

            // Add to room, catch invalid room ID error
            try {
                const room = this.getRoom(auth.roomId);
                room.addClient(ws, auth.username);
                ws.removeEventListener("message", onMessage);
            } catch {
                ws.close();
            }
        };
        ws.addEventListener("message", onMessage);
    }

    /** This algorithm incorporates the current date and time as well as a
     * pseudorandom integer to produce an ID that is guranteed to be unique. */
    private generateRoomId(): string {
        return `${Date.now()}${Math.round(100 * Math.random())}`;
    }
}

/**
 * Singleton instance of the RoomManager class.
 */
export const roomManager = new RoomManager();
