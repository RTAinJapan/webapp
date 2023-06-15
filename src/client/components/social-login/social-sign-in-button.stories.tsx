import type {Meta, StoryObj} from "@storybook/react";

import {SocialSignInButton} from "./social-sign-in-button.js";

const meta = {
	component: SocialSignInButton,
	args: {
		backgroundColor: "#9146FF",
		iconPath: "https://via.placeholder.com/64",
		label: "Sign in with Twitch",
		iconAlt: "placeholder icon",
		loginUrl: "https://example.com/login",
	},
} satisfies Meta<typeof SocialSignInButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {};
