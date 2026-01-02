/**
 * @IsNegative Decorator
 * @module decorators/property/number/is-negative
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is negative (< 0)
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsNegative()
 *   age: number;
 * }
 * ```
 */
export function IsNegative(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => number().negative(opts))(options);
}
