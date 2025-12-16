/**
 * Valora Internationalization Plugin
 * Provides localized error messages for validation
 * @module plugins/i18n
 */

// Configuration
export type { I18nConfig } from './config';
export { DEFAULT_CONFIG } from './config';

// Plugin
export { I18nPlugin } from './plugin';

// Global instance management
export { configureI18n, getI18n, setI18n, t } from './global';

// Locale messages
export { enMessages } from './locales/en';
export { viMessages } from './locales/vi';
