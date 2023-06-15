import type {API_ERROR_MESSAGE} from "../../util/api-error-message";

export type Locale = {
	signin: string;
	signInWith: (provider: string) => string;
	cancel: string;
	email: string;
	or: string;

	connectAccount: (provider: string) => string;

	signOut: string;

	register: string;
	confirm: string;
	emailChallengeSent: string;
	emailChallengeSendFailed: string;
	token: string;

	[API_ERROR_MESSAGE.UNAUTHORIZED.tokenNotMatched]: string;
	[API_ERROR_MESSAGE.UNAUTHORIZED.tokenExpired]: string;
};
