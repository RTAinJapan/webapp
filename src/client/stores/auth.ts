import {create} from "zustand";

type AuthStore = {
	signedIn: boolean;
	user?: {
		username: string;
	};
	setSignedIn: (signedIn: boolean) => void;
	setUser: (user?: {username: string}) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
	signedIn: false,
	setSignedIn: (signedIn) => set({signedIn}),
	setUser: (user) => set({user}),
}));
