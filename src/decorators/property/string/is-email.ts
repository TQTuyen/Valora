/**
 * @IsEmail Decorator
 * @module decorators/property/string/is-email
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that the value is a valid email address
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsEmail()
 *   email: string;
 * }
 * ```
 */
export function IsEmail(): PropertyDecorator {
  return createTypeDecorator(() => string().email())();
}
