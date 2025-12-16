/**
 * Global I18n Instance Management
 * @module plugins/i18n/global
 */

import { I18nPlugin } from './plugin';

import type { I18nConfig } from './config';

/**
 * Default global i18n instance
 * Can be used directly or replaced with a custom instance
 */
let globalI18n: I18nPlugin | null = null;

/**
 * Get the global i18n instance
 * Creates a new instance with default config if none exists
 * @returns Global i18n instance
 */
export function getI18n(): I18nPlugin {
  globalI18n ??= new I18nPlugin();
  return globalI18n;
}

/**
 * Set a custom global i18n instance
 * @param instance - I18n instance to use globally
 */
export function setI18n(instance: I18nPlugin): void {
  globalI18n = instance;
}

/**
 * Configure the global i18n instance
 * Creates a new instance with the provided config
 * @param config - Configuration options
 * @returns The new global i18n instance
 */
export function configureI18n(config: I18nConfig): I18nPlugin {
  globalI18n = new I18nPlugin(config);
  return globalI18n;
}

/**
 * Translate a key using the global i18n instance
 * Convenience function for quick translations
 * @param key - Translation key
 * @param params - Interpolation parameters
 * @returns Translated string
 */
export function t(key: string, params?: Record<string, unknown>): string {
  return getI18n().t(key, params);
}
