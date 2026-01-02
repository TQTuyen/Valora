/**
 * @Range Decorator
 * @module decorators/property/number/range
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is within the specified range
 *
 * @param minimum - Minimum valid value
 * @param maximum - Maximum valid value
 * @param options - Validation options
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @Range(18, 65)
 *   age: number;
 * }
 * ```
 */
export function Range(
  minimum: number,
  maximum: number,
  options?: ValidationOptions,
): PropertyDecorator {
  return createPropertyDecorator((min: number, max: number, opts?: ValidationOptions) =>
    number().min(min).max(max, opts),
  )(minimum, maximum, options);
}
