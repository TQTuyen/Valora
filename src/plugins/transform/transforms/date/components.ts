/**
 * Transform Plugin - Date Component Extraction Transforms
 * @module plugins/transform/transforms/date/components
 */

import type { Transformer } from '../../types';

/**
 * Get year
 */
export const getYear: Transformer<Date, number> = (value: Date) => value.getFullYear();

/**
 * Get month (0-11)
 */
export const getMonth: Transformer<Date, number> = (value: Date) => value.getMonth();

/**
 * Get day of month (1-31)
 */
export const getDate: Transformer<Date, number> = (value: Date) => value.getDate();

/**
 * Get day of week (0-6, Sunday=0)
 */
export const getDay: Transformer<Date, number> = (value: Date) => value.getDay();

/**
 * Get hours (0-23)
 */
export const getHours: Transformer<Date, number> = (value: Date) => value.getHours();

/**
 * Get minutes (0-59)
 */
export const getMinutes: Transformer<Date, number> = (value: Date) => value.getMinutes();

/**
 * Get seconds (0-59)
 */
export const getSeconds: Transformer<Date, number> = (value: Date) => value.getSeconds();
