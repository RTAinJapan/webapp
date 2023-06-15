import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {httpBatchLink} from "@trpc/client";
import {useState, type PropsWithChildren} from "react";
import {z} from "zod";

import {trpc} from "../trpc";

const API_ORIGIN = z
	.string()
	.url()
	.parse(import.meta.env["VITE_API_ORIGIN"]);

export const TrpcProvider = ({children}: PropsWithChildren) => {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: API_ORIGIN,
					fetch: (url, options) => {
						return fetch(url, {
							...options,
							credentials: "include",
						});
					},
				}),
			],
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
};
