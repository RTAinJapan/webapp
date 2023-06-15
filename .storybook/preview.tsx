import "../src/client/styles/fonts.css";

import type {Preview} from "@storybook/react";
import {CssBaseline, ThemeProvider, createTheme} from "@mui/material";
import {LocaleProvider} from "../src/client/locale";
import {RouterProvider, createBrowserRouter} from "react-router-dom";

const preview: Preview = {
	parameters: {
		actions: {argTypesRegex: "^on[A-Z].*"},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
		backgrounds: {
			default: window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light",
		},
	},
	decorators: [
		(Story, {globals, parameters: {backgrounds}}) => {
			const selectedBackgroundValue =
				globals["backgrounds"]?.value ?? backgrounds.default;
			const selectedBackground = backgrounds?.values?.find(
				(bg: any) =>
					bg.name === selectedBackgroundValue ||
					bg.value === selectedBackgroundValue
			);
			return (
				<ThemeProvider
					theme={createTheme({
						palette: {
							mode: selectedBackground?.name === "dark" ? "dark" : "light",
						},
					})}
				>
					<CssBaseline />
					<Story />
				</ThemeProvider>
			);
		},
		(Story, {globals}) => {
			const selectedLocale = globals["locale"];
			return (
				<LocaleProvider override={selectedLocale}>
					<Story />
				</LocaleProvider>
			);
		},
		(Story) => (
			<RouterProvider
				router={createBrowserRouter([{path: "*", element: <Story />}])}
			/>
		),
	],
	globalTypes: {
		locale: {
			name: "Locale",
			toolbar: {
				icon: "globe",
				items: [
					{value: "en", title: "en"},
					{value: "en-US", title: "en-US"},
					{value: "ja", title: "ja"},
					{value: "ja-JP", title: "ja-JP"},
					{value: "xx", title: "Unknown"},
				],
				showName: true,
			},
		},
	},
};

export default preview;
