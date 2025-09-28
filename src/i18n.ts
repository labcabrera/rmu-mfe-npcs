import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import enSkills from './locales/skills_en.json';

const enTranslations = {
  ...en,
  ...enSkills,
};

const resources = {
  en: { translation: enTranslations },
  es: { translation: es },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
