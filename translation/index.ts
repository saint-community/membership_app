import { init18n } from 'core/i18n/init';
import en from 'translation/en.json';
import fr from 'translation/fr.json';

export const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

export const fallbackLng = 'en';

export type LanguageCode = keyof typeof resources;

const i18n = init18n({ resources, fallbackLng });

export const languages: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
];

export default i18n;
