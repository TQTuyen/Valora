/**
 * @MaxDate Decorator
 * @module decorators/property/date/max-date
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates maximum date (inclusive)
 *
 * @param maxDate - Maximum date allowed
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @IsDate()
 *   @MaxDate(new Date('2025-12-31'))
 *   endDate: Date;
 * }
 * ```
 */
export function MaxDate(maxDate: Date | string): PropertyDecorator {
  return createPropertyDecorator((max: Date | string) => date().max(max))(maxDate);
}
