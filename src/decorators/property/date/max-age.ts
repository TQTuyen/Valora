/**
 * @MaxAge Decorator
 * @module decorators/property/date/max-age
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates maximum age in years (for birthdate validation)
 *
 * @param years - Maximum age in years
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsDate()
 *   @MaxAge(120)
 *   birthDate: Date;
 * }
 * ```
 */
export function MaxAge(years: number): PropertyDecorator {
  return createPropertyDecorator((maxYears: number) => date().maxAge(maxYears))(years);
}
