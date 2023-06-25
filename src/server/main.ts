import "dotenv/config";

import * as fs from "fs/promises";

import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import {fastifyTRPCPlugin} from "@trpc/server/adapters/fastify";
import fastify from "fastify";

import {ENV} from "./constants.js";
import {appRouter} from "./trpc/app-router.js";
import {createContext} from "./trpc/context.js";

const [cert, key] = await Promise.all([
	fs.readFile("./localhost.pem"),
	fs.readFile("./localhost-key.pem"),
]);

const server = fastify({
	maxParamLength: 4096,
	http2: true,
	https: {key, cert},
});

await server.register(helmet);

await server.register(cors, {
	origin: [ENV.CLIENT_ORIGIN],
	credentials: true,
});

await server.register(fastifyTRPCPlugin, {
	prefix: "/",
	trpcOptions: {
		router: appRouter,
		createContext,
	},
});

await server.listen({
	host: ENV.SERVER_HOSTNAME,
	port: ENV.SERVER_PORT,
});

console.log(`Server listening at ${server.listeningOrigin}`);
