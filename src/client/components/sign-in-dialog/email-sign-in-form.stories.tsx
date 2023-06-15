import type {Meta, StoryObj} from "@storybook/react";

import {EmailSignInForm} from "./email-sign-in-form.js";

const meta = {
	component: EmailSignInForm,
} satisfies Meta<typeof EmailSignInForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {};
