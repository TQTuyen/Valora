/**
 * @NotEmpty Decorator
 * @module decorators/property/string/not-empty
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that string is not empty or whitespace only
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Post {
 *   @IsString()
 *   @NotEmpty()
 *   title: string;
 * }
 * ```
 */
export function NotEmpty(): PropertyDecorator {
  return createTypeDecorator(() => string().notEmpty())();
}
