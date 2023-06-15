import type {PropsWithChildren} from "react";
import {useEffect, useState, createContext, useContext} from "react";

import {locales} from "./locales";

const isLocaleKey = (key: string): key is keyof typeof locales => {
	return Object.keys(locales).includes(key);
};

const getLocale = (languages: readonly string[]) => {
	let language: keyof typeof locales = "en";
	for (const candidate of [...languages].reverse()) {
		if (isLocaleKey(candidate)) {
			language = candidate;
		}
		const [languagePart] = candidate.split("-");
		if (typeof languagePart === "string" && isLocaleKey(languagePart)) {
			language = languagePart;
		}
	}
	return locales[language];
};

const defaultLocale = getLocale(navigator.languages);

const localeContext = createContext(defaultLocale);

export const LocaleProvider = ({
	children,
	override,
}: PropsWithChildren<{override?: string}>) => {
	const [locale, setLocale] = useState(defaultLocale);

	useEffect(() => {
		const handler = () => {
			setLocale(getLocale(navigator.languages));
		};
		window.addEventListener("languagechange", handler);
		return () => {
			window.removeEventListener("languagechange", handler);
		};
	}, []);

	return (
		<localeContext.Provider value={override ? getLocale([override]) : locale}>
			{children}
		</localeContext.Provider>
	);
};

export const useLocale = () => {
	return useContext(localeContext);
};
