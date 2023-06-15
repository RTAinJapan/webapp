import {createBrowserRouter} from "react-router-dom";

import {DiscordCallbackPage} from "./oauth-callback/discord.js";

export const router = createBrowserRouter([
	{
		path: "/",
		lazy: () => import("./index.js"),
	},
	{
		path: "oauth-callback",
		children: [
			{
				path: "discord",
				Component: DiscordCallbackPage,
			},
		],
	},
]);
