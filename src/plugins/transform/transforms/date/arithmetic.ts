/**
 * Transform Plugin - Date Arithmetic Transforms
 * @module plugins/transform/transforms/date/arithmetic
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Add days
 */
export function addDays(days: number): SameTypeTransformer<Date> {
  return (value: Date) => {
    const date = new Date(value);
    date.setDate(date.getDate() + days);
    return date;
  };
}

/**
 * Add hours
 */
export function addHours(hours: number): SameTypeTransformer<Date> {
  return (value: Date) => {
    const date = new Date(value);
    date.setHours(date.getHours() + hours);
    return date;
  };
}

/**
 * Add minutes
 */
export function addMinutes(minutes: number): SameTypeTransformer<Date> {
  return (value: Date) => {
    const date = new Date(value);
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  };
}

/**
 * Add milliseconds
 */
export function addMilliseconds(ms: number): SameTypeTransformer<Date> {
  return (value: Date) => new Date(value.getTime() + ms);
}

/**
 * Subtract days
 */
export function subtractDays(days: number): SameTypeTransformer<Date> {
  return addDays(-days);
}

/**
 * Subtract hours
 */
export function subtractHours(hours: number): SameTypeTransformer<Date> {
  return addHours(-hours);
}
