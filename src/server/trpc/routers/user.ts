import {router} from "../initialize.js";
import {authenticatedProcedure} from "../procedures.js";

// TODO: this is mock implementation
export const userRouter = router({
	self: authenticatedProcedure.query(({ctx: {user}}) => {
		return {
			id: user.id,
			username: user.username,
			email: user.email,
		};
	}),
});
