import type {Locale} from "./definition";
import en from "./en.js";
import ja from "./ja.js";

export const locales = {en, ja} satisfies Record<string, Locale>;
