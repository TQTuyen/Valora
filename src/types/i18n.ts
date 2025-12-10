/**
 * i18n Types
 * @module types/i18n
 */

/**
 * Nested structure for locale messages
 */
export interface LocaleMessages {
  [key: string]: string | LocaleMessages;
}

/**
 * Message interpolation parameters
 */
export type MessageParams = Record<string, unknown>;

/**
 * i18n plugin interface
 */
export interface II18nPlugin {
  /** Current locale */
  readonly locale: string;

  /**
   * Translate a key with optional interpolation
   * @param key - Translation key (dot-separated)
   * @param params - Interpolation parameters
   * @returns Translated string
   */
  t(key: string, params?: MessageParams): string;

  /**
   * Set the current locale
   * @param locale - Locale to set
   */
  setLocale(locale: string): void;

  /**
   * Load messages for a locale
   * @param locale - Locale to load
   * @param messages - Messages to load
   */
  loadLocale(locale: string, messages: LocaleMessages): void;
}

/**
 * Supported built-in locales
 */
export type SupportedLocale = 'en' | 'vi';
