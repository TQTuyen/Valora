/**
 * @IsWeekend Decorator
 * @module decorators/property/date/is-weekend
 */

import { date } from '@validators/date';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that date is a weekend (Saturday-Sunday)
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @IsDate()
 *   @IsWeekend()
 *   partyDate: Date;
 * }
 * ```
 */
export function IsWeekend(): PropertyDecorator {
  return createTypeDecorator(() => date().weekend())();
}
