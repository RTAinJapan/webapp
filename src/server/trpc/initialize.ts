import type {User} from "@prisma/client";
import {initTRPC} from "@trpc/server";

interface Context {
	user?: User;
	sessionToken?: string;
	setSessionCookie: (sessionToken: string) => void;
	clearSessionCookie: () => void;
}

export const t = initTRPC.context<Context>().create();

export const router = t.router;
