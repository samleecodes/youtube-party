import axios from "axios";
import { HttpApi } from "common";

class HttpApiClient {
    private baseUrl = import.meta.env.VITE_HTTP_BASE_URL || "http://localhost:8080";

    public async createRoom(videoId: string): Promise<string> {
        const url = this.constructUrl(HttpApi.CreateRoom.route);
        const payload: HttpApi.CreateRoom.RequestSchema = {
            videoId,
        };

        const response = await axios.post(url, payload);

        const data: HttpApi.CreateRoom.ResponseSchema = response.data;
        return data.roomId;
    }

    private constructUrl(path: string): string {
        return `${this.baseUrl}${path}`;
    }
}

export const httpApiClient = new HttpApiClient();
