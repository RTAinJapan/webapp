import {Dialog} from "@mui/material";

import {useDialogStore} from "../stores/dialog.js";

import {RegisterDialog} from "./register-dialog/index.js";
import {SignInDialog} from "./sign-in-dialog/index.js";

export const DialogGroup = () => {
	const {activeDialog, closeDialog} = useDialogStore();
	return (
		<>
			<Dialog open={activeDialog === "signin"} onClose={closeDialog}>
				<SignInDialog />
			</Dialog>
			<Dialog open={activeDialog === "register"} onClose={closeDialog}>
				<RegisterDialog />
			</Dialog>
		</>
	);
};
