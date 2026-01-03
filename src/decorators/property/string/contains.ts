/**
 * @Contains Decorator
 * @module decorators/property/string/contains
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

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
export function Contains(substring: string, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((sub: string, options?: ValidationOptions) =>
    string().contains(sub, options),
  )(substring, options);
}
