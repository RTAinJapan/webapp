import {create} from "zustand";

type DialogStore = {
	activeDialog: "signin" | "register" | undefined;
	openSingInDialog: () => void;
	openRegisterDialog: () => void;
	closeDialog: () => void;
};

export const useDialogStore = create<DialogStore>((set) => ({
	activeDialog: undefined,

	openSingInDialog: () => set({activeDialog: "signin"}),
	openRegisterDialog: () => set({activeDialog: "register"}),
	closeDialog: () => set({activeDialog: undefined}),
}));
