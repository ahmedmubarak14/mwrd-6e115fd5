import { describe, it, expect } from 'vitest';
import { getTranslation } from '../translations';
import { enUS } from '../locales/en-US';
import { arSA } from '../locales/ar-SA';

describe('Translation utilities', () => {
  describe('getTranslation', () => {
    it('should return English translation for valid key', () => {
      const translation = getTranslation('common.save', 'en');
      expect(translation).toBe('Save');
    });

    it('should return Arabic translation for valid key', () => {
      const translation = getTranslation('common.save', 'ar');
      expect(typeof translation).toBe('string');
      expect(translation.length).toBeGreaterThan(0);
    });

    it('should return key itself for missing translation', () => {
      const translation = getTranslation('nonexistent.key', 'en');
      expect(translation).toBe('nonexistent.key');
    });

    it('should handle nested keys correctly', () => {
      const translation = getTranslation('common.cancel', 'en');
      expect(translation).toBe('Cancel');
    });

    it('should handle deep nested keys', () => {
      const translation = getTranslation('admin.sections.requests.title', 'en');
      expect(typeof translation).toBe('string');
    });

    it('should return key for invalid language', () => {
      // @ts-expect-error Testing invalid language
      const translation = getTranslation('common.save', 'invalid');
      expect(translation).toBe('common.save');
    });
  });

  describe('Translation coverage', () => {
    function getNestedKeys(obj: any, prefix = ''): string[] {
      let keys: string[] = [];
      
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(getNestedKeys(obj[key], fullKey));
          } else {
            keys.push(fullKey);
          }
        }
      }
      
      return keys;
    }

    it('should have matching keys in English and Arabic', () => {
      const enKeys = new Set(getNestedKeys(enUS));
      const arKeys = new Set(getNestedKeys(arSA));

      const missingInArabic = [...enKeys].filter(key => !arKeys.has(key));
      const missingInEnglish = [...arKeys].filter(key => !enKeys.has(key));

      expect(missingInArabic).toEqual([]);
      expect(missingInEnglish).toEqual([]);
    });

    it('should have all translations as strings', () => {
      const checkAllStrings = (obj: any, path = ''): string[] => {
        const nonStrings: string[] = [];
        
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const fullPath = path ? `${path}.${key}` : key;
            
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              nonStrings.push(...checkAllStrings(obj[key], fullPath));
            } else if (typeof obj[key] !== 'string') {
              nonStrings.push(`${fullPath}: ${typeof obj[key]}`);
            }
          }
        }
        
        return nonStrings;
      };

      const enNonStrings = checkAllStrings(enUS);
      const arNonStrings = checkAllStrings(arSA);

      expect(enNonStrings).toEqual([]);
      expect(arNonStrings).toEqual([]);
    });

    it('should not have empty string translations', () => {
      const checkNoEmpty = (obj: any, path = ''): string[] => {
        const emptyKeys: string[] = [];
        
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const fullPath = path ? `${path}.${key}` : key;
            
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              emptyKeys.push(...checkNoEmpty(obj[key], fullPath));
            } else if (typeof obj[key] === 'string' && obj[key].trim() === '') {
              emptyKeys.push(fullPath);
            }
          }
        }
        
        return emptyKeys;
      };

      const enEmpty = checkNoEmpty(enUS);
      const arEmpty = checkNoEmpty(arSA);

      expect(enEmpty).toEqual([]);
      expect(arEmpty).toEqual([]);
    });
  });

  describe('Common translations', () => {
    const commonKeys = [
      'common.save',
      'common.cancel',
      'common.delete',
      'common.edit',
      'common.view',
      'common.active',
      'common.inactive',
    ];

    commonKeys.forEach(key => {
      it(`should have ${key} in both languages`, () => {
        const enTranslation = getTranslation(key, 'en');
        const arTranslation = getTranslation(key, 'ar');

        expect(enTranslation).not.toBe(key);
        expect(arTranslation).not.toBe(key);
        expect(enTranslation).not.toBe(arTranslation);
      });
    });
  });

  describe('RTL markers', () => {
    it('should not contain LTR marks in Arabic translations', () => {
      const checkLTR = (obj: any): string[] => {
        const keysWithLTR: string[] = [];
        
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              keysWithLTR.push(...checkLTR(obj[key]));
            } else if (typeof obj[key] === 'string' && obj[key].includes('\u200E')) {
              keysWithLTR.push(key);
            }
          }
        }
        
        return keysWithLTR;
      };

      const ltrInArabic = checkLTR(arSA);
      expect(ltrInArabic).toEqual([]);
    });
  });
});
