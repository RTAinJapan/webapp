import {router} from "./initialize.js";
import {authorizationRouter} from "./routers/authorization.js";
import {passkeyRouter} from "./routers/passkey.js";
import {registrationRouter} from "./routers/registration.js";
import {userRouter} from "./routers/user.js";

export const appRouter = router({
	user: userRouter,
	registration: registrationRouter,
	authorization: authorizationRouter,
	passkey: passkeyRouter,
});

export type AppRouter = typeof appRouter;
