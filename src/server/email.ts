import * as nodemailer from "nodemailer";
import {z} from "zod";

const EMAIL_HOST = z.string().email().parse(process.env["EMAIL_HOST"]);
const EMAIL_USER = z.string().email().parse(process.env["EMAIL_USER"]);
const EMAIL_PASS = z.string().email().parse(process.env["EMAIL_PASS"]);

export const mailer = nodemailer.createTransport({
	host: EMAIL_HOST,
	port: 9025,
	secure: false,
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASS,
	},
	socketTimeout: 5000,
});
