import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	clearScreen: false,
	root: "./src/client",
	plugins: [react()],
});
