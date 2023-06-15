import type {StorybookConfig} from "@storybook/react-vite";
import browserslistToEsbuild from "browserslist-to-esbuild";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-console",
		"@storybook/addon-a11y",
		"@storybook/addon-coverage",
	],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	docs: {
		autodocs: "tag",
	},
	viteFinal: async (config) => {
		return {
			...config,
			build: {
				...config.build,
				target: browserslistToEsbuild(),
			},
		};
	},
};

export default config;
