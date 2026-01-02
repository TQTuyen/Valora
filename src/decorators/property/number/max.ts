/**
 * @Max Decorator
 * @module decorators/property/number/max
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is less than or equal to the maximum
 *
 * @param maximum - Maximum valid value
 * @param options - Validation options
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @Max(18)
 *   age: number;
 * }
 * ```
 */
export function Max(maximum: number, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((max: number, opts?: ValidationOptions) =>
    number().max(max, opts),
  )(maximum, options);
}
