import {Button, darken} from "@mui/material";

import {useSocialLoginStore} from "../../stores/social-login";

type Props = {
	label: string;
	backgroundColor: string;
	iconPath: string;
	iconAlt: string;
	loginUrl: string;
};

export const SocialSignInButton = ({
	backgroundColor,
	iconPath,
	iconAlt,
	label,
	loginUrl,
}: Props) => {
	const {setPopupWindow} = useSocialLoginStore();

	return (
		<Button
			href={loginUrl}
			onClick={(event) => {
				event.preventDefault();
				const popup = window.open(
					loginUrl,
					"SocialSignInPopup",
					"opener,popup,left=100,top=100,width=600,height=800"
				);
				if (popup) {
					setPopupWindow(popup);
				}
			}}
			target="SocialSignInPopup"
			rel="nofollow"
			variant="contained"
			size="large"
			startIcon={
				<img
					src={iconPath}
					alt={iconAlt}
					css={{width: "2rem", height: "2rem", filter: "invert(1)"}}
				/>
			}
			css={{
				backgroundColor,
				"&:hover": {backgroundColor: darken(backgroundColor, 0.15)},
				color: "#ffffff",
			}}
		>
			{label}
		</Button>
	);
};
