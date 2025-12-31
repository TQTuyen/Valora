/**
 * @ArrayMaxSize Decorator
 * @module decorators/property/array/array-max-size
 */

import { array } from '@validators/array';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates maximum array length
 *
 * @param max - Maximum number of items
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Post {
 *   @IsArray()
 *   @ArrayMaxSize(10)
 *   tags: string[];
 * }
 * ```
 */
export function ArrayMaxSize(max: number): PropertyDecorator {
  return createPropertyDecorator((maxLength: number) => array().max(maxLength))(max);
}
