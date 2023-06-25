import {TextField} from "@mui/material";
import {useEffect, useMemo, useState} from "react";

import {API_ERROR_MESSAGE} from "../../../util/api-error-message";
import {useLocale} from "../../locale";
import {blockStyle} from "../../styles/component";
import {trpc} from "../../trpc";

type Props = {
	email: string;
	onSuccess: () => void;
};

export const ConfirmTokenInput = ({email, onSuccess}: Props) => {
	const locale = useLocale();
	const [tokenInput, setChallengeTokenInput] = useState("");
	const utils = trpc.useContext();

	const {mutate, error, isError} =
		trpc.registration.createUserWithEmailChallenge.useMutation({
			onSuccess: () => {
				onSuccess();
				void utils.authorization.validateSession.invalidate();
			},
		});

	useEffect(() => {
		if (/^\d{6}$/.test(tokenInput)) {
			mutate({
				email,
				token: parseInt(tokenInput),
			});
		}
	}, [tokenInput, email, mutate]);

	const helperText = useMemo(() => {
		if (isError) {
			if (error.message === API_ERROR_MESSAGE.UNAUTHORIZED.tokenExpired) {
				return locale[API_ERROR_MESSAGE.UNAUTHORIZED.tokenExpired];
			}
			if (error.message === API_ERROR_MESSAGE.UNAUTHORIZED.tokenNotMatched) {
				return locale[API_ERROR_MESSAGE.UNAUTHORIZED.tokenNotMatched];
			}
		}
		return locale.emailChallengeSent;
	}, [isError, error, locale]);

	return (
		<TextField
			label={locale.token}
			helperText={helperText}
			error={isError}
			value={tokenInput}
			onChange={({currentTarget: {value}}) => {
				const match = value.match(/(\d{0,6})/);
				if (match?.[0]) {
					setChallengeTokenInput(match[0]);
				} else if (!value) {
					setChallengeTokenInput("");
				}
			}}
			css={[blockStyle, {margin: "8px 0"}]}
		/>
	);
};
