
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

// Helper function to get translation by key with improved fallback
export const getTranslation = (key: string, locale: 'en' | 'ar' = 'en'): string => {
  const translationKey = locale === 'ar' ? 'ar-SA' : 'en-US';
  const translationObj = translations[translationKey];
  
  // Split the key by dots to access nested properties
  const keys = key.split('.');
  let value: any = translationObj;
  
  // Try to get the translation from the requested language
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      value = null;
      break;
    }
  }
  
  // If found and it's a string, return it
  if (typeof value === 'string') {
    return value;
  }
  
  // Fallback to English if not found in the requested language
  if (locale !== 'en') {
    const fallbackObj = translations['en-US'];
    let fallbackValue: any = fallbackObj;
    
    for (const k of keys) {
      if (fallbackValue && typeof fallbackValue === 'object' && k in fallbackValue) {
        fallbackValue = fallbackValue[k];
      } else {
        fallbackValue = null;
        break;
      }
    }
    
    if (typeof fallbackValue === 'string') {
      console.warn(`Translation key "${key}" not found for language "${locale}", using English fallback`);
      return fallbackValue;
    }
  }
  
  // Last resort: return the last part of the key or the key itself
  const lastKey = keys[keys.length - 1] || key;
  console.error(`Translation key "${key}" not found in any language`);
  return lastKey;
};
