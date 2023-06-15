import {router} from "./initialize.js";
import {authRouter} from "./routers/auth.js";
import {passkeyRouter} from "./routers/passkey.js";
import {userRouter} from "./routers/user.js";

export const appRouter = router({
	user: userRouter,
	auth: authRouter,
	passkey: passkeyRouter,
});

export type AppRouter = typeof appRouter;
