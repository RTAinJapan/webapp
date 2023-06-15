import {CssBaseline, ThemeProvider, createTheme} from "@mui/material";
import {useMediaQuery} from "@mui/material";
import {useMemo, type PropsWithChildren} from "react";

import {useColorModeStore} from "../stores/color-mode";

export const MuiStyleProvider = ({children}: PropsWithChildren) => {
	const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");

	const systemColorMode = systemPrefersDark ? "dark" : "light";
	const {colorMode: overrideColorMode} = useColorModeStore();

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode: overrideColorMode ?? systemColorMode,
				},
				typography: {
					fontFamily: 'Roboto, "Noto Sans JP", sans-serif',
				},
			}),
		[systemColorMode, overrideColorMode]
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
};
