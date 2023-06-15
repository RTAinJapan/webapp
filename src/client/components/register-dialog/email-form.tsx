import {TextField, Button, LinearProgress} from "@mui/material";
import {useState} from "react";

import {useLocale} from "../../locale";
import {blockStyle} from "../../styles/component";
import {trpc} from "../../trpc";

type Props = {
	onSubmit: (email: string) => void;
	onSuccess: () => void;
};

export const EmailForm = ({onSubmit, onSuccess}: Props) => {
	const locale = useLocale();
	const [emailInput, setEmailInput] = useState("");

	const {mutate: startEmailChallenge, isLoading} =
		trpc.auth.startEmailChallenge.useMutation({
			onMutate: () => {
				onSubmit(emailInput);
			},
			onSuccess,
		});

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				startEmailChallenge({email: emailInput});
			}}
			css={[blockStyle, {flexFlow: "column"}]}
		>
			<TextField
				type="email"
				autoComplete="email"
				label={locale.email}
				value={emailInput}
				disabled={isLoading}
				onChange={({currentTarget}) => {
					setEmailInput(currentTarget.value);
				}}
				css={{margin: "8px 0"}}
			/>
			{isLoading ? (
				<LinearProgress css={{margin: "8px 0"}} />
			) : (
				<Button type="submit" css={{alignSelf: "flex-end"}}>
					{locale.confirm}
				</Button>
			)}
		</form>
	);
};
