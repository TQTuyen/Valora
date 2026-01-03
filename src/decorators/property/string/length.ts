/**
 * @Length Decorator
 * @module decorators/property/string/length
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

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
export function Length(len: number, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((length: number, options?: ValidationOptions) =>
    string().length(length, options),
  )(len, options);
}
