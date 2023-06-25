import * as crypto from "node:crypto";

export const secureRandomInt = (min: number, max: number) => {
	return new Promise<number>((resolve, reject) => {
		crypto.randomInt(min, max, (error, n) => {
			if (error) {
				reject(error);
			} else {
				resolve(n);
			}
		});
	});
};
