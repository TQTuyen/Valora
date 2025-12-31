/**
 * @Length Decorator
 * @module decorators/property/string/length
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates exact string length
 *
 * @param len - Exact length required
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Code {
 *   @IsString()
 *   @Length(6)
 *   verificationCode: string;
 * }
 * ```
 */
export function Length(len: number): PropertyDecorator {
  return createPropertyDecorator((length: number) => string().length(length))(len);
}
