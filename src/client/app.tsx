import { muiTheme } from "./style/mui-theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./pages/root.js";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./trpc.js";
import { httpBatchLink } from "@trpc/client";

const router = createBrowserRouter([{ path: "/", element: <Root /> }]);

export const App = () => {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [httpBatchLink({ url: "http://localhost:3000" })],
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={muiTheme}>
					<CssBaseline />
					<RouterProvider router={router} />
				</ThemeProvider>
			</QueryClientProvider>
		</trpc.Provider>
	);
};
