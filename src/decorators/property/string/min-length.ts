/**
 * @MinLength Decorator
 * @module decorators/property/string/min-length
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/validators';

/**
 * Validates minimum string length
 *
 * @param min - Minimum length
 * @param options - Validation options
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsString()
 *   @MinLength(2)
 *   name: string;
 * }
 * ```
 */
export function MinLength(min: number, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((minLength: number, options?: ValidationOptions) =>
    string().minLength(minLength, options),
  )(min, options);
}
