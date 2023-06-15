import {API_ERROR_MESSAGE} from "../../util/api-error-message";

import type {Locale} from "./definition";

const translations: Locale = {
	signin: "ログイン",
	signInWith: (provider: string) => `${provider}でログイン`,
	cancel: "キャンセル",
	email: "メールアドレス",
	or: "または",
	connectAccount: (provider: string) => `${provider}と連携`,

	signOut: "ログアウト",

	register: "新規登録",
	confirm: "確認",
	token: "確認コード",
	emailChallengeSent: `確認コードをメールで送信しました`,
	emailChallengeSendFailed: "確認コードの送信に失敗しました",

	[API_ERROR_MESSAGE.UNAUTHORIZED.tokenExpired]: "確認コードが期限切れです",
	[API_ERROR_MESSAGE.UNAUTHORIZED.tokenNotMatched]: "確認コードが一致しません",
};

export default translations;
