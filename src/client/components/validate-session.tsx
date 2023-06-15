import type {PropsWithChildren} from "react";
import {useEffect} from "react";

import {useAuthStore} from "../stores/auth";
import {trpc} from "../trpc";

export const ValidateSession = ({children}: PropsWithChildren) => {
	const {data, isSuccess} = trpc.auth.validateSession.useQuery();
	const {setUser, setSignedIn} = useAuthStore();

	useEffect(() => {
		setUser(data ?? undefined);
		setSignedIn(data !== undefined && data !== null);
	}, [data, setUser, setSignedIn]);

	if (isSuccess) {
		return children;
	}

	return null;
};
