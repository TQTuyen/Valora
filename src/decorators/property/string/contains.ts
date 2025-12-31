/**
 * @Contains Decorator
 * @module decorators/property/string/contains
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates that string contains a specific substring
 *
 * @param substring - Required substring
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Message {
 *   @IsString()
 *   @Contains('important')
 *   content: string;
 * }
 * ```
 */
export function Contains(substring: string): PropertyDecorator {
  return createPropertyDecorator((sub: string) => string().contains(sub))(substring);
}
