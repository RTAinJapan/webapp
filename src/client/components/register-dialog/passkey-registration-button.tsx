import KeyIcon from "@mui/icons-material/Key";
import {Button, Snackbar, Alert} from "@mui/material";
import {startRegistration} from "@simplewebauthn/browser";
import {useState} from "react";

import {trpc} from "../../trpc";

export const PasskeyRegistrationButton = () => {
	const [registrationDataFetchEnabled, setRegistrationDataFetchEnabled] =
		useState(true);
	const {data, isSuccess} = trpc.passkey.passkeyRegistrationData.useQuery(
		undefined,
		{enabled: registrationDataFetchEnabled}
	);
	const {mutateAsync: verify} = trpc.passkey.registerPasskey.useMutation();

	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const startPasskeyFlow = async () => {
		if (!isSuccess) {
			return;
		}
		try {
			setRegistrationDataFetchEnabled(false);
			const result = await startRegistration(data);
			const verifyResult = await verify(result);
			if (verifyResult.verified) {
				setSnackbarOpen(true);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setRegistrationDataFetchEnabled(true);
		}
	};

	return (
		<>
			<Button
				color="success"
				size="large"
				variant="contained"
				disabled={!isSuccess}
				startIcon={<KeyIcon css={{width: "2rem", height: "2rem"}} />}
				onClick={() => {
					void startPasskeyFlow();
				}}
			>
				Register Passkey
			</Button>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={5 * 1000}
				onClose={() => setSnackbarOpen(false)}
			>
				<Alert severity="info">Passkey registered successfuly</Alert>
			</Snackbar>
		</>
	);
};
