import {TRPCError} from "@trpc/server";
import {z} from "zod";

import {API_ERROR_MESSAGE} from "../../../util/api-error-message.js";
import {EMAIL_TOKEN_MAXIMUM, EMAIL_TOKEN_MINIMUM} from "../../constants.js";
import {prisma} from "../../db.js";
import {sendDuplicateEmailNotification, sendTokenEmail} from "../../email.js";
import {
	createEmailToken,
	deleteEmailToken,
} from "../../mutation/email-token.js";
import {createUser} from "../../mutation/user.js";
import {getToken} from "../../query/email-token.js";
import {router} from "../initialize.js";
import {publicProcedure} from "../procedures.js";

export const registrationRouter = router({
	startEmailChallenge: publicProcedure
		.input(z.object({email: z.string().email()}))
		.mutation(async ({input}) => {
			const existingUser = await prisma.user.findUnique({
				where: {email: input.email},
			});
			if (existingUser) {
				await sendDuplicateEmailNotification(existingUser.email);
				return null;
			}
			const token = await createEmailToken(input.email);
			await sendTokenEmail(input.email, token);
			return null;
		}),

	createUserWithEmailChallenge: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				token: z.number().min(EMAIL_TOKEN_MINIMUM).max(EMAIL_TOKEN_MAXIMUM),
			})
		)
		.mutation(async ({input, ctx}) => {
			const tokenInfo = await getToken(input.email);

			if (!tokenInfo?.token) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: API_ERROR_MESSAGE.NOT_FOUND.emailChallengeTokenEmailNotFound,
				});
			}
			if (tokenInfo.token !== Number(input.token)) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: API_ERROR_MESSAGE.UNAUTHORIZED.tokenNotMatched,
				});
			}
			if (tokenInfo.expiresAt.getTime() < Date.now()) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: API_ERROR_MESSAGE.UNAUTHORIZED.tokenExpired,
				});
			}

			await deleteEmailToken(tokenInfo.id);
			const {sessionToken} = await createUser(tokenInfo.email);
			ctx.setSessionCookie(sessionToken);
			return null;
		}),
});
