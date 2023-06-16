import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { prisma } from "./db.js";
import { publicProcedure, router } from "./trpc.js";
import cors from "cors";

const appRouter = router({
	userList: publicProcedure.query(async () => {
		const users = await prisma.user.findMany();
		return users;
	}),
	userById: publicProcedure.input(z.number()).query(async (opts) => {
		const { input } = opts;
		const user = await prisma.user.findUnique({
			select: { username: true },
			where: { id: input },
		});
		return user;
	}),
	userCreate: publicProcedure
		.input(
			z.object({
				username: z.string(),
				email: z.string().email(),
			})
		)
		.mutation(async (opts) => {
			const { input } = opts;
			const user = await prisma.user.create({
				data: { username: input.username, email: input.email },
			});
			return user;
		}),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
	router: appRouter,
	middleware: cors({
		origin: "http://localhost:5173",
	}),
});

server.listen(3000);

server.server.addListener("listening", () => {
	console.log("server running");
});
