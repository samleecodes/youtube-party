import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { WebSocketServer } from "ws";
import { roomManager } from "./room";

/**
 * Register the WebSocket server with the provided Fastify instance.
 * @param fastify - Fastify instance.
 * @param _ - Plugin options. Do not provide any.
 */
export async function FastifyWs(fastify: FastifyInstance, _: FastifyPluginOptions): Promise<void> {
    const wss = new WebSocketServer({ server: fastify.server });

    wss.addListener("connection", ws => {
        roomManager.handleNewWsConnection(ws);
    });
}
