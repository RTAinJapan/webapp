import {useEffect} from "react";

export const DiscordCallbackPage = () => {
	useEffect(() => {
		const opener = window.opener as Window | null;
		if (opener) {
			console.log(opener);
			opener.postMessage("hello");
		}
		console.log(location.search);
		window.close();
	}, []);

	return null;
};
