/**
 * @IsFinite Decorator
 * @module decorators/property/number/is-finite
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that value is a finite number
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsFinite()
 *   age: number;
 * }
 * ```
 */
export function IsFinite(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => number().finite(opts))(options);
}
