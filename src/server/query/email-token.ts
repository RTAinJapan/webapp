import {prisma} from "../db.js";

export const getToken = async (email: string) => {
	return prisma.emailChallengeToken.findUnique({
		where: {email},
		select: {
			id: true,
			email: true,
			token: true,
			expiresAt: true,
		},
	});
};
