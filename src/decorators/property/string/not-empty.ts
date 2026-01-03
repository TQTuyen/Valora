/**
 * @NotEmpty Decorator
 * @module decorators/property/string/not-empty
 */

import { string } from '@validators/string';

import { createTypeDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

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
export function NotEmpty(options?: ValidationOptions): PropertyDecorator {
  return createTypeDecorator(() => string().notEmpty(options))();
}
