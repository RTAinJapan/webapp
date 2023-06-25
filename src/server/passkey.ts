import {ENV} from "./constants.js";

export const rpName = ENV.PASSKEY_RP_NAME;

export const rpID = ENV.PASSKEY_RP_ID;

export const origin = ENV.CLIENT_ORIGIN;

export const normalizeBase64 = (base64: string) => {
	return Buffer.from(base64, "base64").toString("base64");
};

export const encodeCredentialId = (credentialId: Uint8Array) => {
	return Buffer.from(credentialId).toString("base64");
};

export const decodeCredentialId = (credentialId: string) => {
	return Uint8Array.from(Buffer.from(credentialId, "base64"));
};
