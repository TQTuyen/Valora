/**
 * @IsAlpha Decorator
 * @module decorators/property/string/is-alpha
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

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
export function IsAlpha(options?: ValidationOptions): PropertyDecorator {
  return createTypeDecorator(() => string().alpha(options))();
}
