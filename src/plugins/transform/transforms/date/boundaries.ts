/**
 * Transform Plugin - Date Boundaries Transforms
 * @module plugins/transform/transforms/date/boundaries
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Set to start of day (00:00:00.000)
 */
export const startOfDay: SameTypeTransformer<Date> = (value: Date) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Set to end of day (23:59:59.999)
 */
export const endOfDay: SameTypeTransformer<Date> = (value: Date) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};
