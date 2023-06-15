import type {Meta, StoryObj} from "@storybook/react";

import {ConfirmTokenInput} from "./confirm-token-input.js";

const meta = {
	component: ConfirmTokenInput,
	args: {
		email: "hoge@example.com",
	},
} satisfies Meta<typeof ConfirmTokenInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {};

export const Error: Story = {};
