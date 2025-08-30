
import { enUS } from "./locales/en-US";
import { arSA } from "./locales/ar-SA";

export const i18n = {
  defaultLocale: "en-US",
  locales: ["en-US", "ar-SA"],
} as const;

export const translations = {
  "en-US": enUS,
  "ar-SA": arSA,
};

// Helper function to get translation by key
export const getTranslation = (key: string, locale: 'en' | 'ar' = 'en'): string => {
  const translationKey = locale === 'ar' ? 'ar-SA' : 'en-US';
  const translationObj = translations[translationKey];
  
  console.log(`Translation request - Key: ${key}, Locale: ${locale}, Translation Key: ${translationKey}`);
  
  // Split the key by dots to access nested properties
  const keys = key.split('.');
  let value: any = translationObj;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Return the original key if translation not found (fallback behavior)
      console.warn(`Translation not found for key: ${key}, missing path: ${k}`);
      return key;
    }
  }
  
  const result = typeof value === 'string' ? value : key;
  console.log(`Translation result: ${result}`);
  return result;
};
