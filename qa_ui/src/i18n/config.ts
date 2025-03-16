import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: import.meta.env.DEV, // Chỉ enable debug trong môi trường dev
        interpolation: {
            escapeValue: false, // Không cần escape do React tự xử lý
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json', // Đường dẫn đến file ngôn ngữ
        },
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator'],
            caches: ['cookie', 'localStorage'],
        },
    });

export default i18n;