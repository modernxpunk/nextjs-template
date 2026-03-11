import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import { getResendClient } from "../index";

type ForgotPasswordTemplateProps = {
	readonly name: string;
	readonly email: string;
	readonly url: string;
};

const ForgotPasswordEmail = ({
	name,
	email,
	url,
}: ForgotPasswordTemplateProps) => {
	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>New email from {name}</Preview>
				<Body className="bg-zinc-50 font-sans">
					<Container className="mx-auto py-12">
						<Section className="mt-8 rounded-md bg-zinc-200 p-px">
							<Section className="rounded-[5px] bg-white p-8">
								<Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
									New email from {name}
								</Text>
								<Text className="m-0 text-zinc-500">
									{name} ({email}) has sent you a message:
								</Text>
								<Hr className="my-4" />
								<Text className="m-0 text-zinc-500">Reset password link:</Text>
								<Button
									href={url}
									className="mt-4 bg-zinc-950 text-white no-underline px-5 py-3 rounded-md hover:bg-zinc-800"
								>
									Reset Password
								</Button>
							</Section>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
};

export const sendForgotPasswordEmail = async (
	props: ForgotPasswordTemplateProps,
) => {
	await getResendClient().emails.send({
		from: "Your Name <onboarding@resend.dev>",
		to: props.email,
		subject: "Reset your password",
		react: <ForgotPasswordEmail {...props} />,
	});
};
