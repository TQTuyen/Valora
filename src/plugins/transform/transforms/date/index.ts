/**
 * Transform Plugin - Date Transforms
 * @module plugins/transform/transforms/date
 */

export * from './arithmetic';
export * from './boundaries';
export * from './components';
export * from './formatting';
export * from './locale';
export * from './timestamp';

// Re-export as collection for backwards compatibility
import {
  addDays,
  addHours,
  addMilliseconds,
  addMinutes,
  subtractDays,
  subtractHours,
} from './arithmetic';
import { endOfDay, startOfDay } from './boundaries';
import {
  getDate,
  getDay,
  getHours,
  getMinutes,
  getMonth,
  getSeconds,
  getYear,
} from './components';
import { toDateString, toISODate, toISOString, toTimeString, toUTCString } from './formatting';
import { toLocaleDateString, toLocaleString, toLocaleTimeString } from './locale';
import { fromMilliseconds, fromTimestamp, toMilliseconds, toTimestamp } from './timestamp';

export const dateTransforms = {
  // ISO
  toISOString,
  toISODate,

  // Start/End
  startOfDay,
  endOfDay,

  // Add/Subtract
  addDays,
  addHours,
  addMinutes,
  addMilliseconds,
  subtractDays,
  subtractHours,

  // Locale
  toLocaleDateString,
  toLocaleTimeString,
  toLocaleString,

  // Timestamp
  toTimestamp,
  fromTimestamp,
  toMilliseconds,
  fromMilliseconds,

  // Components
  getYear,
  getMonth,
  getDate,
  getDay,
  getHours,
  getMinutes,
  getSeconds,

  // Formats
  toUTCString,
  toDateString,
  toTimeString,
};
