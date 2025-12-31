/**
 * @EndsWith Decorator
 * @module decorators/property/string/ends-with
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

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
export function EndsWith(suffix: string): PropertyDecorator {
  return createPropertyDecorator((suf: string) => string().endsWith(suf))(suffix);
}
