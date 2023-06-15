import {Divider, ButtonGroup} from "@mui/material";
import {useEffect, useState} from "react";

import {useLocale} from "../../locale.js";
import {DiscordSignInButton} from "../social-login/discord-sign-in-button.js";
import {GoogleSignInButton} from "../social-login/google-sign-in-button.js";
import {TwitchSingInButton} from "../social-login/twitch-sign-in.button.js";

import {EmailSignInForm} from "./email-sign-in-form.js";

export const SignInDialog = () => {
	const locale = useLocale();
	const [loginPopup] = useState<Window | null>(null);

	// TODO: handle message from login popup
	useEffect(() => {
		if (!loginPopup) {
			return;
		}
		const listener = (event: MessageEvent) => {
			if (event.source !== loginPopup) {
				return;
			}
			console.log(event);
		};
		window.addEventListener("message", listener);
		return () => {
			window.removeEventListener("message", listener);
		};
	}, [loginPopup]);

	return (
		<div
			css={{
				display: "grid",
				padding: "24px",
				gap: "16px",
			}}
		>
			<ButtonGroup orientation="vertical">
				<DiscordSignInButton label={locale.signInWith("Discord")} />
				<TwitchSingInButton label={locale.signInWith("Twitch")} />
				<GoogleSignInButton label={locale.signInWith("Google")} />
			</ButtonGroup>
			<Divider>{locale.or}</Divider>
			<EmailSignInForm />
		</div>
	);
};
