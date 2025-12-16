/**
 * I18n Configuration
 * @module plugins/i18n/config
 */

import type { SupportedLocale } from '#types/index';

/**
 * Configuration options for the i18n plugin
 */
export interface I18nConfig {
  /** Default locale to use */
  defaultLocale?: SupportedLocale;
  /** Fallback locale when translation is missing */
  fallbackLocale?: SupportedLocale;
  /** Whether to log missing translations */
  warnOnMissing?: boolean;
}

/**
 * Default i18n configuration
 */
export const DEFAULT_CONFIG: Required<I18nConfig> = {
  defaultLocale: 'en',
  fallbackLocale: 'en',
  warnOnMissing: false,
};
