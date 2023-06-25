import type {CreateFastifyContextOptions} from "@trpc/server/adapters/fastify";
import cookie from "cookie";

import {ENV} from "../constants.js";

export const createContext = ({req, res}: CreateFastifyContextOptions) => {
	let sessionToken: string | undefined = undefined;
	if (req.headers.cookie) {
		const cookieHeader = cookie.parse(req.headers.cookie);
		sessionToken = cookieHeader[ENV.SESSION_COOKIE_NAME];
	}
	return {
		sessionToken,
		setSessionCookie: async (sessionToken: string) => {
			await res.header(
				"set-cookie",
				cookie.serialize(ENV.SESSION_COOKIE_NAME, sessionToken, {
					secure: true,
					httpOnly: true,
					sameSite: "strict",
				})
			);
		},
		clearSessionCookie: async () => {
			await res.header(
				"set-cookie",
				cookie.serialize(ENV.SESSION_COOKIE_NAME, "", {
					maxAge: 0,
				})
			);
		},
	};
};
