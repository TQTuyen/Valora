/**
 * I18n Plugin Implementation
 * @module plugins/i18n/plugin
 */

import { interpolate, isObject } from '@utils/index';

import { DEFAULT_CONFIG } from './config';
import { enMessages } from './locales/en';
import { viMessages } from './locales/vi';

import type { I18nConfig } from './config';
import type { II18nPlugin, LocaleMessages } from '#types/index';

/**
 * I18n Plugin for Valora
 * Manages locale messages and provides translation utilities
 *
 * @example
 * ```typescript
 * const i18n = new I18nPlugin({ defaultLocale: 'en' });
 * i18n.t('string.minLength', { min: 5 }); // "Must be at least 5 characters"
 *
 * i18n.setLocale('vi');
 * i18n.t('string.minLength', { min: 5 }); // "Phai co it nhat 5 ky tu"
 * ```
 */
export class I18nPlugin implements II18nPlugin {
  private currentLocale: string;
  private fallbackLocale: string;
  private locales: Map<string, LocaleMessages> = new Map();
  private warnOnMissing: boolean;

  constructor(config: I18nConfig = {}) {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };
    this.currentLocale = mergedConfig.defaultLocale;
    this.fallbackLocale = mergedConfig.fallbackLocale;
    this.warnOnMissing = mergedConfig.warnOnMissing;

    // Load built-in locales
    this.loadBuiltinLocales();
  }

  /**
   * Get the current locale
   */
  get locale(): string {
    return this.currentLocale;
  }

  /**
   * Get the messages for the current locale
   */
  get messages(): LocaleMessages {
    return this.locales.get(this.currentLocale) ?? {};
  }

  /**
   * Translate a key with optional parameter interpolation
   * @param key - Dot-separated translation key (e.g., 'string.minLength')
   * @param params - Parameters for interpolation
   * @returns Translated and interpolated string
   *
   * @example
   * ```typescript
   * i18n.t('string.minLength', { min: 5 });
   * // Returns: "Must be at least 5 characters"
   * ```
   */
  t(key: string, params?: Record<string, unknown>): string {
    // Try current locale first
    let message = this.getMessage(this.currentLocale, key);

    // Fall back to fallback locale if not found
    if (message === undefined && this.currentLocale !== this.fallbackLocale) {
      message = this.getMessage(this.fallbackLocale, key);
    }

    // Return key if message not found
    if (message === undefined) {
      if (this.warnOnMissing) {
        console.warn(
          `[Valora i18n] Missing translation for key: "${key}" in locale: "${this.currentLocale}"`,
        );
      }
      return key;
    }

    // Interpolate parameters
    return interpolate(message, params);
  }

  /**
   * Set the current locale
   * @param locale - Locale to set
   * @throws Error if locale is not loaded
   *
   * @example
   * ```typescript
   * i18n.setLocale('vi');
   * ```
   */
  setLocale(locale: string): void {
    if (!this.hasLocale(locale)) {
      throw new Error(
        `[Valora i18n] Locale "${locale}" is not loaded. Load it first with loadLocale().`,
      );
    }
    this.currentLocale = locale;
  }

  /**
   * Load messages for a locale
   * If the locale already exists, messages will be merged
   * @param locale - Locale identifier
   * @param messages - Messages to load
   *
   * @example
   * ```typescript
   * i18n.loadLocale('fr', {
   *   string: {
   *     required: 'Ce champ est obligatoire',
   *   },
   * });
   * ```
   */
  loadLocale(locale: string, messages: LocaleMessages): void {
    const existing = this.locales.get(locale);
    if (existing) {
      // Deep merge with existing messages
      this.locales.set(locale, this.deepMergeMessages(existing, messages));
    } else {
      this.locales.set(locale, messages);
    }
  }

  /**
   * Check if a locale is loaded
   * @param locale - Locale to check
   * @returns true if the locale is loaded
   */
  hasLocale(locale: string): boolean {
    return this.locales.has(locale);
  }

  /**
   * Get all loaded locales
   * @returns Array of locale identifiers
   */
  getLocales(): string[] {
    return Array.from(this.locales.keys());
  }

  /**
   * Get the fallback locale
   * @returns Fallback locale identifier
   */
  getFallbackLocale(): string {
    return this.fallbackLocale;
  }

  /**
   * Set the fallback locale
   * @param locale - Locale to use as fallback
   */
  setFallbackLocale(locale: string): void {
    this.fallbackLocale = locale;
  }

  /**
   * Create a translation function bound to a specific namespace
   * @param namespace - Namespace prefix (e.g., 'string')
   * @returns Translation function
   *
   * @example
   * ```typescript
   * const ts = i18n.namespace('string');
   * ts('minLength', { min: 5 }); // "Must be at least 5 characters"
   * ```
   */
  namespace(ns: string): (key: string, params?: Record<string, unknown>) => string {
    return (key: string, params?: Record<string, unknown>) => {
      return this.t(`${ns}.${key}`, params);
    };
  }

  /**
   * Get a message by key from a specific locale
   * @param locale - Locale to get message from
   * @param key - Dot-separated key
   * @returns Message string or undefined
   */
  private getMessage(locale: string, key: string): string | undefined {
    const messages = this.locales.get(locale);
    if (!messages) {
      return undefined;
    }

    const keys = key.split('.');
    let current: LocaleMessages | string | undefined = messages;

    for (const k of keys) {
      if (current === undefined || typeof current === 'string') {
        return undefined;
      }
      current = current[k];
    }

    return typeof current === 'string' ? current : undefined;
  }

  /**
   * Deep merge locale messages
   * @param target - Target messages
   * @param source - Source messages to merge
   * @returns Merged messages
   */
  private deepMergeMessages(target: LocaleMessages, source: LocaleMessages): LocaleMessages {
    const result: LocaleMessages = { ...target };

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (
          isObject(sourceValue) &&
          typeof sourceValue !== 'string' &&
          isObject(targetValue) &&
          typeof targetValue !== 'string'
        ) {
          result[key] = this.deepMergeMessages(targetValue, sourceValue);
        } else if (sourceValue !== undefined) {
          result[key] = sourceValue;
        }
      }
    }

    return result;
  }

  /**
   * Load built-in locales (English and Vietnamese)
   */
  private loadBuiltinLocales(): void {
    this.loadLocale('en', enMessages);
    this.loadLocale('vi', viMessages);
  }
}
