import { createTheme } from "@mui/material";

export const muiTheme = createTheme({
	components: {
		MuiButton: {
			defaultProps: {
				variant: "contained",
			},
		},
	},
});
