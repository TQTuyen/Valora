/**
 * @IsString Decorator
 * @module decorators/property/string/is-string
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

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
export function IsString(options?: ValidationOptions): PropertyDecorator {
  return createTypeDecorator(() => {
    const v = string();
    if (options?.message) v.withMessage(options.message);
    return v;
  })();
}
