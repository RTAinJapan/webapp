import type {Meta, StoryObj} from "@storybook/react";

import {DiscordSignInButton} from "./discord-sign-in-button";

const meta = {
	component: DiscordSignInButton,
} as Meta<typeof DiscordSignInButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Sign in with Discord",
	},
};
