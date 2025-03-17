import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import { pt } from './pt';

// Available languages
export const languages = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  pt: 'Português'
};

// All translations
export const translations = {
  de,
  en,
  es,
  fr,
  it,
  pt
};

// Default language
export const defaultLanguage = 'en';

// Translation function
export const t = (key, lang = defaultLanguage) => {
  if (!translations[lang]) {
    console.warn(`Language "${lang}" not found, falling back to default language "${defaultLanguage}"`);
    lang = defaultLanguage;
  }
  
  if (!translations[lang][key]) {
    console.warn(`Translation key "${key}" not found in language "${lang}"`);
    return key;
  }
  
  return translations[lang][key];
}; 