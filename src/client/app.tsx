import {RouterProvider} from "react-router-dom";

import {MuiStyleProvider} from "./components/app-theme-provider.js";
import {DialogGroup} from "./components/dialog-group.js";
import {TrpcProvider} from "./components/trpc-provider.js";
import {ValidateSession} from "./components/validate-session.js";
import {LocaleProvider} from "./locale.js";
import {router} from "./routes/router.js";

export const App = () => {
	return (
		<TrpcProvider>
			<LocaleProvider>
				<MuiStyleProvider>
					<ValidateSession>
						<RouterProvider router={router} />
						<DialogGroup />
					</ValidateSession>
				</MuiStyleProvider>
			</LocaleProvider>
		</TrpcProvider>
	);
};
