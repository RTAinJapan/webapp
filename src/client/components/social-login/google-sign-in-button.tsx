import googleIcon from "./assets/google-icon.svg";
import {SocialSignInButton} from "./social-sign-in-button";

export const GoogleSignInButton = ({label}: {label: string}) => {
	return (
		<SocialSignInButton
			label={label}
			loginUrl="https://example.com/foo"
			backgroundColor="#4285F4"
			iconPath={googleIcon}
			iconAlt="Google icon"
		/>
	);
};
