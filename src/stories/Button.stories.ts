import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta = {
	title: "Example/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		intent: { control: "text" },
		size: { control: "text" },
	},
	args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		intent: "primary",
		children: "Hello",
	},
};

export const Secondary: Story = {
	args: {
		intent: "secondary",
		children: "Hello",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		children: "Hello",
	},
};

export const Small: Story = {
	args: {
		size: "sm",
		children: "Hello",
	},
};
