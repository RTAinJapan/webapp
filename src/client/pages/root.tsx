import { Typography } from "@mui/material";
import { trpc } from "../trpc";

export const Root = () => {
	const { data } = trpc.userList.useQuery();
	return (
		<div>
			<Typography variant="h1">This is root</Typography>
			{data?.map((u) => u.username).join(", ")}
		</div>
	);
};
