/**
 * @IsLowercase Decorator
 * @module decorators/property/string/is-lowercase
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

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
export function IsLowercase(options?: ValidationOptions): PropertyDecorator {
  return createTypeDecorator(() => string().lowercase(options))();
}
