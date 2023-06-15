import {create} from "zustand";

type SocialLoginStore = {
	popupWindow?: Window;
	setPopupWindow: (popupWindow: Window) => void;

	oauthState?: string;
	setOauthState: (oauthState: string) => void;
};

export const useSocialLoginStore = create<SocialLoginStore>((set) => ({
	setPopupWindow: (popupWindow) => set({popupWindow}),
	setOauthState: (oauthState) => set({oauthState}),
}));
