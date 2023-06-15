export const API_ERROR_MESSAGE = {
	UNAUTHORIZED: {
		tokenNotMatched: "token not matched",
		tokenExpired: "token expired",
		singInRequired: "sign in required",
	},
	BAD_REQUEST: {
		emailAlreadyExists: "email already exists",
	},
	NOT_FOUND: {
		emailChallengeTokenEmailNotFound: "token for email not found",
	},
} as const;
