import {ButtonGroup} from "@mui/material";

import {useLocale} from "../../locale";
import {blockStyle} from "../../styles/component";
import {DiscordSignInButton} from "../social-login/discord-sign-in-button";
import {GoogleSignInButton} from "../social-login/google-sign-in-button";
import {TwitchSingInButton} from "../social-login/twitch-sign-in.button";

import {PasskeyRegistrationButton} from "./passkey-registration-button";

export const SignInOption = () => {
	const locale = useLocale();

	return (
		<div css={[blockStyle, {flexDirection: "column", gap: "8px"}]}>
			<PasskeyRegistrationButton />
			<ButtonGroup orientation="vertical">
				<DiscordSignInButton label={locale.connectAccount("Discord")} />
				<TwitchSingInButton label={locale.connectAccount("Twitch")} />
				<GoogleSignInButton label={locale.connectAccount("Google")} />
			</ButtonGroup>
		</div>
	);
};
