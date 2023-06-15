import {Dialog} from "@mui/material";
import type {Meta, StoryObj} from "@storybook/react";

import {SignInDialog} from "./index.js";

const meta = {
	component: SignInDialog,
	decorators: [
		(Story) => (
			<Dialog open>
				<Story />
			</Dialog>
		),
	],
} satisfies Meta<typeof SignInDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {};
