/**
 * @IsToday Decorator
 * @module decorators/property/date/is-today
 */

import { date } from '@validators/date';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that date is today
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Attendance {
 *   @IsDate()
 *   @IsToday()
 *   checkInDate: Date;
 * }
 * ```
 */
export function IsToday(): PropertyDecorator {
  return createTypeDecorator(() => date().today())();
}
