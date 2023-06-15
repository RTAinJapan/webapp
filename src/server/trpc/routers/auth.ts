import * as crypto from "node:crypto";

import {generateAuthenticationOptions} from "@simplewebauthn/server";
import type {AuthenticatorTransportFuture} from "@simplewebauthn/typescript-types";
import {TRPCError} from "@trpc/server";
import {z} from "zod";

import {API_ERROR_MESSAGE} from "../../../util/api-error-message.js";
import {prisma} from "../../db.js";
import {mailer} from "../../email.js";
import {decodeCredentialId} from "../../passkey.js";
import {validateSession} from "../../query/session.js";
import {router} from "../initialize.js";
import {authenticatedProcedure, publicProcedure} from "../procedures.js";

const EMAIL_CHALLENGE_VALID_DURATION = 5 * 60 * 1000; // 5 minutes
const TOKEN_MINIMUM = 0;
const TOKEN_MAXIMUM = 999999;

const secureRandomInt = (min: number, max: number) => {
	return new Promise<number>((resolve, reject) => {
		crypto.randomInt(min, max, (error, n) => {
			if (error) {
				reject(error);
			} else {
				resolve(n);
			}
		});
	});
};

export const authRouter = router({
	startEmailChallenge: publicProcedure
		.input(z.object({email: z.string().email()}))
		.mutation(async ({input}) => {
			const existingUser = await prisma.user.findUnique({
				where: {email: input.email},
			});

			if (existingUser) {
				await mailer.sendMail({
					from: "noreply@rtaij.app",
					to: input.email,
					subject: "Register attempt on rtaij.app",
					text: "Someone tried to register on rtaij.app with your email, but your account already exists. If this was you, please sign in. If this was not you, please ignore this email.",
				});
				return null;
			}

			const newToken = await secureRandomInt(TOKEN_MINIMUM, TOKEN_MAXIMUM);
			const createdToken = await prisma.emailChallengeToken.upsert({
				where: {email: input.email},
				create: {
					email: input.email,
					token: newToken,
					expiresAt: new Date(Date.now() + EMAIL_CHALLENGE_VALID_DURATION),
				},
				update: {
					token: newToken,
					expiresAt: new Date(Date.now() + EMAIL_CHALLENGE_VALID_DURATION),
				},
			});

			const token = createdToken.token.toString().padStart(6, "0");

			await mailer.sendMail({
				from: "noreply@rtaij.app",
				to: input.email,
				subject: "Register on rtaij.app",
				text: token,
			});

			return null;
		}),

	createUserWithEmailChallenge: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				token: z.number().min(TOKEN_MINIMUM).max(TOKEN_MAXIMUM),
			})
		)
		.mutation(async ({input, ctx}) => {
			const challengeToken = await prisma.emailChallengeToken.findUnique({
				where: {email: input.email},
			});

			if (!challengeToken) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: API_ERROR_MESSAGE.NOT_FOUND.emailChallengeTokenEmailNotFound,
				});
			}
			if (challengeToken.token !== Number(input.token)) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: API_ERROR_MESSAGE.UNAUTHORIZED.tokenNotMatched,
				});
			}
			if (challengeToken.expiresAt.getTime() < Date.now()) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: API_ERROR_MESSAGE.UNAUTHORIZED.tokenExpired,
				});
			}

			await prisma.emailChallengeToken.delete({
				where: {id: challengeToken.id},
			});

			const createdSession = await prisma.session.create({
				data: {
					sessionToken: crypto.randomUUID(),
					User: {
						create: {
							email: challengeToken.email,
							username: challengeToken.email,
						},
					},
				},
			});

			ctx.setSessionCookie(createdSession.sessionToken);

			return null;
		}),

	emailSignInOptions: publicProcedure
		.input(z.object({email: z.string().email()}))
		.query(async ({input}) => {
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
