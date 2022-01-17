import { RoomState, WsApi } from "common";
import { WebSocket } from "ws";

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
        };
    }

    /**
     * @param ws The client's associated socket.
     * @param _ Username of the client to add.
     */
    public addClient(ws: WebSocket, _: string): void {
        const uId = this.generateUId();
        this.clients[uId] = ws;

        ws.on("close", () => {
            this.onWsClose(uId);
        });

        const handshake: WsApi.HandshakePacket = {
            auth: true,
        };

        ws.send(JSON.stringify(handshake));

        this.broadcastState();
    }

    private broadcastState(): void {
        const stateUpdate: WsApi.StateUpdatePacket = {
            state: this.state,
        };
        const payload = JSON.stringify(stateUpdate);

        const uIds = Object.keys(this.clients);
        for (let i = 0; i < uIds.length; i++) {
            this.clients[uIds[i]].send(payload);
        }
    }

    private onWsClose(uId: string): void {
        if (this.clients[uId]) {
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
        ws.on("message", data => {
            const auth: WsApi.AuthPacket = JSON.parse(String(data));

            // Perform validation on auth packet
            if (!auth.roomId || !auth.username) {
                ws.close();
                return;
            }

            // Add to room, catch invalid room ID error
            try {
                const room = this.getRoom(auth.roomId);
                room.addClient(ws, auth.username);
            } catch {
                ws.close();
            }
        });
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
