/**
 * @EndsWith Decorator
 * @module decorators/property/string/ends-with
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that string ends with a specific suffix
 *
 * @param suffix - Required suffix
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class File {
 *   @IsString()
 *   @EndsWith('.pdf')
 *   filename: string;
 * }
 * ```
 */
export function EndsWith(suffix: string, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((suf: string, options?: ValidationOptions) =>
    string().endsWith(suf, options),
  )(suffix, options);
}
