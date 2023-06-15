import {discordSignInUrl} from "../../oauth/discord";

import discordIcon from "./assets/discord-icon.svg";
import {SocialSignInButton} from "./social-sign-in-button";

export const DiscordSignInButton = ({label}: {label: string}) => {
	return (
		<SocialSignInButton
			label={label}
			loginUrl={discordSignInUrl.href}
			backgroundColor="#5865F2"
			iconPath={discordIcon}
			iconAlt="Discord icon"
		/>
	);
};
