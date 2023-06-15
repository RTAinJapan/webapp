import {Header} from "../components/header";
import {useAuthStore} from "../stores/auth";

export const Component = () => {
	const {user} = useAuthStore();

	return (
		<>
			<Header />
			<pre>{JSON.stringify(user, null, 2)}</pre>
		</>
	);
};
