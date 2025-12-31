/**
 * @MinLength Decorator
 * @module decorators/property/string/min-length
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates minimum string length
 *
 * @param min - Minimum length
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
export function MinLength(min: number): PropertyDecorator {
  return createPropertyDecorator((minLength: number) => string().minLength(minLength))(min);
}
