/**
 * @StartsWith Decorator
 * @module decorators/property/string/starts-with
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that string starts with a specific prefix
 *
 * @param prefix - Required prefix
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Config {
 *   @IsString()
 *   @StartsWith('https://')
 *   secureUrl: string;
 * }
 * ```
 */
export function StartsWith(prefix: string, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((pre: string, options?: ValidationOptions) =>
    string().startsWith(pre, options),
  )(prefix, options);
}
