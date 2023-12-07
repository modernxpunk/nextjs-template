import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
	title: "UI/Button",
	component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
	<Layout>
		<Button {...args}>Button</Button>
	</Layout>
);

export const Primary = Template.bind({});
Primary.args = {
	intent: "primary",
};

export const Secondary = Template.bind({});
Secondary.args = {
	intent: "secondary",
};
