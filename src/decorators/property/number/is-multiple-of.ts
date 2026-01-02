/**
 * @IsMultipleOf Decorator
 * @module decorators/property/number/is-multiple-of
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is a multiple of the given divisor
 *
 * @param divisor - Divisor value
 * @param options - Validation options
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsMultipleOf(2)
 *   age: number;
 * }
 * ```
 */
export function IsMultipleOf(divisor: number, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((d: number, opts?: ValidationOptions) =>
    number().multipleOf(d, opts),
  )(divisor, options);
}
