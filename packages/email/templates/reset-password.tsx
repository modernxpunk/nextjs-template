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
				<Preview>Reset your password</Preview>
				<Body className="bg-zinc-50 font-sans">
					<Container className="mx-auto py-12">
						<Section className="mt-8 rounded-md bg-zinc-200 p-px">
							<Section className="rounded-[5px] bg-white p-8">
								<Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
									Reset your password
								</Text>
								<Text className="m-0 text-zinc-500">
									Hi {name || email}, we received a request to reset the
									password for {email}.
								</Text>
								<Hr className="my-4" />
								<Text className="m-0 text-zinc-500">
									Use the button below to choose a new password. If you did not
									request this, you can ignore this email.
								</Text>
								<Button
									href={url}
									className="mt-4 rounded-md bg-zinc-950 px-5 py-3 text-white no-underline"
								>
									Reset password
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
	const from = process.env.RESEND_FROM?.trim();
	if (!from) {
		throw new Error("Missing sender address. Set RESEND_FROM.");
	}

	const { error } = await getResendClient().emails.send({
		from,
		to: props.email,
		subject: "Reset your password",
		react: <ForgotPasswordEmail {...props} />,
	});

	if (error) {
		throw new Error(`Failed to send password reset email: ${error.message}`, {
			cause: error,
		});
	}
};
