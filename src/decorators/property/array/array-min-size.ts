/**
 * @ArrayMinSize Decorator
 * @module decorators/property/array/array-min-size
 */

import { array } from '@validators/array';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that array has at least the specified number of items
 *
 * @param minSize - Minimum array size
 * @param options - Validation options
 * @decorator
 *
 * @example
 *
 * ```typescript
 * class Example {
 *   @ArrayMinSize(3)
 *   items: any[];
 * }
 * ```
 */
export function ArrayMinSize(minSize: number, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((min: number, opts?: ValidationOptions) => array().min(min, opts))(
    minSize,
    options,
  );
}
