/**
 * @IsDate Decorator
 * @module decorators/property/date/is-date
 */

import { date } from '@validators/date';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that the value is a date
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Event {
 *   @IsDate()
 *   startDate: Date;
 * }
 * ```
 */
export function IsDate(): PropertyDecorator {
  return createTypeDecorator(() => date())();
}
