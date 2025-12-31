/**
 * @MinDate Decorator
 * @module decorators/property/date/min-date
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates minimum date (inclusive)
 *
 * @param minDate - Minimum date allowed
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @IsDate()
 *   @MinDate(new Date('2024-01-01'))
 *   startDate: Date;
 * }
 * ```
 */
export function MinDate(minDate: Date | string): PropertyDecorator {
  return createPropertyDecorator((min: Date | string) => date().min(min))(minDate);
}
