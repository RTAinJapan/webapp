import {API_ERROR_MESSAGE} from "../../util/api-error-message";

import type {Locale} from "./definition";

const translations: Locale = {
	signin: "Sign in",
	signInWith: (provider: string) => `Sign in with ${provider}`,
	cancel: "Cancel",
	email: "Email",
	or: "or",

	connectAccount: (provider: string) => `Connect ${provider}`,

	signOut: "Sign out",

	register: "Register",
	confirm: "Confirm",
	emailChallengeSent: "Check your email for token",
	emailChallengeSendFailed: "Failed to send token",
	token: "Token",

	[API_ERROR_MESSAGE.UNAUTHORIZED.tokenExpired]:
		"Token is expired, please retry",
	[API_ERROR_MESSAGE.UNAUTHORIZED.tokenNotMatched]: "Token is incorrect",
};

export default translations;
