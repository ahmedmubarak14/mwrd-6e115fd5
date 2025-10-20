import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../LanguageContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.lang = '';
    document.documentElement.dir = '';
    document.body.className = '';
  });

  describe('useLanguage hook', () => {
    it('should throw error when used outside provider', () => {
      // Expect the hook to throw when used outside provider
      expect(() => {
        renderHook(() => useLanguage());
      }).toThrow('useLanguage must be used within a LanguageProvider');
    });

    it('should provide language context when used inside provider', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      expect(result.current).toHaveProperty('language');
      expect(result.current).toHaveProperty('setLanguage');
      expect(result.current).toHaveProperty('t');
      expect(result.current).toHaveProperty('isRTL');
    });
  });

  describe('Language initialization', () => {
    it('should default to English when no language is stored', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      expect(result.current.language).toBe('en');
      expect(result.current.isRTL).toBe(false);
    });

    it('should load language from localStorage', () => {
      localStorageMock.setItem('language', 'ar');

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      expect(result.current.language).toBe('ar');
      expect(result.current.isRTL).toBe(true);
    });

    it('should handle invalid localStorage values', () => {
      localStorageMock.setItem('language', 'invalid');

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      expect(result.current.language).toBe('en');
    });
  });

  describe('Language switching', () => {
    it('should switch from English to Arabic', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      act(() => {
        result.current.setLanguage('ar');
      });

      expect(result.current.language).toBe('ar');
      expect(result.current.isRTL).toBe(true);
      expect(localStorageMock.getItem('language')).toBe('ar');
    });

    it('should switch from Arabic to English', () => {
      localStorageMock.setItem('language', 'ar');

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      act(() => {
        result.current.setLanguage('en');
      });

      expect(result.current.language).toBe('en');
      expect(result.current.isRTL).toBe(false);
      expect(localStorageMock.getItem('language')).toBe('en');
    });

    it('should update document attributes on language change', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      act(() => {
        result.current.setLanguage('ar');
      });

      expect(document.documentElement.lang).toBe('ar');
      expect(document.documentElement.dir).toBe('rtl');
      expect(document.body.classList.contains('lang-ar')).toBe(true);
    });
  });

  describe('Translation function', () => {
    it('should return translated strings', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      const translation = result.current.t('common.actions.save');
      expect(typeof translation).toBe('string');
      expect(translation.length).toBeGreaterThan(0);
    });

    it('should return different translations for different languages', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      const englishTranslation = result.current.t('common.actions.save');

      act(() => {
        result.current.setLanguage('ar');
      });

      const arabicTranslation = result.current.t('common.actions.save');

      expect(englishTranslation).not.toBe(arabicTranslation);
    });
  });

  describe('Number formatting', () => {
    it('should format numbers in English', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      const formatted = result.current.formatNumber(1234567.89);
      expect(formatted).toMatch(/1,234,567.89|1 234 567.89/); // Different locales may use different separators
    });

    it('should format numbers in Arabic', () => {
      localStorageMock.setItem('language', 'ar');

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      const formatted = result.current.formatNumber(1234567.89);
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });
  });

  describe('Date formatting', () => {
    it('should format dates in English', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      const date = new Date('2024-01-15');
      const formatted = result.current.formatDate(date);
      
      expect(formatted).toContain('January');
      expect(formatted).toContain('2024');
    });

    it('should format dates in Arabic', () => {
      localStorageMock.setItem('language', 'ar');

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      const date = new Date('2024-01-15');
      const formatted = result.current.formatDate(date);
      
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('2024');
    });
  });

  describe('Currency formatting', () => {
    it('should format currency in English', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      const formatted = result.current.formatCurrency(1234.56);
      expect(formatted).toContain('SAR');
    });

    it('should format currency in Arabic', () => {
      localStorageMock.setItem('language', 'ar');

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      const formatted = result.current.formatCurrency(1234.56);
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });

    it('should support custom currency codes', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      const formatted = result.current.formatCurrency(1234.56, 'USD');
      expect(formatted).toContain('USD');
    });
  });

  describe('RTL support', () => {
    it('should set isRTL to false for English', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      expect(result.current.isRTL).toBe(false);
    });

    it('should set isRTL to true for Arabic', () => {
      localStorageMock.setItem('language', 'ar');

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      expect(result.current.isRTL).toBe(true);
    });

    it('should update isRTL when language changes', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      expect(result.current.isRTL).toBe(false);

      act(() => {
        result.current.setLanguage('ar');
      });

      expect(result.current.isRTL).toBe(true);

      act(() => {
        result.current.setLanguage('en');
      });

      expect(result.current.isRTL).toBe(false);
    });
  });

  describe('Font family updates', () => {
    it('should set Arabic font family when language is Arabic', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      act(() => {
        result.current.setLanguage('ar');
      });

      expect(document.body.style.fontFamily).toContain('Cairo');
      expect(document.body.style.fontFamily).toContain('Noto Sans Arabic');
    });

    it('should set default font family when language is English', () => {
      localStorageMock.setItem('language', 'ar');

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider
      });

      act(() => {
        result.current.setLanguage('en');
      });

      expect(document.body.style.fontFamily).toContain('Cairo');
      expect(document.body.style.fontFamily).not.toContain('Noto Sans Arabic');
    });
  });
});
