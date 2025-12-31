/**
 * @Matches Decorator
 * @module decorators/property/string/matches
 */

import { string } from '@validators/string';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates string against a regex pattern
 *
 * @param pattern - Regular expression to match
 * @param message - Optional custom error message
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsString()
 *   @Matches(/^[a-z0-9_]+$/, 'Username must be lowercase alphanumeric')
 *   username: string;
 * }
 * ```
 */
export function Matches(pattern: RegExp, message?: string): PropertyDecorator {
  return createPropertyDecorator((regex: RegExp, msg?: string) =>
    string().matches(regex, msg)
  )(pattern, message);
}
