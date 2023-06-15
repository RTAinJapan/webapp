import "dotenv/config";

import * as fs from "fs/promises";
import {createServer as createInsecureServer} from "http";
import {createServer as createSecureServer} from "https";

import {createHTTPHandler} from "@trpc/server/adapters/standalone";
import type {CreateHTTPContextOptions} from "@trpc/server/adapters/standalone";
import cookie from "cookie";
import cors from "cors";

import {
	CLIENT_ORIGIN,
	NODE_ENV,
	SERVER_HOSTNAME,
	SERVER_PORT,
	SESSION_COOKIE_NAME,
} from "./constants.js";
import {appRouter} from "./trpc/app-router.js";

const handler = createHTTPHandler({
	router: appRouter,
	middleware: cors({
		origin: [CLIENT_ORIGIN],
		credentials: true,
	}),
	createContext: ({req, res}: CreateHTTPContextOptions) => {
		let sessionToken: string | undefined = undefined;
		if (req.headers.cookie) {
			const cookieHeader = cookie.parse(req.headers.cookie);
			sessionToken = cookieHeader[SESSION_COOKIE_NAME];
		}
		return {
			sessionToken,
			setSessionCookie: (sessionToken: string) => {
				res.setHeader(
					"set-cookie",
					cookie.serialize(SESSION_COOKIE_NAME, sessionToken, {
						secure: true,
						httpOnly: true,
						sameSite: "strict",
					})
				);
			},
			clearSessionCookie: () => {
				res.setHeader(
					"set-cookie",
					cookie.serialize(SESSION_COOKIE_NAME, "", {
						maxAge: 0,
					})
				);
			},
		};
	},
});

const main = async () => {
	if (NODE_ENV === "development") {
		const createServer = async () => {
			try {
				const [cert, key] = await Promise.all([
					fs.readFile("./localhost.pem"),
					fs.readFile("./localhost-key.pem"),
				]);
				return createSecureServer({cert, key}, (req, res) => {
					void handler(req, res);
				});
			} catch (error) {
				if (
					error instanceof Error &&
					"code" in error &&
					error.code === "ENOENT"
				) {
					console.warn("No SSL certificates found, using HTTP instead.");
					return createInsecureServer((req, res) => {
						void handler(req, res);
					});
				}
				throw error;
			}
		};

		const server = await createServer();

		server.listen(SERVER_PORT, SERVER_HOSTNAME);

		server.addListener("listening", () => {
			console.log("server running");
		});
	}

	if (NODE_ENV === "production") {
		// TODO: implement once we have a production server
	}
};

main().catch((error) => {
	console.error(error);
});
