import * as fs from "node:fs/promises";

import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
import {defineConfig} from "vite";

const httpsConfig = async () => {
	try {
		return {
			key: await fs.readFile("./localhost-key.pem"),
			cert: await fs.readFile("./localhost.pem"),
		};
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			console.warn("No SSL certificates found, using HTTP instead.");
			return false;
		}
		throw error;
	}
};

export default defineConfig(async ({command}) => {
	return {
		envDir: "../..",
		clearScreen: false,
		root: "./src/client",
		plugins: [
			react({
				jsxImportSource: "@emotion/react",
				babel: {
					plugins: ["@emotion/babel-plugin"],
				},
			}),
		],
		server: {
			https: command === "serve" && (await httpsConfig()),
		},
		build: {
			outDir: "../../dist",
			emptyOutDir: true,
			target: browserslistToEsbuild(),
		},
	};
});
