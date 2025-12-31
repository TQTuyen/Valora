/**
 * @ArrayNotEmpty Decorator
 * @module decorators/property/array/array-not-empty
 */

import { array } from '@validators/array';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that array is not empty
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Post {
 *   @IsArray()
 *   @ArrayNotEmpty()
 *   tags: string[];
 * }
 * ```
 */
export function ArrayNotEmpty(): PropertyDecorator {
  return createTypeDecorator(() => array().notEmpty())();
}
