/**
 * @MinAge Decorator
 * @module decorators/property/date/min-age
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates minimum age in years (for birthdate validation)
 *
 * @param years - Minimum age in years
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsDate()
 *   @MinAge(18)
 *   birthDate: Date;
 * }
 * ```
 */
export function MinAge(years: number): PropertyDecorator {
  return createPropertyDecorator((minYears: number) => date().minAge(minYears))(years);
}
