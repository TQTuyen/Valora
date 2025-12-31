/**
 * @IsAlpha Decorator
 * @module decorators/property/string/is-alpha
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that string contains only letters (a-z, A-Z)
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Person {
 *   @IsString()
 *   @IsAlpha()
 *   firstName: string;
 * }
 * ```
 */
export function IsAlpha(): PropertyDecorator {
  return createTypeDecorator(() => string().alpha())();
}
