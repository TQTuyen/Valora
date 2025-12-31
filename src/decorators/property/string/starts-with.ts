/**
 * @StartsWith Decorator
 * @module decorators/property/string/starts-with
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

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
export function StartsWith(prefix: string): PropertyDecorator {
  return createPropertyDecorator((pre: string) => string().startsWith(pre))(prefix);
}
