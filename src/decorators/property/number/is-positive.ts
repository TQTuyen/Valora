/**
 * @IsPositive Decorator
 * @module decorators/property/number/is-positive
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is positive (> 0)
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsPositive()
 *   age: number;
 * }
 * ```
 */
export function IsPositive(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => number().positive(opts))(options);
}
