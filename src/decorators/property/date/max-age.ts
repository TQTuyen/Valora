/**
 * @MaxAge Decorator
 * @module decorators/property/date/max-age
 */

import { date } from '@validators/date';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that birth date does not exceed maximum age requirement
 *
 * @param years - Maximum age in years
 * @param options - Validation options
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @MaxAge(18)
 *   birthDate: Date;
 * }
 * ```
 */
export function MaxAge(years: number, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((y: number, opts?: ValidationOptions) => date().maxAge(y, opts))(
    years,
    options,
  );
}
