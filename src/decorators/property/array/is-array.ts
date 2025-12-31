/**
 * @IsArray Decorator
 * @module decorators/property/array/is-array
 */

import { array } from '@validators/array';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that the value is an array
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Post {
 *   @IsArray()
 *   tags: string[];
 * }
 * ```
 */
export function IsArray(): PropertyDecorator {
  return createTypeDecorator(() => array())();
}
