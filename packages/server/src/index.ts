import Fastify from "fastify";
import FastifyCors from "fastify-cors";
import { FastifyHttp } from "./http";
import { FastifyWs } from "./ws";
import { config } from "./config";

const fastify = Fastify({ logger: true });

fastify.register(FastifyCors);
fastify.register(FastifyHttp);
fastify.register(FastifyWs);

fastify.listen(config.http.port, "0.0.0.0", error => {
    if (error) {
        console.error(error);
        process.exit(1);
    }
});
