/**
 * @Matches Decorator
 * @module decorators/property/string/matches
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

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
export function Matches(pattern: RegExp, options?: string | ValidationOptions): PropertyDecorator {
  return createTypeDecorator(() => {
    const opts = typeof options === 'string' ? { message: options } : options;
    return string().matches(pattern, opts);
  })();
}
