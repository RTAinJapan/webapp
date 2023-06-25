import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import {TextField, Button} from "@mui/material";
import {startAuthentication} from "@simplewebauthn/browser";
import {useState} from "react";

import {useLocale} from "../../locale";
import {useDialogStore} from "../../stores/dialog";
import {blockStyle} from "../../styles/component";
import {trpc} from "../../trpc";

export const EmailSignInForm = () => {
	const [inputEmail, setInputEmail] = useState("");
	const locale = useLocale();
	const {mutateAsync: verifyPasskeyAuthentication} =
		trpc.passkey.verifyAuthentication.useMutation();
	const {closeDialog} = useDialogStore();

	const utils = trpc.useContext();

	const {
		data: singInOption,
		mutate: fetchSignInOption,
		isSuccess,
		error,
		isError,
	} = trpc.authorization.emailSignInOptions.useMutation();

	if (isSuccess) {
		const authenticateWithPasskey = async () => {
			if (singInOption?.type !== "passkey") {
				return;
			}
			try {
				const assertion = await startAuthentication(singInOption.options);
				const result = await verifyPasskeyAuthentication({
					email: inputEmail,
					authenticationResponse: assertion,
				});
				if (result.verified) {
					void utils.authorization.validateSession.invalidate();
					closeDialog();
				}
			} catch (error) {
				console.error(error);
			}
		};
		return (
			<div css={[blockStyle, {gap: "8px", flexFlow: "column nowrap"}]}>
				{singInOption?.type === "passkey" && (
					<Button
						variant="contained"
						color="primary"
						startIcon={<KeyIcon />}
						onClick={() => {
							void authenticateWithPasskey();
						}}
					>
						Use Passkey
					</Button>
				)}
				<Button variant="contained" color="secondary" startIcon={<EmailIcon />}>
					Use Email Token
				</Button>
			</div>
		);
	}

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				void fetchSignInOption({email: inputEmail});
			}}
			css={[blockStyle, {flexDirection: "column", gap: "8px"}]}
		>
			<TextField
				type="email"
				autoComplete="email webauthn"
				label={locale.email}
				value={inputEmail}
				error={isError}
				helperText={
					error?.data?.code === "NOT_FOUND" ? "Email not found" : undefined
				}
				onChange={({currentTarget}) => setInputEmail(currentTarget.value)}
			/>
			<Button type="submit" css={{alignSelf: "flex-end"}}>
				Sign In
			</Button>
		</form>
	);
};
