"use server";

import nodemailer from "nodemailer";

type EmailPayload = {
	to: string;
	subject: string;
	text: string;
};

export async function sendEmail({ to, subject, text }: EmailPayload): Promise<{
	success: boolean;
	error?: string;
}> {
	const emailUser = process.env.EMAIL_USER;
	const emailPass = process.env.EMAIL_PASS;

	if (!emailUser || !emailPass) {
		console.error("EMAIL_USER, EMAIL_PASS not set in environment variables");
		return {
			success: false,
			error: "Email configuration error",
		};
	}

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: emailUser,
			pass: emailPass,
		},
	});

	try {
		await transporter.sendMail({
			from: emailUser,
			to,
			subject,
			text,
		});

		return { success: true };
	} catch (error) {
		console.error("Failed to send email:", error);

		return {
			success: false,
			// @ts-ignore
			error: error?.message || "Unknown error",
		};
	}
}
