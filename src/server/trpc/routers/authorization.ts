import {generateAuthenticationOptions} from "@simplewebauthn/server";
import type {AuthenticatorTransportFuture} from "@simplewebauthn/typescript-types";
import {TRPCError} from "@trpc/server";
import {z} from "zod";

import {prisma} from "../../db.js";
import {decodeCredentialId} from "../../passkey.js";
import {validateSession} from "../../query/session.js";
import {router} from "../initialize.js";
import {authenticatedProcedure, publicProcedure} from "../procedures.js";

export const authorizationRouter = router({
	emailSignInOptions: publicProcedure
		.input(z.object({email: z.string().email()}))
		.mutation(async ({input}) => {
			const user = await prisma.user.findUnique({
				where: {email: input.email},
				include: {Authenticator: true},
			});
			if (!user) {
				throw new TRPCError({
					code: "NOT_FOUND",
				});
			}
			if (user.Authenticator.length >= 1) {
				const options = generateAuthenticationOptions({
					allowCredentials: user.Authenticator.map((authenticator) => ({
						id: decodeCredentialId(authenticator.credentialId),
						type: "public-key",
						transports:
							authenticator.transports as AuthenticatorTransportFuture[],
					})),
					userVerification: "preferred",
				});
				await prisma.user.update({
					where: {email: input.email},
					data: {
						CredentialChallenge: {
							upsert: {
								create: {
									challenge: options.challenge,
								},
								update: {
									challenge: options.challenge,
								},
							},
						},
					},
				});
				return {type: "passkey", options} as const;
			}
			return {type: "email challenge"} as const;
		}),

	signOut: authenticatedProcedure.mutation(async ({ctx}) => {
		await prisma.session.delete({
			where: {sessionToken: ctx.sessionToken},
		});
		ctx.clearSessionCookie();
		return null;
	}),

	validateSession: publicProcedure.query(async ({ctx}) => {
		if (!ctx.sessionToken) {
			return null;
		}
		return validateSession(ctx.sessionToken);
	}),
});
