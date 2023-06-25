import * as crypto from "node:crypto";

import {prisma} from "../db.js";

export const createUser = async (email: string) => {
	const session = await prisma.session.create({
		data: {
			sessionToken: crypto.randomUUID(),
			User: {
				create: {
					email,
					username: email,
				},
			},
		},
	});
	return {sessionToken: session.sessionToken};
};
