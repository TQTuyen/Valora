/**
 * @IsString Decorator
 * @module decorators/property/string/is-string
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that the value is a string
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsString()
 *   name: string;
 * }
 * ```
 */
export function IsString(): PropertyDecorator {
  return createTypeDecorator(() => string())();
}
