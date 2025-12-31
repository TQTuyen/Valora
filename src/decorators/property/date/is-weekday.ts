/**
 * @IsWeekday Decorator
 * @module decorators/property/date/is-weekday
 */

import { date } from '@validators/date';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that date is a weekday (Monday-Friday)
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Meeting {
 *   @IsDate()
 *   @IsWeekday()
 *   scheduledDate: Date;
 * }
 * ```
 */
export function IsWeekday(): PropertyDecorator {
  return createTypeDecorator(() => date().weekday())();
}
