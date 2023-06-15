import * as crypto from "node:crypto";

import {
	generateRegistrationOptions,
	verifyAuthenticationResponse,
	verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type {
	RegistrationResponseJSON,
	AuthenticationResponseJSON,
	AuthenticatorTransportFuture,
} from "@simplewebauthn/typescript-types";
import {TRPCError} from "@trpc/server";
import {z, type ZodType} from "zod";

import {prisma} from "../../db.js";
import {
	decodeCredentialId,
	encodeCredentialId,
	normalizeBase64,
	origin,
	rpID,
	rpName,
} from "../../passkey.js";
import {router} from "../initialize.js";
import {authenticatedProcedure, publicProcedure} from "../procedures.js";

const registrationResponseSchema = z.object({
	id: z.string(),
	rawId: z.string(),
	response: z.object({
		clientDataJSON: z.string(),
		attestationObject: z.string(),
		transports: z
			.array(z.string() as ZodType<AuthenticatorTransportFuture>)
			.optional(),
	}),
	authenticatorAttachment: z.enum(["platform", "cross-platform"]).optional(),
	clientExtensionResults: z.object({
		appid: z.boolean().optional(),
		credProps: z.object({rk: z.boolean().optional()}).optional(),
		hmacCreateSecret: z.boolean().optional(),
	}),
	type: z.literal("public-key"),
}) satisfies ZodType<RegistrationResponseJSON>;

const authenticationResponseSchema = z.object({
	id: z.string(),
	rawId: z.string(),
	response: z.object({
		clientDataJSON: z.string(),
		authenticatorData: z.string(),
		signature: z.string(),
		userHandle: z.string().optional(),
	}),
	authenticatorAttachment: z.enum(["platform", "cross-platform"]).optional(),
	clientExtensionResults: z.object({
		appid: z.boolean().optional(),
		credProps: z.object({rk: z.boolean().optional()}).optional(),
		hmacCreateSecret: z.boolean().optional(),
	}),
	type: z.literal("public-key"),
}) satisfies ZodType<AuthenticationResponseJSON>;

export const passkeyRouter = router({
	passkeyRegistrationData: authenticatedProcedure.query(
		async ({ctx: {user}}) => {
			const authenticators = await prisma.authenticator.findMany({
				where: {userId: user.id},
			});

			const options = generateRegistrationOptions({
				rpName,
				rpID,
				userID: user.id.toString(),
				userName: user.username,
				attestationType: "none",
				excludeCredentials: authenticators.map((authenticator) => ({
					id: decodeCredentialId(authenticator.credentialId),
					type: "public-key",
					transports:
						authenticator.transports as AuthenticatorTransportFuture[],
				})),
				authenticatorSelection: {
					residentKey: "required",
					userVerification: "preferred",
				},
			});

			await prisma.credentialChallenge.upsert({
				create: {
					challenge: options.challenge,
					User: {
						connect: {
							id: user.id,
						},
					},
				},
				update: {
					challenge: options.challenge,
				},
				where: {
					userId: user.id,
				},
			});

			return options;
		}
	),

	registerPasskey: authenticatedProcedure
		.input(registrationResponseSchema)
		.mutation(async ({ctx: {user}, input}) => {
			const credentialChallenge = await prisma.credentialChallenge.findUnique({
				where: {
					userId: user.id,
				},
				select: {
					challenge: true,
				},
			});

			if (!credentialChallenge) {
				throw new TRPCError({code: "NOT_FOUND"});
			}

			const verification = await verifyRegistrationResponse({
				response: input,
				expectedChallenge: credentialChallenge.challenge,
				expectedOrigin: origin,
				expectedRPID: rpID,
				requireUserVerification: true,
			});

			if (!verification.verified || !verification.registrationInfo) {
				throw new TRPCError({code: "BAD_REQUEST"});
			}

			await prisma.authenticator.create({
				data: {
					credentialId: encodeCredentialId(
						verification.registrationInfo.credentialID
					),
					credentialPublicKey: Buffer.from(
						verification.registrationInfo.credentialPublicKey
					),
					counter: verification.registrationInfo.counter,
					credentialDeviceType:
						verification.registrationInfo.credentialDeviceType,
					credentialBackedUp: verification.registrationInfo.credentialBackedUp,
					transports: input.response.transports,
					User: {
						connect: {
							id: user.id,
						},
					},
				},
			});

			return {verified: verification.verified};
		}),

	verifyAuthentication: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				authenticationResponse: authenticationResponseSchema,
			})
		)
		.mutation(async ({input, ctx}) => {
			const authenticator = await prisma.authenticator.findUnique({
				where: {credentialId: normalizeBase64(input.authenticationResponse.id)},
				include: {
					User: {
						include: {
							CredentialChallenge: true,
						},
					},
				},
			});
			if (!authenticator) {
				throw new TRPCError({code: "NOT_FOUND"});
			}
			const user = authenticator.User;
			if (!user.CredentialChallenge) {
				throw new TRPCError({code: "NOT_FOUND"});
			}

			const verification = await verifyAuthenticationResponse({
				response: input.authenticationResponse,
				expectedChallenge: user.CredentialChallenge.challenge,
				expectedOrigin: origin,
				expectedRPID: rpID,
				authenticator: {
					credentialID: decodeCredentialId(authenticator.credentialId),
					credentialPublicKey: authenticator.credentialPublicKey,
					counter: Number(authenticator.counter),
					transports:
						authenticator.transports as AuthenticatorTransportFuture[],
				},
				requireUserVerification: true,
			});

			const newCounter = verification.authenticationInfo.newCounter;
			await prisma.authenticator.update({
				where: {id: authenticator.id},
				data: {counter: newCounter},
			});

			const createdSession = await prisma.session.create({
				data: {
					sessionToken: crypto.randomUUID(),
					User: {
						connect: {
							id: user.id,
						},
					},
				},
			});

			ctx.setSessionCookie(createdSession.sessionToken);

			return {verified: verification.verified};
		}),
});
