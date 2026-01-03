/**
 * @IsAlphanumeric Decorator
 * @module decorators/property/string/is-alphanumeric
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that string contains only letters and numbers
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsString()
 *   @IsAlphanumeric()
 *   username: string;
 * }
 * ```
 */
export function IsAlphanumeric(options?: ValidationOptions): PropertyDecorator {
  return createTypeDecorator(() => string().alphanumeric(options))();
}
