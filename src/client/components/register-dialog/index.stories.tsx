import {Dialog} from "@mui/material";
import type {Meta, StoryObj} from "@storybook/react";

import {RegisterDialog} from "./index.js";

const meta = {
	component: RegisterDialog,
	decorators: [
		(Story) => (
			<Dialog open>
				<Story />
			</Dialog>
		),
	],
} satisfies Meta<typeof RegisterDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {
		onStartEmailChallenge: () => Promise.resolve(),
	},
};
