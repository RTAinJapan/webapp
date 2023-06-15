import {DialogContent, DialogTitle} from "@mui/material";

import {useLocale} from "../../locale";
import {layoutStyle} from "../../styles/component";

import {RegisterDialogContent} from "./content";

export const RegisterDialog = () => {
	const locale = useLocale();

	return (
		<>
			<DialogTitle>{locale.register}</DialogTitle>
			<DialogContent>
				<div css={[layoutStyle]}>
					<RegisterDialogContent />
				</div>
			</DialogContent>
		</>
	);
};
