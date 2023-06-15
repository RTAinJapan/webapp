import {z} from "zod";

import {CLIENT_ORIGIN} from "./constants.js";

export const rpName = z.string().parse(process.env["PASSKEY_RP_NAME"]);

export const rpID = z.string().parse(process.env["PASSKEY_RP_ID"]);

export const origin = CLIENT_ORIGIN;

export const normalizeBase64 = (base64: string) => {
	return Buffer.from(base64, "base64").toString("base64");
};

export const encodeCredentialId = (credentialId: Uint8Array) => {
	return Buffer.from(credentialId).toString("base64");
};

export const decodeCredentialId = (credentialId: string) => {
	return Uint8Array.from(Buffer.from(credentialId, "base64"));
};
