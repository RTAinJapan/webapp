import {useState} from "react";

import {ConfirmTokenInput} from "./confirm-token-input";
import {EmailForm} from "./email-form";
import {SignInOption} from "./sign-in-option";

export const RegisterDialogContent = () => {
	const [challengedEmail, setChallengedEmail] = useState<string | null>(null);
	const [tokenVerified, setTokenVerified] = useState(false);
	const [emailChallengeSent, setEmailChallengeSent] = useState(false);

	if (tokenVerified) {
		return <SignInOption />;
	}

	if (emailChallengeSent && challengedEmail) {
		return (
			<ConfirmTokenInput
				email={challengedEmail}
				onSuccess={() => setTokenVerified(true)}
			/>
		);
	}

	return (
		<EmailForm
			onSubmit={(email) => setChallengedEmail(email)}
			onSuccess={() => setEmailChallengeSent(true)}
		/>
	);
};
