/**
 * Transform Plugin - Date Locale Transforms
 * @module plugins/transform/transforms/date/locale
 */

import type { Transformer } from '../../types';

/**
 * Format to locale date string
 */
export function toLocaleDateString(locale?: string): Transformer<Date, string> {
  return (value: Date) => value.toLocaleDateString(locale);
}

/**
 * Format to locale time string
 */
export function toLocaleTimeString(locale?: string): Transformer<Date, string> {
  return (value: Date) => value.toLocaleTimeString(locale);
}

/**
 * Format to locale string
 */
export function toLocaleString(locale?: string): Transformer<Date, string> {
  return (value: Date) => value.toLocaleString(locale);
}
