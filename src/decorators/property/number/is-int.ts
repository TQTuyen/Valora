/**
 * @IsInt Decorator
 * @module decorators/property/number/is-int
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is an integer
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsInt()
 *   age: number;
 * }
 * ```
 */
export function IsInt(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => number().integer(opts))(options);
}
