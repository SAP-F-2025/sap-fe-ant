import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import vi from "./locales/vi.json";

export const resources = {
	vi: { translation: vi },
	en: { translation: en },
} as const;

export const supportedLanguages = [
	{ code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
	{ code: "en", label: "English", flag: "🇺🇸" },
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number]["code"];

const LANGUAGE_STORAGE_KEY = "app-language";

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "vi",
		defaultNS: "translation",
		interpolation: {
			escapeValue: false, // React already escapes values
		},
		detection: {
			order: ["localStorage", "navigator"],
			lookupLocalStorage: LANGUAGE_STORAGE_KEY,
			caches: ["localStorage"],
		},
	});

// Helper to change language and persist
export const changeLanguage = (lang: SupportedLanguage) => {
	localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
	return i18n.changeLanguage(lang);
};

// Helper to get current language
export const getCurrentLanguage = (): SupportedLanguage => {
	return (i18n.language || "vi") as SupportedLanguage;
};

export default i18n;
