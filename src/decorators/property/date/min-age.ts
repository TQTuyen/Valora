/**
 * @MinAge Decorator
 * @module decorators/property/date/min-age
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that birth date meets minimum age requirement
 *
 * @param years - Minimum age in years
 * @param options - Validation options
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @MinAge(18)
 *   birthDate: Date;
 * }
 * ```
 */
export function MinAge(years: number, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((y: number, opts?: ValidationOptions) => date().minAge(y, opts))(
    years,
    options,
  );
}
