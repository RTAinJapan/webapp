import * as nodemailer from "nodemailer";

import {ENV} from "./constants.js";

const NOREPLY_EMAIL = "noreply@rtain.jp";

const mailer = nodemailer.createTransport({
	host: ENV.EMAIL_HOST,
	port: 9025,
	secure: false,
	auth: {
		user: ENV.EMAIL_USER,
		pass: ENV.EMAIL_PASS,
	},
	socketTimeout: 5000,
});

export const sendTokenEmail = async (email: string, token: number) => {
	await mailer.sendMail({
		from: NOREPLY_EMAIL,
		to: email,
		subject: "rtain.jp",
		text: token.toString().padStart(6, "0"),
	});
};

export const sendDuplicateEmailNotification = async (email: string) => {
	await mailer.sendMail({
		from: NOREPLY_EMAIL,
		to: email,
		subject: "Register attempt on rtaij.app",
		text: "Someone tried to register on rtaij.app with your email, but your account already exists. If this was you, please sign in. If this was not you, please ignore this email.",
	});
};
