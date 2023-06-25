import * as process from "node:process";

import {z} from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().url(),

	CLIENT_ORIGIN: z.string().url(),

	SERVER_ORIGIN: z.string().url(),
	SERVER_HOSTNAME: z.string(),
	SERVER_PORT: z.coerce.number().positive().int(),

	SESSION_COOKIE_NAME: z.string(),

	EMAIL_HOST: z.string(),
	EMAIL_USER: z.string(),
	EMAIL_PASS: z.string(),

	PASSKEY_RP_NAME: z.string(),
	PASSKEY_RP_ID: z.string(),
});

export const ENV = await envSchema.parseAsync(process.env);

export const EMAIL_TOKEN_MINIMUM = 0;
export const EMAIL_TOKEN_MAXIMUM = 999999;
export const EMAIL_TOKEN_VALID_DURATION = 5 * 60 * 1000;
