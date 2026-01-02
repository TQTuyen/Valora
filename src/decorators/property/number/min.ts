/**
 * @Min Decorator
 * @module decorators/property/number/min
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is greater than or equal to the minimum
 *
 * @param minimum - Minimum valid value
 * @param options - Validation options
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @Min(18)
 *   age: number;
 * }
 * ```
 */
export function Min(minimum: number, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((min: number, opts?: ValidationOptions) =>
    number().min(min, opts),
  )(minimum, options);
}
