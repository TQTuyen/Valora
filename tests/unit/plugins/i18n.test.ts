/**
 * I18n Plugin Unit Tests
 * Tests internationalization functionality
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { I18nPlugin } from '@/plugins/i18n/plugin';

describe('I18nPlugin', () => {
  let i18n: I18nPlugin;

  beforeEach(() => {
    i18n = new I18nPlugin({ defaultLocale: 'en' });
  });

  describe('constructor', () => {
    it('should create instance with default config', () => {
      const instance = new I18nPlugin();

      expect(instance).toBeInstanceOf(I18nPlugin);
      expect(instance.locale).toBe('en');
    });

    it('should set default locale from config', () => {
      const instance = new I18nPlugin({ defaultLocale: 'vi' });

      expect(instance.locale).toBe('vi');
    });

    it('should load built-in locales on construction', () => {
      const instance = new I18nPlugin();

      expect(instance.hasLocale('en')).toBe(true);
      expect(instance.hasLocale('vi')).toBe(true);
    });

    it('should set fallback locale from config', () => {
      const instance = new I18nPlugin({ fallbackLocale: 'vi' });

      expect(instance.getFallbackLocale()).toBe('vi');
    });
  });

  describe('locale getter', () => {
    it('should return current locale', () => {
      expect(i18n.locale).toBe('en');
    });

    it('should reflect locale changes', () => {
      i18n.setLocale('vi');

      expect(i18n.locale).toBe('vi');
    });
  });

  describe('messages getter', () => {
    it('should return current locale messages', () => {
      const messages = i18n.messages;

      expect(messages).toBeDefined();
      expect(typeof messages).toBe('object');
    });

    it('should return different messages for different locales', () => {
      const enMessages = i18n.messages;
      i18n.setLocale('vi');
      const viMessages = i18n.messages;

      expect(enMessages).not.toEqual(viMessages);
    });

    it('should return empty object for non-existent locale', () => {
      i18n.loadLocale('empty', {});

      i18n.setLocale('empty');
      const messages = i18n.messages;

      expect(messages).toEqual({});
    });
  });

  describe('t() translation', () => {
    it('should translate simple keys', () => {
      const result = i18n.t('string.required');

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should translate nested keys', () => {
      const result = i18n.t('string.minLength');

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return key when translation not found', () => {
      const result = i18n.t('non.existent.key');

      expect(result).toBe('non.existent.key');
    });

    it('should interpolate parameters', () => {
      // Assuming the message contains {min} placeholder
      const result = i18n.t('string.minLength', { min: 5 });

      expect(result).toContain('5');
    });

    it('should handle multiple interpolations', () => {
      const result = i18n.t('number.range', { min: 1, max: 10 });

      // Should contain both values
      expect(result).toContain('1');
      expect(result).toContain('10');
    });

    it('should return different translations for different locales', () => {
      const enResult = i18n.t('string.required');

      i18n.setLocale('vi');
      const viResult = i18n.t('string.required');

      expect(enResult).not.toBe(viResult);
    });

    it('should fallback to fallback locale when key not found in current locale', () => {
      // Add a key only in English
      i18n.loadLocale('en', {
        test: {
          onlyInEnglish: 'This is only in English',
        },
      });

      i18n.setLocale('vi');
      const result = i18n.t('test.onlyInEnglish');

      expect(result).toBe('This is only in English');
    });

    it('should return key when not found in any locale', () => {
      const result = i18n.t('completely.non.existent');

      expect(result).toBe('completely.non.existent');
    });

    it('should handle empty parameters', () => {
      const result = i18n.t('string.required', {});

      expect(typeof result).toBe('string');
    });

    it('should handle undefined parameters', () => {
      const result = i18n.t('string.required', undefined);

      expect(typeof result).toBe('string');
    });

    it('should warn on missing translation when configured', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const instance = new I18nPlugin({ warnOnMissing: true });

      instance.t('non.existent.key');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Missing translation'));

      consoleSpy.mockRestore();
    });

    it('should not warn when warnOnMissing is false', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const instance = new I18nPlugin({ warnOnMissing: false });

      instance.t('non.existent.key');

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('setLocale()', () => {
    it('should change current locale', () => {
      i18n.setLocale('vi');

      expect(i18n.locale).toBe('vi');
    });

    it('should allow switching between locales', () => {
      i18n.setLocale('vi');
      expect(i18n.locale).toBe('vi');

      i18n.setLocale('en');
      expect(i18n.locale).toBe('en');
    });

    it('should throw error for non-loaded locale', () => {
      expect(() => {
        i18n.setLocale('fr');
      }).toThrow();
    });

    it('should throw error with helpful message', () => {
      expect(() => {
        i18n.setLocale('fr');
      }).toThrow(/not loaded/i);
    });

    it('should allow setting to previously loaded locale', () => {
      i18n.loadLocale('fr', { test: 'Bonjour' });

      expect(() => {
        i18n.setLocale('fr');
      }).not.toThrow();
    });
  });

  describe('loadLocale()', () => {
    it('should load new locale', () => {
      i18n.loadLocale('fr', {
        string: {
          required: 'Ce champ est obligatoire',
        },
      });

      expect(i18n.hasLocale('fr')).toBe(true);
    });

    it('should allow using loaded locale', () => {
      i18n.loadLocale('fr', {
        string: {
          required: 'Ce champ est obligatoire',
        },
      });

      i18n.setLocale('fr');
      const result = i18n.t('string.required');

      expect(result).toBe('Ce champ est obligatoire');
    });

    it('should merge messages when locale already exists', () => {
      i18n.loadLocale('en', {
        custom: {
          message: 'Custom message',
        },
      });

      const result = i18n.t('custom.message');

      expect(result).toBe('Custom message');
      // Original messages should still exist
      expect(i18n.t('string.required')).not.toBe('string.required');
    });

    it('should deep merge nested messages', () => {
      i18n.loadLocale('en', {
        string: {
          custom: 'New custom message',
        },
      });

      // New message should exist
      expect(i18n.t('string.custom')).toBe('New custom message');
      // Original messages should still exist
      expect(i18n.t('string.required')).not.toBe('string.required');
    });

    it('should allow loading multiple custom locales', () => {
      i18n.loadLocale('fr', { test: 'Bonjour' });
      i18n.loadLocale('de', { test: 'Guten Tag' });
      i18n.loadLocale('es', { test: 'Hola' });

      expect(i18n.hasLocale('fr')).toBe(true);
      expect(i18n.hasLocale('de')).toBe(true);
      expect(i18n.hasLocale('es')).toBe(true);
    });

    it('should handle complex nested structures', () => {
      i18n.loadLocale('test', {
        level1: {
          level2: {
            level3: {
              message: 'Deep message',
            },
          },
        },
      });

      i18n.setLocale('test');
      const result = i18n.t('level1.level2.level3.message');

      expect(result).toBe('Deep message');
    });
  });

  describe('hasLocale()', () => {
    it('should return true for built-in locales', () => {
      expect(i18n.hasLocale('en')).toBe(true);
      expect(i18n.hasLocale('vi')).toBe(true);
    });

    it('should return false for non-loaded locales', () => {
      expect(i18n.hasLocale('fr')).toBe(false);
      expect(i18n.hasLocale('de')).toBe(false);
    });

    it('should return true after loading locale', () => {
      expect(i18n.hasLocale('fr')).toBe(false);

      i18n.loadLocale('fr', { test: 'Test' });

      expect(i18n.hasLocale('fr')).toBe(true);
    });
  });

  describe('getLocales()', () => {
    it('should return all loaded locales', () => {
      const locales = i18n.getLocales();

      expect(locales).toContain('en');
      expect(locales).toContain('vi');
    });

    it('should include newly loaded locales', () => {
      i18n.loadLocale('fr', { test: 'Test' });

      const locales = i18n.getLocales();

      expect(locales).toContain('fr');
    });

    it('should return array', () => {
      const locales = i18n.getLocales();

      expect(Array.isArray(locales)).toBe(true);
    });

    it('should not include duplicate locales', () => {
      const locales = i18n.getLocales();

      const uniqueLocales = [...new Set(locales)];
      expect(locales).toEqual(uniqueLocales);
    });
  });

  describe('getFallbackLocale()', () => {
    it('should return fallback locale', () => {
      const fallback = i18n.getFallbackLocale();

      expect(fallback).toBe('en');
    });

    it('should return custom fallback when set', () => {
      const instance = new I18nPlugin({ fallbackLocale: 'vi' });

      expect(instance.getFallbackLocale()).toBe('vi');
    });
  });

  describe('setFallbackLocale()', () => {
    it('should change fallback locale', () => {
      i18n.setFallbackLocale('vi');

      expect(i18n.getFallbackLocale()).toBe('vi');
    });

    it('should use new fallback for missing translations', () => {
      i18n.loadLocale('vi', {
        test: {
          onlyInVietnamese: 'Chỉ có tiếng Việt',
        },
      });

      i18n.setFallbackLocale('vi');
      i18n.loadLocale('fr', {}); // Empty French locale
      i18n.setLocale('fr');

      const result = i18n.t('test.onlyInVietnamese');

      expect(result).toBe('Chỉ có tiếng Việt');
    });

    it('should allow setting any locale as fallback', () => {
      i18n.loadLocale('custom', { test: 'Custom' });

      expect(() => {
        i18n.setFallbackLocale('custom');
      }).not.toThrow();
    });
  });

  describe('namespace()', () => {
    it('should create namespaced translation function', () => {
      const ts = i18n.namespace('string');

      const result = ts('required');

      expect(result).toBe(i18n.t('string.required'));
    });

    it('should handle parameters in namespaced function', () => {
      const ts = i18n.namespace('string');

      const result = ts('minLength', { min: 5 });

      expect(result).toContain('5');
    });

    it('should work with nested namespaces', () => {
      i18n.loadLocale('en', {
        deeply: {
          nested: {
            key: 'Deeply nested value',
          },
        },
      });

      const deeply = i18n.namespace('deeply');
      const result = deeply('nested.key');

      expect(result).toBe('Deeply nested value');
    });

    it('should create multiple independent namespaced functions', () => {
      const stringNs = i18n.namespace('string');
      const numberNs = i18n.namespace('number');

      const stringResult = stringNs('minLength', { min: 5 });
      const numberResult = numberNs('min', { min: 5 });

      // Both should contain '5' but have different messages
      expect(stringResult).toContain('5');
      expect(numberResult).toContain('5');
      expect(stringResult).not.toBe(numberResult);
    });

    it('should handle missing keys in namespace', () => {
      const ts = i18n.namespace('string');

      const result = ts('non.existent');

      expect(result).toBe('string.non.existent');
    });
  });

  describe('Message interpolation', () => {
    it('should handle simple placeholder', () => {
      i18n.loadLocale('test', {
        greeting: 'Hello, {name}!',
      });
      i18n.setLocale('test');

      const result = i18n.t('greeting', { name: 'World' });

      expect(result).toBe('Hello, World!');
    });

    it('should handle multiple placeholders', () => {
      i18n.loadLocale('test', {
        message: '{greeting}, {name}! You have {count} messages.',
      });
      i18n.setLocale('test');

      const result = i18n.t('message', {
        greeting: 'Hello',
        name: 'John',
        count: 5,
      });

      expect(result).toBe('Hello, John! You have 5 messages.');
    });

    it('should handle missing parameters gracefully', () => {
      i18n.loadLocale('test', {
        message: 'Hello, {name}!',
      });
      i18n.setLocale('test');

      const result = i18n.t('message', {});

      // Should keep placeholder or handle gracefully
      expect(typeof result).toBe('string');
    });

    it('should handle number parameters', () => {
      i18n.loadLocale('test', {
        range: 'Between {min} and {max}',
      });
      i18n.setLocale('test');

      const result = i18n.t('range', { min: 1, max: 100 });

      expect(result).toBe('Between 1 and 100');
    });

    it('should handle boolean parameters', () => {
      i18n.loadLocale('test', {
        status: 'Active: {active}',
      });
      i18n.setLocale('test');

      const result = i18n.t('status', { active: true });

      expect(result).toContain('true');
    });
  });

  describe('Locale switching', () => {
    it('should maintain state across locale switches', () => {
      const enResult = i18n.t('string.required');

      i18n.setLocale('vi');
      const viResult = i18n.t('string.required');

      i18n.setLocale('en');
      const enResultAgain = i18n.t('string.required');

      expect(enResult).toBe(enResultAgain);
      expect(enResult).not.toBe(viResult);
    });

    it('should not lose custom loaded messages after switching', () => {
      i18n.loadLocale('en', {
        custom: { message: 'Custom' },
      });

      i18n.setLocale('vi');
      i18n.setLocale('en');

      const result = i18n.t('custom.message');

      expect(result).toBe('Custom');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string keys', () => {
      const result = i18n.t('');

      expect(result).toBe('');
    });

    it('should handle single-level keys', () => {
      i18n.loadLocale('test', {
        simple: 'Simple value',
      });
      i18n.setLocale('test');

      const result = i18n.t('simple');

      expect(result).toBe('Simple value');
    });

    it('should handle very deep nesting', () => {
      i18n.loadLocale('test', {
        a: { b: { c: { d: { e: { f: 'Deep value' } } } } },
      });
      i18n.setLocale('test');

      const result = i18n.t('a.b.c.d.e.f');

      expect(result).toBe('Deep value');
    });

    it('should handle special characters in messages', () => {
      i18n.loadLocale('test', {
        special: 'Message with <html> & "quotes" and \'apostrophes\'',
      });
      i18n.setLocale('test');

      const result = i18n.t('special');

      expect(result).toContain('<html>');
      expect(result).toContain('"quotes"');
    });

    it('should handle unicode in messages', () => {
      i18n.loadLocale('test', {
        unicode: '你好世界 🌍 こんにちは',
      });
      i18n.setLocale('test');

      const result = i18n.t('unicode');

      expect(result).toBe('你好世界 🌍 こんにちは');
    });

    it('should handle null in parameter interpolation', () => {
      i18n.loadLocale('test', {
        message: 'Value: {value}',
      });
      i18n.setLocale('test');

      const result = i18n.t('message', { value: null });

      expect(typeof result).toBe('string');
    });

    it('should handle undefined in parameter interpolation', () => {
      i18n.loadLocale('test', {
        message: 'Value: {value}',
      });
      i18n.setLocale('test');

      const result = i18n.t('message', { value: undefined });

      expect(typeof result).toBe('string');
    });
  });

  describe('Built-in locales', () => {
    it('should have comprehensive English messages', () => {
      const messages = i18n.messages;

      expect(messages.string).toBeDefined();
      expect(messages.number).toBeDefined();
    });

    it('should have comprehensive Vietnamese messages', () => {
      i18n.setLocale('vi');
      const messages = i18n.messages;

      expect(messages.string).toBeDefined();
      expect(messages.number).toBeDefined();
    });

    it('should have matching keys in both locales', () => {
      const enMessages = i18n.messages;
      i18n.setLocale('vi');
      const viMessages = i18n.messages;

      // Both should have same top-level keys
      const enKeys = Object.keys(enMessages);
      const viKeys = Object.keys(viMessages);

      expect(enKeys.sort()).toEqual(viKeys.sort());
    });
  });
});
