import {
	EMAIL_TOKEN_MAXIMUM,
	EMAIL_TOKEN_MINIMUM,
	EMAIL_TOKEN_VALID_DURATION,
} from "../constants.js";
import {prisma} from "../db.js";
import {secureRandomInt} from "../security.js";

export const createEmailToken = async (email: string) => {
	const newToken = await secureRandomInt(
		EMAIL_TOKEN_MINIMUM,
		EMAIL_TOKEN_MAXIMUM
	);

	const createdToken = await prisma.emailChallengeToken.upsert({
		where: {email},
		create: {
			email,
			token: newToken,
			expiresAt: new Date(Date.now() + EMAIL_TOKEN_VALID_DURATION),
		},
		update: {
			token: newToken,
			expiresAt: new Date(Date.now() + EMAIL_TOKEN_VALID_DURATION),
		},
	});

	return createdToken.token;
};

export const deleteEmailToken = async (id: number) => {
	await prisma.emailChallengeToken.delete({where: {id}});
};
