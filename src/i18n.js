import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.js';

const i18nextInstance = i18n.createInstance();

i18nextInstance
  .use(initReactI18next)
  .init({
    debug: false,
    lng: 'ru',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ru,
    },
  });

export default i18nextInstance;
