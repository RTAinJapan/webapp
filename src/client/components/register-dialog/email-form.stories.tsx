import type {Meta, StoryObj} from "@storybook/react";

import {EmailForm} from "./email-form.js";

const meta = {
	component: EmailForm,
} satisfies Meta<typeof EmailForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
