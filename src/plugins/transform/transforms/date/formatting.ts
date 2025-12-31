/**
 * Transform Plugin - Date Formatting Transforms
 * @module plugins/transform/transforms/date/formatting
 */

import type { Transformer } from '../../types';

/**
 * Convert to ISO 8601 string
 */
export const toISOString: Transformer<Date, string> = (value: Date) => value.toISOString();

/**
 * Convert to ISO date (YYYY-MM-DD)
 */
export const toISODate: Transformer<Date, string> = (value: Date) => {
  const parts = value.toISOString().split('T');
  return parts[0] ?? '';
};

/**
 * Convert to UTC string
 */
export const toUTCString: Transformer<Date, string> = (value: Date) => value.toUTCString();

/**
 * Convert to date string
 */
export const toDateString: Transformer<Date, string> = (value: Date) => value.toDateString();

/**
 * Convert to time string
 */
export const toTimeString: Transformer<Date, string> = (value: Date) => value.toTimeString();
