/**
 * @ArrayLength Decorator
 * @module decorators/property/array/array-length
 */

import { array } from '@validators/array';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that array has the exact specified number of items
 *
 * @param exactSize - Exact array size
 * @param options - Validation options
 * @decorator
 *
 * @example
 *
 * ```typescript
 * class Example {
 *   @ArrayLength(3)
 *   items: any[];
 * }
 * ```
 */
export function ArrayLength(exactSize: number, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((len: number, opts?: ValidationOptions) =>
    array().length(len, opts),
  )(exactSize, options);
}
