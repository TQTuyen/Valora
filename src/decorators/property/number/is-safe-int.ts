/**
 * @IsSafeInt Decorator
 * @module decorators/property/number/is-safe-int
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is a safe integer
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsSafeInt()
 *   age: number;
 * }
 * ```
 */
export function IsSafeInt(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => number().safe(opts))(options);
}
