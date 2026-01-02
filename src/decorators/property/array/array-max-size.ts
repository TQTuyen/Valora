/**
 * @ArrayMaxSize Decorator
 * @module decorators/property/array/array-max-size
 */

import { array } from '@validators/array';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that array has at most the specified number of items
 *
 * @param maxSize - Maximum array size
 * @param options - Validation options
 * @decorator
 *
 * @example
 *
 * ```typescript
 * class Example {
 *   @ArrayMaxSize(10)
 *   items: any[];
 * }
 * ```
 */
export function ArrayMaxSize(maxSize: number, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((max: number, opts?: ValidationOptions) => array().max(max, opts))(
    maxSize,
    options,
  );
}
