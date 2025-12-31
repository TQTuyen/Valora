/**
 * @ArrayMinSize Decorator
 * @module decorators/property/array/array-min-size
 */

import { array } from '@validators/array';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates minimum array length
 *
 * @param min - Minimum number of items
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Post {
 *   @IsArray()
 *   @ArrayMinSize(1)
 *   tags: string[];
 * }
 * ```
 */
export function ArrayMinSize(min: number): PropertyDecorator {
  return createPropertyDecorator((minLength: number) => array().min(minLength))(min);
}
