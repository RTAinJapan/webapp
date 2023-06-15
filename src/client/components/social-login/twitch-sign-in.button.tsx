import twitchIcon from "./assets/twitch-icon.svg";
import {SocialSignInButton} from "./social-sign-in-button";

export const TwitchSingInButton = ({label}: {label: string}) => {
	return (
		<SocialSignInButton
			loginUrl="https://example.com/foo"
			backgroundColor="#9146FF"
			iconPath={twitchIcon}
			iconAlt="Twitch icon"
			label={label}
		/>
	);
};
