import {TRPCError} from "@trpc/server";

import {API_ERROR_MESSAGE} from "../../util/api-error-message.js";
import {getUserFromSession} from "../query/session.js";

import {t} from "./initialize.js";

const middleware = t.middleware;

const requestLoggerMIddleware = middleware((opts) => {
	console.log(
		JSON.stringify({
			path: opts.path,
			type: opts.type,
			input: opts.rawInput,
		})
	);
	return opts.next();
});

const responseMiddleware = middleware(async ({next}) => {
	const result = await next();
	if (result.ok) {
		console.log(result.data);
	}
	return result;
});

const errorMiddleware = middleware(async ({next}) => {
	const result = await next();
	if (!result.ok) {
		console.error(result.error);
	}
	return result;
});

export const publicProcedure = t.procedure
	.use(requestLoggerMIddleware)
	.use(responseMiddleware)
	.use(errorMiddleware);

const authenticated = middleware(async ({ctx, next}) => {
	if (typeof ctx.sessionToken === "string") {
		const user = await getUserFromSession(ctx.sessionToken);
		if (user) {
			ctx.user = user;
			return next({
				ctx: {
					sessionToken: ctx.sessionToken,
					user: ctx.user,
				},
			});
		}
	}
	throw new TRPCError({
		code: "UNAUTHORIZED",
		message: API_ERROR_MESSAGE.UNAUTHORIZED.singInRequired,
	});
});

export const authenticatedProcedure = publicProcedure.use(authenticated);
