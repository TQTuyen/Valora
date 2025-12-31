/**
 * @IsPast Decorator
 * @module decorators/property/date/is-past
 */

import { date } from '@validators/date';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that date is in the past
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsDate()
 *   @IsPast()
 *   birthDate: Date;
 * }
 * ```
 */
export function IsPast(): PropertyDecorator {
  return createTypeDecorator(() => date().past())();
}
