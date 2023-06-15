import {create} from "zustand";

type ColorModeStore = {
	colorMode: "light" | "dark" | undefined;
	setColorMode: (colorMode: "light" | "dark") => void;
};

export const useColorModeStore = create<ColorModeStore>((set) => ({
	colorMode: undefined,
	setColorMode: (colorMode) => set({colorMode}),
}));
