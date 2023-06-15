import {z} from "zod";

export const SESSION_COOKIE_NAME = "rtaij-app-session-token";

export const CLIENT_ORIGIN = z
	.string()
	.url()
	.parse(process.env["CLIENT_ORIGIN"]);

export const SERVER_ORIGIN = z
	.string()
	.url()
	.parse(process.env["SERVER_ORIGIN"]);

export const SERVER_HOSTNAME = z.string().parse(process.env["SERVER_HOSTNAME"]);

export const SERVER_PORT = z.coerce
	.number()
	.positive()
	.int()
	.parse(process.env["SERVER_PORT"]);

export const NODE_ENV = z
	.enum(["development", "production"])
	.default("development")
	.parse(process.env["NODE_ENV"]);
