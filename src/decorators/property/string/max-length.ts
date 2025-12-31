/**
 * @MaxLength Decorator
 * @module decorators/property/string/max-length
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates maximum string length
 *
 * @param max - Maximum length
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsString()
 *   @MaxLength(50)
 *   name: string;
 * }
 * ```
 */
export function MaxLength(max: number): PropertyDecorator {
  return createPropertyDecorator((maxLength: number) => string().maxLength(maxLength))(max);
}
