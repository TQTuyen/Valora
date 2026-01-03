/**
 * @MaxLength Decorator
 * @module decorators/property/string/max-length
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

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
export function MaxLength(max: number, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((maxLength: number, options?: ValidationOptions) =>
    string().maxLength(maxLength, options),
  )(max, options);
}
