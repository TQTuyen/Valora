/**
 * Transform Plugin - Date Timestamp Transforms
 * @module plugins/transform/transforms/date/timestamp
 */

import type { Transformer } from '../../types';

/**
 * Convert to Unix timestamp (seconds)
 */
export const toTimestamp: Transformer<Date, number> = (value: Date) => {
  return Math.floor(value.getTime() / 1000);
};

/**
 * Convert from Unix timestamp (seconds)
 */
export const fromTimestamp: Transformer<number, Date> = (value: number) => {
  return new Date(value * 1000);
};

/**
 * Convert to milliseconds timestamp
 */
export const toMilliseconds: Transformer<Date, number> = (value: Date) => value.getTime();

/**
 * Convert from milliseconds timestamp
 */
export const fromMilliseconds: Transformer<number, Date> = (value: number) => new Date(value);
