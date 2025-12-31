/**
 * @IsBefore Decorator
 * @module decorators/property/date/is-before
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates that date is before the given date (exclusive)
 *
 * @param beforeDate - Date must be before this
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @IsDate()
 *   @IsBefore(new Date('2025-12-31'))
 *   startDate: Date;
 * }
 * ```
 */
export function IsBefore(beforeDate: Date | string): PropertyDecorator {
  return createPropertyDecorator((d: Date | string) => date().before(d))(beforeDate);
}
