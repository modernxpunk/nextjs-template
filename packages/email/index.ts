import { Resend } from "resend";

let resendClient: Resend | null = null;

export const getResendClient = () => {
	const token = process.env.RESEND_TOKEN;
	if (!token) {
		throw new Error("Missing Resend API key. Set RESEND_TOKEN.");
	}

	if (!resendClient) {
		resendClient = new Resend(token);
	}

	return resendClient;
};

export { sendForgotPasswordEmail } from "./templates/reset-password";
