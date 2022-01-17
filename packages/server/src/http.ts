import { HttpApi } from "common";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { roomManager } from "./room";

/**
 * Register the HTTP API routes with the provided Fastify instance.
 * @param fastify - Fastify instance
 * @param _ - Plugin options. Do not provide any.
 */
export async function FastifyHttp(fastify: FastifyInstance, _: FastifyPluginOptions): Promise<void> {
    // POST /create_room
    fastify.post<{ Body: HttpApi.CreateRoom.RequestSchema }>(HttpApi.CreateRoom.route, (request, reply) => {
        const response: HttpApi.CreateRoom.ResponseSchema = {
            roomId: roomManager.createRoom(request.body.videoId).roomId,
        };
        reply.status(201);
        reply.send(response);
    });
}
