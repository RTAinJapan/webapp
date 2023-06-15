import {AppBar, Button, Container, Toolbar} from "@mui/material";
import {Link} from "react-router-dom";

import appLogo from "../images/app-logo.png";
import {useLocale} from "../locale";
import {useAuthStore} from "../stores/auth";
import {useDialogStore} from "../stores/dialog";
import {blockStyle, layoutStyle} from "../styles/component";
import {trpc} from "../trpc";

export const Header = () => {
	const locale = useLocale();
	const {openRegisterDialog, openSingInDialog} = useDialogStore();
	const {signedIn, setSignedIn} = useAuthStore();
	const utils = trpc.useContext();
	const {mutate: signOut} = trpc.auth.signOut.useMutation({
		onSuccess: () => {
			void utils.invalidate();
		},
	});

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Container>
						<div
							css={[
								layoutStyle,
								{
									gridTemplateColumns: "150px 1fr auto",
									alignItems: "center",
									gap: "16px",
								},
							]}
						>
							<Link to="/" css={blockStyle}>
								<img
									src={appLogo}
									alt="RTA in Japan"
									css={{height: "54px", alignSelf: "center"}}
								/>
							</Link>
							<div css={blockStyle}>{/* TODO: menues */}</div>
							<div css={[blockStyle, {alignItems: "center", gap: "8px"}]}>
								{signedIn ? (
									<Button
										onClick={() => {
											signOut();
											setSignedIn(false);
										}}
									>
										{locale.signOut}
									</Button>
								) : (
									<>
										<Button onClick={openSingInDialog}>{locale.signin}</Button>
										<Button onClick={openRegisterDialog}>
											{locale.register}
										</Button>
									</>
								)}
							</div>
						</div>
					</Container>
				</Toolbar>
			</AppBar>
		</>
	);
};
