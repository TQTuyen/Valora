/**
 * @IsLowercase Decorator
 * @module decorators/property/string/is-lowercase
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that string is all lowercase
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsString()
 *   @IsLowercase()
 *   username: string;
 * }
 * ```
 */
export function IsLowercase(): PropertyDecorator {
  return createTypeDecorator(() => string().lowercase())();
}
