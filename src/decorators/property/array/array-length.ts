/**
 * @ArrayLength Decorator
 * @module decorators/property/array/array-length
 */

import { array } from '@validators/array';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates exact array length
 *
 * @param length - Exact number of items required
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Coordinate {
 *   @IsArray()
 *   @ArrayLength(2)
 *   point: number[]; // [x, y]
 * }
 * ```
 */
export function ArrayLength(length: number): PropertyDecorator {
  return createPropertyDecorator((len: number) => array().length(len))(length);
}
