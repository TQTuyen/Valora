/**
 * @IsInt Decorator
 * @module decorators/property/number/is-int
 */

import { number } from '@validators/number';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that the value is an integer
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
export function IsInt(): PropertyDecorator {
  return createTypeDecorator(() => number().integer())();
}
