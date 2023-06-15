import {prisma} from "../db.js";

export const validateSession = async (sessionToken: string) => {
	const session = await prisma.session.findUnique({
		where: {sessionToken},
		select: {
			User: {
				select: {username: true},
			},
		},
	});
	if (!session) {
		return null;
	}
	return {username: session.User.username};
};

export const getUserFromSession = async (sessionToken: string) => {
	const session = await prisma.session.findUnique({
		where: {sessionToken},
		select: {User: true},
	});
	return session?.User;
};
