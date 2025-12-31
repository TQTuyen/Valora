/**
 * @IsAfter Decorator
 * @module decorators/property/date/is-after
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates that date is after the given date (exclusive)
 *
 * @param afterDate - Date must be after this
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @IsDate()
 *   @IsAfter(new Date('2024-01-01'))
 *   endDate: Date;
 * }
 * ```
 */
export function IsAfter(afterDate: Date | string): PropertyDecorator {
  return createPropertyDecorator((d: Date | string) => date().after(d))(afterDate);
}
