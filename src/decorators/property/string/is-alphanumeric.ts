/**
 * @IsAlphanumeric Decorator
 * @module decorators/property/string/is-alphanumeric
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

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
export function IsAlphanumeric(): PropertyDecorator {
  return createTypeDecorator(() => string().alphanumeric())();
}
